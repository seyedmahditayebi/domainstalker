'use client';
import { Ellipsis, Pencil, FileText } from 'lucide-react';
import Link from 'next/link';
import { RefObject, useEffect, useRef, useState, MouseEvent } from 'react';

export default function DomainDetailButton({ domain }: { domain: string }) {
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
      {isOpen && <PopUp ref={ref} handler={handleClick} domain={domain} />}
    </div>
  );
}

function PopUp({
  ref,
  handler,
  domain,
}: {
  ref: RefObject<HTMLElement | null>;
  handler: () => void;
  domain: string;
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
        <Link
          href={`/${domain}`}
          className="px-4 py-2 hover:bg-primary-600 cursor-pointer flex items-center justify-between"
        >
          <p>Details</p>
          <FileText size={20} />
        </Link>
      </li>

      <li>
        <Link
          href={`/${domain}/edit`}
          className="px-4 py-2 hover:bg-primary-600 cursor-pointer flex items-center justify-between"
        >
          <p>Edit</p>
          <Pencil size={20} />
        </Link>
      </li>
    </ul>
  );
}
