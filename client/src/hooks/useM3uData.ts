import { useQuery } from '@tanstack/react-query';
import { parseM3u } from '@/lib/m3u-parser';
import type { Channel } from '@/lib/types';

export function useM3uData() {
  return useQuery<Channel[]>({
    queryKey: ['channels'],
    queryFn: async () => {
      try {
        const response = await fetch('https://playtv-backend.onrender.com/api/channels');
        if (!response.ok) {
          throw new Error(`Erreur HTTP! statut: ${response.status}`);
        }
        const content = await response.text();
        return parseM3u(content);
      } catch (error) {
        console.error('Erreur lors du chargement des chaînes:', error);
        throw new Error('Impossible de charger les chaînes. Veuillez réessayer plus tard.');
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
}
