'use server';
import db from '@/lib/appDataSource';
import { Domain } from '@repo/db/Domain';
import { Scan } from '@repo/db/Scan';

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
