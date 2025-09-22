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
    throw new Error(error.message);
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
    throw new Error(error.message);
  }
}

export async function addDomain(formData: FormData) {
  const [name, days, hours] = formData.values();
  if (!isValidDomain(name as string))
    throw new Error('Please give a valid domain');

  if (Number(hours) < 1 && Number(days) < 1)
    throw new Error('Please fill hour or day or both');

  const connection = new Redis({ maxRetriesPerRequest: null });
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
