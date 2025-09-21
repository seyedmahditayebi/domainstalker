'use client';
import { Ellipsis } from 'lucide-react';
import { RefObject, useEffect, useRef, useState } from 'react';
import DownloadScanButton from './DownloadScanButton';

export default function ScanDetailButton({ scanId }: { scanId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);

  function handleClick() {
    setIsOpen((cur) => !cur);
  }
  return (
    <div className="relative">
      <button className="basis-full hover:cursor-pointer" onClick={handleClick}>
        <Ellipsis className="hover:stroke-blue-500" />
      </button>
      {isOpen && <PopUp ref={ref} handler={handleClick} scanId={scanId} />}
    </div>
  );
}

function PopUp({
  ref,
  handler,
  scanId,
}: {
  ref: RefObject<HTMLElement | null>;
  handler: () => void;
  scanId: string;
}) {
  useEffect(
    function () {
      function handleClick(e) {
        if (ref.current && !ref.current.contains(e.target)) {
          handler();
        }
      }

      document.addEventListener('click', handleClick);

      return () => document.removeEventListener('click', handleClick);
    },
    [ref, handler]
  );
  return (
    <ul
      ref={ref as RefObject<HTMLUListElement>}
      className="absolute bottom-0 bg-primary-800 w-36 -translate-x-full translate-y-1/2 -left-0 border border-gray-300 rounded-md "
    >
      <li>
        <DownloadScanButton scanId={scanId} />
      </li>
    </ul>
  );
}
