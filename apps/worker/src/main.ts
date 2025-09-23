import db from '@repo/db/db';
import { Domain } from '@repo/db/Domain';
import { Scan } from '@repo/db/Scan';
import {
  cleanBullmqJobs,
  getDomainInterval,
  updateNextScanField,
} from './utils';
import { Worker, Queue } from 'bullmq';
import Redis from 'ioredis';
import path from 'path/posix';
import { dayjsExtended } from './dayjsExtended';
import dotenv from 'dotenv';
import { env } from 'process';

dotenv.config();

async function init() {
  const database = await db();
  const domains = await database.manager.find(Domain);

  const connection = new Redis({
    maxRetriesPerRequest: null,
    host: env['REDIS_HOST'],
    port: Number(env['REDIS_PORT']),
  });

  const queue = new Queue('scanjob', { connection });
  await cleanBullmqJobs(queue);

  domains.map(async (item) => {
    if (item.status === 'scheduled') {
      const interval_seconds = await getDomainInterval(item.id);
      if (item.nextScan !== null) {
        if (dayjsExtended(item.nextScan).isBefore(new Date())) {
          // if next_scan is in the past update it and add it to worker
          await updateNextScanField(item.id, interval_seconds);
          queue.upsertJobScheduler(
            item.name,
            { every: interval_seconds * 1000 },
            { data: { name: item.name, id: item.id } }
          );
        } else {
          // if next_scan is in the future add it to worker
          queue.upsertJobScheduler(
            item.name,
            { every: interval_seconds * 1000 },
            { data: { name: item.name, id: item.id } }
          );
        }
      } else {
        // if next scan is null update it and add it to worker
        await updateNextScanField(item.id, interval_seconds);

        queue.upsertJobScheduler(
          item.name,
          { every: interval_seconds * 1000 },
          { data: { name: item.name, id: item.id } }
        );
      }
    }
  });

  const worker = new Worker('scanjob', path.join(__dirname, 'scanWorker.js'), {
    connection,
    concurrency: 10,
    autorun: false,
  });

  worker.on('completed', async (job, result) => {
    const { discovered_subdomains, started_at, finished_at } = result;
    const totalUniqueSubdomains = new Set<string>();

    const domain = await database.manager.findOneBy(Domain, {
      id: job.data.id,
    });
    if (domain.totalSubdomains) {
      domain.totalSubdomains
        .trim()
        .split('\n')
        .map((item) => totalUniqueSubdomains.add(item));
    }
    if (discovered_subdomains) {
      discovered_subdomains
        .trim()
        .split('\n')
        .map((item) => totalUniqueSubdomains.add(item));
    }

    await database.manager.insert(Scan, {
      domain: job.data.id,
      discoveredSubdomains: discovered_subdomains.trim(),
      startedAt: started_at,
      finishedAt: finished_at,
    });
    await database.manager.update(Domain, job.data.id, {
      status: 'scheduled',
      totalSubdomains: Array.from(totalUniqueSubdomains).join('\n'),
    });
  });

  worker.on('active', async (job) => {
    await database.manager.update(Domain, job.data.id, { status: 'scanning' });
  });

  worker.on('failed', async (job) => {
    await database.manager.update(Domain, job.data.id, { status: 'scheduled' });
  });

  // Cleaning on Ctrl+C
  process.on('SIGINT', async () => {
    console.log('Cleaning jobs...');
    const jobs = await queue.getJobSchedulers();
    await Promise.all(
      jobs.map(async (item) => {
        await queue.removeJobScheduler(item.key);
      })
    );
    await worker.close(true);
    process.exit(0);
  });

  worker.run();
  console.log('worker is running...');
}

(async () => {
  init();
})();
