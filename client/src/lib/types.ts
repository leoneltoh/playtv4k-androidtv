export interface Program {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  category?: string;
  thumbnail?: string;
}

export interface Channel {
  id: string;
  name: string;
  url: string;
  logo?: string;
  group?: string;
  currentProgram?: Program;
  programs?: Program[];
}

export interface M3uFile {
  channels: Channel[];
}
