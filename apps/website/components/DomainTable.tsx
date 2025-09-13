import { type ReactNode } from 'react';

interface DomainTableProps {
  children: ReactNode;
  className: string;
}

export default function DomainTable({ children, className }: DomainTableProps) {
  return <div className={className}>{children}</div>;
}

function Header({ children }: { children: ReactNode }) {
  return (
    <div className="font-bold text-xl *:p-5 border-b border-primary-50/20">
      {children}
    </div>
  );
}

function Body({ children }: { children: ReactNode }) {
  return <div className="*:p-5 divide-y">{children}</div>;
}

function Row({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

DomainTable.Header = Header;
DomainTable.Body = Body;
DomainTable.Row = Row;
