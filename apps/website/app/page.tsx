import DomainTable from '@/components/DomainTable';
import Overview from '@/components/Overview';
import { Ellipsis } from 'lucide-react';
import { fakeData } from '@/utils/fakedata';
import stateStyle from '@/types/stateStyle';
import dayjsRelativeTime from '@/utils/dayjsRelativeTime';

export default function Page() {
  return (
    <main className="px-12 pt-8 ">
      <Overview />
      <DomainTable className="*:grid *:grid-cols-[1fr_1fr_1fr_1fr_60px]  *:divide-x *:divide-solid  *:divide-primary-50/20  border border-primary-50/70 rounded-md">
        <DomainTable.Header>
          <p>Domain</p>
          <p>Found Subdomains</p>
          <p>Status</p>
          <p className="col-span-2">Next Scan</p>
        </DomainTable.Header>
        <DomainTable.Body>
          {fakeData.map((item) => (
            <DomainTable.Row key={item.id}>
              <p className="font-semibold">{item.domain}</p>
              <p>{item.subdomainsCount}</p>
              <div>
                <p
                  className={`inline border ${
                    stateStyle[item.status]
                  } text-sm rounded-md  py-1 px-2`}
                >
                  {item.status}
                </p>
              </div>
              <p>
                {item.nextScan
                  ? dayjsRelativeTime(item.nextScan).fromNow()
                  : 'Never'}
              </p>
              <button>
                <Ellipsis />
              </button>
            </DomainTable.Row>
          ))}
        </DomainTable.Body>
      </DomainTable>
    </main>
  );
}
