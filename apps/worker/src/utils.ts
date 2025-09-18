import db from '@repo/db/db';
import { Domain } from '@repo/db/Domain';
import { Queue } from 'bullmq';
import { dayjsExtended } from './dayjsExtended';

export async function updateNextScanField(
  domainId: Domain['id'],
  interval_seconds: number
) {
  const database = await db();
  await database.manager.update(Domain, domainId, {
    nextScan: dayjsExtended().add(interval_seconds, 'seconds'),
  });
}

export async function getDomainInterval(
  domainId: Domain['id']
): Promise<number> {
  const database = await db();
  const [{ interval_seconds }]: { interval_seconds: string }[] =
    await database.manager.query(
      `SELECT EXTRACT(EPOCH FROM scan_interval) AS interval_seconds FROM domain WHERE id = ${domainId};`
    );
  return Number.parseInt(interval_seconds);
}

export async function cleanBullmqJobs(queue: Queue) {
  const jobs = await queue.getJobSchedulers();
  await Promise.all(
    jobs.map(async (item) => {
      await queue.removeJobScheduler(item.key);
    })
  );
}
