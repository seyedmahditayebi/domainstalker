import { Calendar, Home } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import AddDomainButton from './AddDomainButton';

export default function SideNav() {
  return (
    <nav className="relative w-1/6  border-primary-50/20 h-dvh">
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
  );
}
