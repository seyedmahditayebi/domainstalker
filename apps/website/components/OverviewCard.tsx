import { ReactNode } from 'react';

interface OverviewCardProps {
  text: string;
  data: number | string;
  icon: ReactNode;
}
export default function OverviewCard({ text, data, icon }: OverviewCardProps) {
  return (
    <div className="grid grid-cols-[25px_1fr] gap-2 items-center mt-5 border-t border-primary-50/20 pb-4 px-2 pt-4  ">
      <div>{icon}</div>
      <p className="text-base lg:text-xl">{text}</p>
      <p className="font-bold text-base lg:text-xl col-start-2">{data}</p>
    </div>
  );
}
