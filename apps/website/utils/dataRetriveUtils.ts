import db from '@/lib/appDataSource';
import { Domain } from '@repo/db/Domain';
import { Scan } from '@repo/db/Scan';

export async function getAllDomainsCount() {
  return await db.manager.count(Domain);
}

export async function getCurrentlyScheduledCount() {
  return await db.manager.count(Domain, {
    where: {
      status: 'scheduled',
    },
  });
}

export async function getCurrentlyScanningCount() {
  return await db.manager.count(Domain, {
    where: {
      status: 'scanning',
    },
  });
}

export async function getAllSubdomainsCount(): Promise<number> {
  const allSubdomains = await db.manager.query(
    `SELECT SUM(
    CASE
        WHEN total_subdomains IS NULL OR total_subdomains = '' THEN 0
        ELSE REGEXP_COUNT(total_subdomains, E'\n') + 1
    END
    ) AS all_domains_subdomains FROM domain;`
  );
  return allSubdomains[0]['all_domains_subdomains'];
}

export async function getSubdomainsCount(domainId: string): Promise<number> {
  const allSubdomains = await db.manager.query(
    `SELECT
    CASE
        WHEN total_subdomains IS NULL OR total_subdomains = '' THEN 0
        ELSE REGEXP_COUNT(total_subdomains, E'\n') + 1
    END
     AS all_subdomains_count FROM domain where id=${domainId};`
  );
  return allSubdomains[0]['all_subdomains_count'];
}

export async function getScans(domainId: string, withSubdomains: boolean) {
  return await db.manager.find(Scan, {
    where: { domain: { id: domainId } },
    select: {
      id: true,
      startedAt: true,
      finishedAt: true,
      domain: true,
      discoveredSubdomains: withSubdomains,
    },
  });
}

export async function getDomainIdByName(domainName: string) {
  return await db.manager.findOneOrFail(Domain, {
    where: { name: domainName },
    select: { id: true },
  });
}
