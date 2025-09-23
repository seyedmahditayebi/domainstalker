'use server';
import db from '@/lib/appDataSource';
import { isValidDomain } from '@/utils/isValidDomain';
import { Domain } from '@repo/db/Domain';
import { Scan } from '@repo/db/Scan';
import { revalidatePath } from 'next/cache';
import { dayjsExtended } from './dayjsExtended';
import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { getDomainIdByName } from '@/utils/dataRetriveUtils';
import formatInterval from '@/utils/formatInterval';
import { env } from 'process';

export async function getAllSubdomains(domainId: string) {
  try {
    const domain = await db.manager.findOne(Domain, {
      where: { id: domainId },
    });

    if (!domain) {
      throw new Error('Domain not found');
    }
    const allSubdomains = domain.totalSubdomains;

    if (allSubdomains === null || allSubdomains.length === 0) {
      throw new Error('There is no subdomains');
    }
    return { allSubdomains, domainName: domain.name };
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    else throw new Error('unknown error happend');
  }
}

export async function getScanSubdomains(scanId: string) {
  try {
    const scan = await db.manager.findOne(Scan, {
      where: { id: scanId },
    });

    if (!scan) {
      throw new Error('Scan record not found');
    }
    const subdomains = scan.discoveredSubdomains;

    if (subdomains === null || subdomains.length === 0) {
      throw new Error('There is no subdomains');
    }
    return {
      subdomains,
      finished_at: scan.finishedAt.toISOString(),

      // Doing this so i don't query database for getting domain name
      name: subdomains
        .slice(0, subdomains.indexOf('\n'))
        .split('.')
        .slice(-2)
        .join('.'),
    };
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    else throw new Error('unknown error happend');
  }
}

export async function addDomain(formData: FormData) {
  const [name, days, hours] = formData.values();
  if (!isValidDomain(name as string))
    throw new Error('Please give a valid domain');

  if (Number(hours) < 1 && Number(days) < 1)
    throw new Error('Please fill hour or day or both');

  const connection = new Redis({
    maxRetriesPerRequest: null,
    host: env['REDIS_HOST'],
    port: Number(env['REDIS_PORT']),
  });

  const queue = new Queue('scanjob', { connection });

  const domain = new Domain();
  domain.name = name as string;
  domain.status = 'scheduled';
  domain.scanInterval = `${days} day ${hours} hour`;
  domain.nextScan = dayjsExtended()
    .add(Number(days), 'days')
    .add(Number(hours), 'hours')
    .toDate();
  await db.manager.save(domain);

  const domainId = await getDomainIdByName(name as string);
  queue.upsertJobScheduler(
    name as string,
    {
      every: dayjsExtended
        .duration({ days: Number(days), hours: Number(hours) })
        .asMilliseconds(),
    },
    { data: { name: name as string, id: domainId.id } }
  );

  revalidatePath('/');
}

export async function updateDomain(formData: FormData) {
  const [name, days, hours] = formData.values();
  if (Number(hours) < 1 && Number(days) < 1)
    throw new Error('Please fill hour or day or both');

  const connection = new Redis({
    maxRetriesPerRequest: null,
    host: env['REDIS_HOST'],
    port: Number(env['REDIS_PORT']),
  });

  const queue = new Queue('scanjob', { connection });

  const domain = await db.manager.findOneBy(Domain, { name: name as string });
  if (domain) {
    domain.scanInterval = `${days} day ${hours} hour`;
    domain.nextScan = dayjsExtended()
      .add(Number(days), 'days')
      .add(Number(hours), 'hours')
      .toDate();
    await db.manager.save(domain);

    await queue.removeJobScheduler(name as string);
    queue.upsertJobScheduler(
      name as string,
      {
        every: dayjsExtended
          .duration({ days: Number(days), hours: Number(hours) })
          .asMilliseconds(),
      },
      { data: { name: name as string, id: domain.id } }
    );

    revalidatePath('/');
  }
}

export async function getDomainInterval(domainName: string): Promise<string> {
  const domain = await db.manager.findOne(Domain, {
    where: { name: domainName },
    select: { scanInterval: true },
  });

  if (domain) {
    const days = dayjsExtended.duration(domain.scanInterval.toISO()).days();
    const hours = dayjsExtended.duration(domain.scanInterval.toISO()).hours();
    return formatInterval(days, hours);
  }
  return 'failed to get interval';
}
