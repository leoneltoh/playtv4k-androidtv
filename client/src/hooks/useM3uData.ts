import { useQuery } from '@tanstack/react-query';
import type { Channel } from '@/lib/types';
import { parseM3u } from '@/lib/m3u-parser';

const API_URL = import.meta.env.PROD 
  ? '/.netlify/functions/api'
  : 'http://localhost:5000/api/channels';

export function useM3uData() {
  return useQuery<Channel[]>({
    queryKey: ['channels'],
    queryFn: async () => {
      try {
        const response = await fetch(API_URL);
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
