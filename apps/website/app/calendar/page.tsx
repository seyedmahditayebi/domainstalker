import TimeChart from '@/components/TimeChart';
import db from '@/lib/appDataSource';
import { Domain } from '@repo/db/Domain';
export const dynamic = 'force-dynamic';
export const revalidate = 10;
export default async function Page() {
  const domains = await db.manager.find(Domain, {
    select: { name: true, nextScan: true, scanInterval: true },
    where: [{ status: 'scanning' }, { status: 'scheduled' }],
  });

  return <TimeChart domains={JSON.parse(JSON.stringify(domains))} />;
}
