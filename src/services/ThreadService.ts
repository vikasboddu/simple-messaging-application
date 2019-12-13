import { ThreadDao } from '../dao/ThreadDao';
import { Message, Thread } from '../models/Thread';
import { UserService } from './UserService';

export class ThreadService {
  constructor(private threadDao: ThreadDao, private userService: UserService) {}

  public async createThread(): Promise<number> {
    return (await this.threadDao.createThread()).insertId;
  }

  public async getThreadById(id: number): Promise<string[]> {
    return this.threadDao.getThreadById(id);
  }

  public async createMessage(
    username: string,
    threadId: number,
    message: string
  ) {
    const userId = await this.userService.getUserIdByUsername(username);
    return this.threadDao.createMessage(userId, threadId, message);
  }

  public async joinThread(username: string, threadId: number) {
    const userId = await this.userService.getUserIdByUsername(username);
    await this.threadDao.joinThread(userId, threadId);
  }

  public async getMessagesInThread(threadId: number): Promise<Thread> {
    const messages = (await this.threadDao.getMessagesInThread(threadId)).map(
      (rdp: { username: string; message: string }) => {
        return {
          username: rdp.username,
          message: rdp.message,
        } as Message;
      }
    );

    return { messages } as Thread;
  }
}
