'use client';
import { AlignJustify, Calendar, Home, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import AddDomainButton from './AddDomainButton';
import { useState } from 'react';

export default function SideNav() {
  const [isOpen, setIsOpen] = useState(false);
  function toggleSideNav() {
    setIsOpen((cur) => !cur);
  }

  return (
    <>
      <nav className="sticky top-0 w-full flex lg:hidden items-center justify-between py-2 bg-primary-900 px-2">
        <div className="w-9 cursor-pointer" onClick={toggleSideNav}>
          {isOpen ? <X size={36} /> : <AlignJustify size={36} />}
        </div>
        <Link href="/">
          <Image
            src="/logo.png"
            alt="app logo"
            width={140}
            height={280}
          ></Image>
        </Link>
        <div className="w-9"></div>
      </nav>
      <div
        className={`lg:hidden bg-primary-700 absolute  ${isOpen ? '' : '-translate-x-full'} duration-1000 transition-all w-dvw h-full`}
      >
        <div className="flex justify-between flex-col h-4/5">
          <div>
            <div className="flex *:space-x-3 *:flex flex-col px-3 mt-5 *:py-3 *:px-2 space-y-4 *:rounded-md *:hover:bg-primary-600 *:hover:cursor-pointer">
              <Link href="/" onClick={toggleSideNav}>
                <Home />
                <p>Home</p>
              </Link>
              <Link href="/calendar" onClick={toggleSideNav}>
                <Calendar />
                <p>Calendar</p>
              </Link>
            </div>
          </div>
          <div className="flex justify-center mb-10">
            <AddDomainButton />
          </div>
        </div>
      </div>
      <nav className="w-1/6 hidden lg:block border-primary-50/20 h-dvh">
        <div className="width-inherit fixed h-dvh">
          <div className="flex justify-between flex-col h-full">
            <div>
              <Link
                href="/"
                className="flex border-b border-primary-50/20 pb-8 flex-col items-center pt-8"
              >
                <Image
                  src="/logo.png"
                  alt="app logo"
                  width={120}
                  height={240}
                ></Image>
                <p className="text-2xl font-bold">DomainStalker</p>
              </Link>
              <div className="flex *:space-x-3 *:flex flex-col px-5 mt-8 *:py-3 *:px-2 space-y-4 *:rounded-md *:hover:bg-primary-600 *:hover:cursor-pointer">
                <Link href="/">
                  <Home />
                  <p>Home</p>
                </Link>
                <Link href="/calendar">
                  <Calendar />
                  <p>Calendar</p>
                </Link>
              </div>
            </div>
            <div className="flex justify-center mb-10">
              <AddDomainButton />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
