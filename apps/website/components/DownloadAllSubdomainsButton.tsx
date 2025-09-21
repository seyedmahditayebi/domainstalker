'use client';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { getAllSubdomains } from '@/lib/actions';

interface DownloadAllSubdomainsButtonProps {
  domainId: string;
}

export default function DownloadAllSubdomainsButton({
  domainId,
}: DownloadAllSubdomainsButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const data = await getAllSubdomains(domainId);

      const blob = new Blob([data.allSubdomains], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${data.domainName}.txt`;
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
      className={`flex items-center space-x-1 ${isLoading ? 'text-primary-300 bg-accent-800 hover:cursor-progress' : 'bg-accent-700 hover:cursor-pointer hover:bg-accent-600'}`}
      disabled={isLoading}
      onClick={handleDownload}
    >
      <p>{isLoading ? 'Downloading...' : 'Download All'}</p>
      <Download size={16} />
    </button>
  );
}
