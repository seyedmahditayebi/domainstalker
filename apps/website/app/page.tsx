import DomainTable from '@/components/DomainTable';
import DomainOverview from '@/components/DomainOverview';
import DomainDetailButton from '@/components/DomainDetailButton';
import stateStyle from '@/types/stateStyle';
import { dayjsExtended } from '@/lib/dayjsExtended';
import db from '@/lib/appDataSource';
import { Domain } from '@repo/db/Domain';

export default async function Page() {
  const data = await db.manager.find(Domain, {
    select: {
      name: true,
      id: true,
      scanInterval: true,
      nextScan: true,
      status: true,
      totalSubdomains: true,
    },
  });
  return (
    <main className="px-12 py-8 ">
      <DomainOverview />
      <DomainTable className="*:grid *:grid-cols-[1fr_1fr_1fr_1fr_60px]  *:divide-x *:divide-solid  *:divide-primary-50/20  border border-primary-50/70 rounded-md">
        <DomainTable.Header>
          <p>Domain</p>
          <p>Found Subdomains</p>
          <p>Status</p>
          <p className="col-span-2">Next Scan</p>
        </DomainTable.Header>
        <DomainTable.Body>
          {data.map((item) => (
            <DomainTable.Row key={item.id}>
              <p className="font-semibold">{item.name}</p>
              <p>
                {item.totalSubdomains
                  ? item.totalSubdomains.split('\n').length
                  : 0}
              </p>
              <div>
                <p
                  className={`inline border ${
                    item.status && stateStyle[item.status]
                  } text-sm rounded-md py-1 px-2`}
                >
                  {item.status}
                </p>
              </div>
              <p>
                {item.nextScan
                  ? dayjsExtended(item.nextScan).fromNow()
                  : 'Never'}
              </p>
              <DomainDetailButton domain={item.name} />
            </DomainTable.Row>
          ))}
        </DomainTable.Body>
      </DomainTable>
    </main>
  );
}
