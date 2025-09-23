import { getDomainIdByName } from '@/utils/dataRetriveUtils';
import { getAllSubdomains } from '@/lib/actions';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ domainName: string }> }
) {
  const { domainName } = await params;
  try {
    const domainId = await getDomainIdByName(domainName);

    const subdomains = await getAllSubdomains(domainId.id);

    return new Response(subdomains.allSubdomains, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch {
    return new Response(`Couldn't get data`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}
