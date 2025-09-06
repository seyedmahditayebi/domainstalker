import { Clock, Crosshair, Globe, Search, Target } from 'lucide-react';
import colors from 'tailwindcss/colors';
import OverviewCard from './OverviewCard';

export default function Overview() {
  return (
    <div>
      <div className="">
        <h1 className="text-2xl font-bold">Overview:</h1>
      </div>
      <div className="flex justify-evenly">
        <OverviewCard
          data={4}
          text="Total Domains"
          icon={<Globe color={colors.blue[500]} />}
        />
        <OverviewCard
          data={1}
          text="Scanning"
          icon={<Search color={colors.slate[400]} />}
        />
        <OverviewCard
          data={20}
          text="Total Subdomains"
          icon={<Crosshair color={colors.red[500]} />}
        />
        <OverviewCard
          data={7}
          text="Scans in Schedule"
          icon={<Clock color={colors.green[500]} />}
        />
      </div>
    </div>
  );
}
