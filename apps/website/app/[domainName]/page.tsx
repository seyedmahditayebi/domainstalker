import { dayjsExtended } from '@/lib/dayjsExtended';
import ScanOverview from '@/components/ScanOverview';
import { Eye, Pencil } from 'lucide-react';
import DomainTable from '@/components/DomainTable';
import ScanDetailButton from '@/components/ScanDetailButton';
import Link from 'next/link';
import DownloadAllSubdomainsButton from '@/components/DownloadAllSubdomainsButton';
import { getDomainIdByName, getScans } from '@/utils/dataRetriveUtils';

interface PageProps {
  params: Promise<{
    domainName: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { domainName } = await params;
  const domainId = await getDomainIdByName(domainName);
  const allScans = await getScans(domainId.id, true);
  return (
    <main>
      <div className="flex justify-between items-center border-b border-primary-50/20  py-5 px-6">
        <h1 className="font-bold text-3xl">{domainName}</h1>
        <nav className="">
          <ul className="flex space-x-2  *:*:px-4 *:*:py-3 *:*:rounded-md">
            <li>
              <Link
                href={`/${domainName}/edit`}
                className="flex space-x-1 items-center bg-accent-700 hover:cursor-pointer hover:bg-accent-600"
              >
                <p>Edit</p>
                <Pencil size={16} />
              </Link>
            </li>
            <li>
              <DownloadAllSubdomainsButton domainId={domainId.id} />
            </li>
            <li>
              <Link
                href={`/api/raw/domain/${domainName}`}
                className="flex space-x-1 items-center bg-accent-700 hover:cursor-pointer hover:bg-accent-600"
              >
                <p>View Raw All</p>
                <Eye size={16} />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="px-12 py-8 ">
        <ScanOverview domainId={domainId.id} />
        <DomainTable className="*:grid *:grid-cols-[1fr_1fr_1fr_1fr_60px]  *:divide-x *:divide-solid  *:divide-primary-50/20  border border-primary-50/70 rounded-md">
          <DomainTable.Header>
            <p>Started_at</p>
            <p>Finished_at</p>
            <p>Found Subdoamins</p>
            <p className="col-span-2">Duration</p>
          </DomainTable.Header>
          <DomainTable.Body>
            {allScans.map((item) => (
              <DomainTable.Row key={item.id}>
                <p>
                  {dayjsExtended(item.startedAt).format('D MMM YYYY HH:mm:ss')}
                </p>
                <p>
                  {dayjsExtended(item.finishedAt).format('D MMM YYYY HH:mm:ss')}
                </p>
                <p>
                  {item.discoveredSubdomains
                    ? item.discoveredSubdomains.split('\n').length
                    : 0}
                </p>
                <div>
                  <p className={`py-1 px-2`}>
                    {dayjsExtended
                      .duration(
                        dayjsExtended(item.finishedAt).diff(
                          item.startedAt,
                          's'
                        ),
                        'second'
                      )
                      .humanize()}
                  </p>
                </div>
                <ScanDetailButton scanId={item.id} />
              </DomainTable.Row>
            ))}
          </DomainTable.Body>
        </DomainTable>
      </div>
    </main>
  );
}
