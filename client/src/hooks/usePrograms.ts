import { useQuery } from '@tanstack/react-query';
import type { Program } from '@/lib/types';

export function usePrograms(channelId?: string, start?: Date, end?: Date) {
  return useQuery<Program[]>({
    queryKey: ['programs', channelId, start, end],
    queryFn: async () => {
      if (!channelId) return [];
      
      const params = new URLSearchParams({
        start: start?.toISOString() || new Date().toISOString(),
        end: end?.toISOString() || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });

      const response = await fetch(`/api/channels/${channelId}/programs?${params}`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des programmes');
      }
      return response.json();
    },
    enabled: !!channelId,
  });
}
