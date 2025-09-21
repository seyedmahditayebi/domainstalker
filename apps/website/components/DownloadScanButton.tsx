'use client';

import { getScanSubdomains } from '@/lib/actions';
import { Download } from 'lucide-react';
import { useState } from 'react';

export default function DownloadScanButton({ scanId }: { scanId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const data = await getScanSubdomains(scanId);

      const blob = new Blob([data.subdomains], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${data.name}-${data.finished_at.toString()}.txt`;
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading text:', error);
      alert('Failed to download text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <button
      className={`px-4 py-2 w-full h-full flex items-center justify-between ${isLoading ? 'text-primary-500 hover:cursor-progress' : 'hover:bg-primary-600 hover:cursor-pointer text-primary-50'}`}
      disabled={isLoading}
      onClick={handleDownload}
    >
      <p>{isLoading ? 'Downloading...' : 'Download'}</p>
      <Download size={20} />
    </button>
  );
}
