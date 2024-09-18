export interface Room {
  id: string;
  name: string;
  createdAt: number;
}

export interface User {
  id: string;
  displayName?: string;
  email?: string;
  isOnline?: boolean;
}

export interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  timestamp: number;
  fileURL?: string;
  fileType?: string;
  reactions: {
    [emoji: string]: string[];
  };
}