export interface Channel {
  id: string;
  name: string;
  url: string;
  logo?: string;
  group?: string;
}

export interface M3uFile {
  channels: Channel[];
}
