import { Clock, Crosshair, Globe } from 'lucide-react';
import colors from 'tailwindcss/colors';
import OverviewCard from './OverviewCard';
import { getScans, getSubdomainsCount } from '@/utils/dataRetriveUtils';
import { dayjsExtended } from '@/lib/dayjsExtended';

export default async function ScanOverview({ domainId }: { domainId: string }) {
  const allScans = await getScans(domainId, false);
  const allSubdomainsCount = await getSubdomainsCount(domainId);

  let total_time = 0;
  allScans.forEach(
    (item) =>
      (total_time += dayjsExtended(item.finishedAt).diff(item.startedAt, 's'))
  );
  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold">Overview:</h2>
        <div className="flex justify-evenly">
          <OverviewCard
            data={allScans.length}
            text="Total Scans"
            icon={<Globe color={colors.blue[500]} />}
          />
          <OverviewCard
            data={allSubdomainsCount}
            text="Unique Subdomains"
            icon={<Crosshair color={colors.red[500]} />}
          />
          <OverviewCard
            data={dayjsExtended.duration(total_time, 'second').humanize()}
            text="Total Time Spent"
            icon={<Clock color={colors.slate[400]} />}
          />
        </div>
      </div>
    </div>
  );
}
