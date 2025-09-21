import db from '@/lib/appDataSource';
import { Domain } from '@repo/db/Domain';

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
