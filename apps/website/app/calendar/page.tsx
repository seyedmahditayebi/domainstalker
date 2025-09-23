import TimeChart from '@/components/TimeChart';
import db from '@/lib/appDataSource';
import { Domain } from '@repo/db/Domain';
export default async function Page() {
  const domains = await db.manager.find(Domain, {
    select: { name: true, nextScan: true, scanInterval: true },
    where: { status: 'scheduled' },
  });

  return <TimeChart domains={JSON.parse(JSON.stringify(domains))} />;
}
