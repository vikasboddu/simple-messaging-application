export interface Thread {
  messages: Message[];
}

export interface Message {
  username: string;
  message: string;
}
