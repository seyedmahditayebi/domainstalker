'use client';
import formatInterval from '@/utils/formatInterval';
import { useEffect, useRef, useState } from 'react';

interface AddDomainModalProps {
  isOpen: boolean;
  modalToggle: () => void;
}

export default function AddDomainModal({
  isOpen,
  modalToggle,
}: AddDomainModalProps) {
  const [days, setDay] = useState(0);
  const [hours, setHour] = useState(0);
  const inputEl = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        modalToggle();
      }
    };

    inputEl.current = document.getElementById(
      'addDomainInput'
    ) as HTMLInputElement;
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      if (document.activeElement !== inputEl.current) inputEl.current.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
      setDay(0);
      setHour(0);
    };
  }, [isOpen, modalToggle]);

  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-primary-950/90 flex items-center justify-center "
      onClick={(e) => {
        if (e.currentTarget === e.target) modalToggle();
      }}
    >
      <div className="w-1/3 bg-primary-700 p-5 rounded-2xl ">
        <form action="">
          <div>
            <p className="font-bold text-xl">Domain:</p>
            <input
              id="addDomainInput"
              type="text"
              className="mt-2 rounded-sm px-2 py-1 border outline-0  focus:ring-2 focus:border-transparent focus:ring-blue-600"
              placeholder="example.com"
              required
            />
          </div>
          <div>
            <p className="font-bold text-xl mt-5">Interval:</p>
            <div className="flex mt-2 *:*:first:mb-2">
              <div className="flex flex-col w-1/2">
                <label htmlFor="days" className="font-bold">
                  Days:
                </label>
                <input
                  required
                  type="number"
                  name="days"
                  className="border rounded-sm  w-3/4  px-2 py-1 outline-0  focus:ring-2 focus:border-transparent focus:ring-blue-600"
                  onChange={(e) => {
                    setDay(+e.target.value);
                  }}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="hours" className="font-bold">
                  Hours:
                </label>
                <input
                  required
                  type="number"
                  name="hours"
                  className="rounded-sm  w-3/4 px-2 py-1 border outline-0  focus:ring-2 focus:border-transparent focus:ring-blue-600 "
                  onChange={(e) => {
                    setHour(+e.target.value);
                  }}
                />
              </div>
            </div>
            <p className="mt-10 text-primary-50/80">Selected Interval:</p>
            <p className="inline-block text-xl font-bold">
              {formatInterval(days, hours)}
            </p>
            <div className="flex justify-end">
              <button className="py-3 px-8 hover:cursor-pointer hover:bg-accent-600 rounded-md bg-accent-700 font-bold ">
                Add
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
