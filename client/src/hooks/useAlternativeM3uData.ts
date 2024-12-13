import { useQuery } from '@tanstack/react-query';
import { parseM3u } from '@/lib/m3u-parser';
import type { Channel } from '@/lib/types';

export function useAlternativeM3uData() {
  return useQuery<Channel[]>({
    queryKey: ['alternative-channels'],
    queryFn: async () => {
      try {
        const response = await fetch('https://liste-des-chaines-m-3-u-graceafrica2.replit.app/playtv.m3u');
        if (!response.ok) {
          throw new Error(`Erreur HTTP! statut: ${response.status}`);
        }
        const content = await response.text();
        return parseM3u(content);
      } catch (error) {
        console.error('Erreur lors du chargement des chaînes alternatives:', error);
        throw new Error('Impossible de charger les chaînes alternatives.');
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
}
