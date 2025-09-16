import db from '@/utils/appDataSource';
import { Domain } from '@repo/db/Domain';

export async function getAllDomains() {
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
    `SELECT STRING_AGG(total_subdomains, '\\n') AS all_domains_subdomains FROM domain;`
  );
  console.log(allSubdomains[0]['all_domains_subdomains']);
  return allSubdomains[0]['all_domains_subdomains'].split('\\n').length;
}
