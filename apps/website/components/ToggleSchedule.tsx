'use client';
import { toggleSchedule } from '@/lib/actions';
import { Circle } from 'lucide-react';
import { useState } from 'react';

interface ToggleScheduleProps {
  domainName: string;
  domainStatus: 'scanning' | 'scheduled' | 'not-scheduled' | null;
}
export default function ToggleSchedule({
  domainName,
  domainStatus,
}: ToggleScheduleProps) {
  const [status, setStatus] = useState(domainStatus);
  const [isPending, setIsPending] = useState(false);
  async function handleClick() {
    setStatus((cur) => (cur === 'scheduled' ? null : 'scheduled'));
    setIsPending(true);
    try {
      await toggleSchedule(domainName);
    } catch (error) {
      alert('Failed to toggle');
    } finally {
      setIsPending(false);
    }
  }
  if (domainStatus === 'scanning') return null;
  return (
    <button
      onClick={handleClick}
      className={`pl-4 py-2 flex w-full h-full items-center ${isPending ? 'cursor-not-allowed text-primary-600' : 'cursor-pointer hover:bg-primary-600'}`}
      disabled={isPending}
    >
      <p>Schedule</p>
      <div className="flex grow justify-center items-center">
        <div
          className={`transition-colors duration-500 w-10 rounded-2xl p-0.5 ${status === 'scheduled' ? 'bg-accent-600' : 'bg-primary-700'} `}
        >
          <Circle
            size={14}
            className={`transition-transform duration-500 text-primary-100 fill-primary-100 ${status === 'scheduled' ? 'translate-x-5' : ''}`}
          />
        </div>
      </div>
    </button>
  );
}
