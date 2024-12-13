import { useQuery } from '@tanstack/react-query';
import { parseM3u } from '@/lib/m3u-parser';
import type { Channel } from '@/lib/types';

const M3U_URL = 'https://terranovision.replit.app/terranochannel.m3u';

export function useM3uData() {
  return useQuery<Channel[]>({
    queryKey: ['channels'],
    queryFn: async () => {
      const response = await fetch(M3U_URL);
      const content = await response.text();
      return parseM3u(content);
    }
  });
}
