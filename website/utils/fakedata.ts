type domainState = 'scanning' | 'scheduled' | 'not-scheduled';
interface DomainData {
  id: number;
  domain: string;
  subdomainsCount: number;
  status: domainState;
  nextScan?: Date;
}

export const fakeData: DomainData[] = [
  {
    domain: 'example.com',
    subdomainsCount: 2,
    status: 'scanning',
    id: 1,
    nextScan: new Date('2025-09-10 16:01:02.17431'),
  },
  {
    domain: 'twitter.com',
    subdomainsCount: 10,
    status: 'scheduled',
    id: 2,
    nextScan: new Date('2025-09-15 16:01:02.17431'),
  },
  {
    domain: 'tesla.com',
    subdomainsCount: 6,
    status: 'not-scheduled',
    id: 3,
  },
  {
    domain: 'soft.com',
    subdomainsCount: 4,
    status: 'scheduled',
    id: 4,
    nextScan: new Date('2025-09-17 16:01:02.17431'),
  },
];
