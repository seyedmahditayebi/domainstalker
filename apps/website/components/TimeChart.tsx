'use client';
import type React from 'react';
import {
  Chart as ChartJS,
  PointElement,
  Tooltip,
  Legend,
  TimeScale,
  type ChartOptions,
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import colors from 'tailwindcss/colors';
import { Domain } from '@repo/db/Domain';
import { dayjsExtended } from '@/lib/dayjsExtended';
import autocolors from 'chartjs-plugin-autocolors';
import '@/lib/chartjs-adapter-dayjs-4';

ChartJS.register(PointElement, Tooltip, Legend, TimeScale, autocolors);

export default function TimeChart({ domains }: { domains: Domain[] }) {
  const baseDate = dayjsExtended().startOf('day');
  const baseTimestamp = baseDate.valueOf();
  const data = {
    datasets: domains.map((item) => {
      const day10FromNow = baseDate.add(10, 'day');

      let nextScan = dayjsExtended(item.nextScan);
      const interval = dayjsExtended.duration(item.scanInterval);

      let tommorow = baseDate.add(1, 'day').startOf('day');

      let timeCursor = nextScan.clone();

      const pointsData = [];
      while (timeCursor.isBefore(day10FromNow)) {
        while (nextScan.isBefore(tommorow)) {
          pointsData.push({
            x: timeCursor.toISOString(),
            y: nextScan.valueOf(),
            r: 10,
          });
          nextScan = nextScan.add(interval);
          timeCursor = timeCursor.add(interval);
        }
        nextScan = nextScan.subtract(1, 'day');
      }
      return {
        label: item.name,
        data: pointsData,
        borderWidth: 1,
      };
    }),
  };
  const options: ChartOptions<'bubble'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { pointStyle: 'circle', usePointStyle: true },
        onHover: function () {
          document.body.style.cursor = 'pointer';
        },
        onLeave: function () {
          document.body.style.cursor = 'unset';
        },
      },
      tooltip: {
        callbacks: {
          // title: (context) => {
          //   return context[0].dataset.label;
          // },
          label: (context) => {
            const point = context.raw as any;
            return [
              `${context.dataset.label} Future Scan: ${dayjsExtended(point.x).format('MMM D HH:mm')}`,
            ];
          },
        },
      },
      autocolors,
    },
    scales: {
      x: {
        type: 'time',
        position: 'bottom',
        min: baseDate.format(),
        max: baseDate.add(10, 'days').format(),
        ticks: {
          stepSize: 1,
        },
        time: { unit: 'day' },
        title: {
          display: true,
          text: 'Day',
        },
        grid: {
          display: true,
          color: colors.neutral[500],
          offset: false,
        },
      },
      y: {
        type: 'time',
        min: baseTimestamp,
        max: baseTimestamp + 24 * 60 * 60 * 1000,
        adapters: { date: 0 },
        offset: true,
        bounds: 'ticks',
        time: {
          unit: 'hour',
          displayFormats: { hour: 'HH:ss' },
        },
        ticks: {
          stepSize: 1,
        },
        title: {
          display: true,
          text: 'Hour of Day',
        },
        grid: {
          display: true,
          color: colors.neutral[500],
          offset: false,
        },
      },
    },
    interaction: {
      mode: 'point',
    },
  };

  return <Bubble data={data} options={options} />;
}
