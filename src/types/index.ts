export interface Room {
  id: string;
  name: string;
  createdAt: number;
}

export interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  timestamp: number;
  fileURL?: string;
  fileType?: string;
  reactions: { [emoji: string]: string[] };
  type?: 'info' | 'success' | 'warning' | 'error' | 'primary' | 'secondary' | 'accent';
}

