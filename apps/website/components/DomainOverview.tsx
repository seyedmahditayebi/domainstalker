import { Clock, Crosshair, Globe, Search } from 'lucide-react';
import colors from 'tailwindcss/colors';
import OverviewCard from './OverviewCard';
import {
  getAllDomains,
  getAllSubdomainsCount,
  getCurrentlyScanningCount,
  getCurrentlyScheduledCount,
} from '@/utils/dataRetriveUtils';

export default async function DomainOverview() {
  const [allDomains, scheduledDomains, scanningDomains, allSubdomains] =
    await Promise.all([
      getAllDomains(),
      getCurrentlyScheduledCount(),
      getCurrentlyScanningCount(),
      getAllSubdomainsCount(),
    ]);
  return (
    <div>
      <div className="">
        <h1 className="text-2xl font-bold">Overview:</h1>
      </div>
      <div className="flex justify-evenly">
        <OverviewCard
          data={allDomains}
          text="Total Domains"
          icon={<Globe color={colors.blue[500]} />}
        />
        <OverviewCard
          data={scanningDomains}
          text="Scanning"
          icon={<Search color={colors.slate[400]} />}
        />
        <OverviewCard
          data={allSubdomains}
          text="Total Subdomains"
          icon={<Crosshair color={colors.red[500]} />}
        />
        <OverviewCard
          data={scheduledDomains}
          text="Scans in Schedule"
          icon={<Clock color={colors.green[500]} />}
        />
      </div>
    </div>
  );
}
