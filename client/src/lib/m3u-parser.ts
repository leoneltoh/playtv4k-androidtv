import type { Channel } from './types';

export function parseM3u(content: string): Channel[] {
  const lines = content.split('\n');
  const channels: Channel[] = [];
  let currentChannel: Partial<Channel> = {};

  lines.forEach((line) => {
    line = line.trim();
    
    if (line.startsWith('#EXTINF:')) {
      const matches = {
        name: line.match(/,(.+)$/)?.[1] || '',
        logo: line.match(/tvg-logo="([^"]+)"/)?.[1],
        group: line.match(/group-title="([^"]+)"/)?.[1],
      };

      currentChannel = {
        id: crypto.randomUUID(),
        name: matches.name,
        logo: matches.logo,
        group: matches.group,
      };
    } else if (line.startsWith('http')) {
      if (currentChannel.name) {
        channels.push({
          ...currentChannel,
          url: line,
        } as Channel);
        currentChannel = {};
      }
    }
  });

  return channels;
}
