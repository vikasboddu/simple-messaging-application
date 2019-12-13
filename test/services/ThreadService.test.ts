import { promisify } from 'util';

import { ThreadService } from '../../src/services/ThreadService';

import createPool from '../test-connection';
import { Pool } from 'mysql';
import { UserService } from '../../src/services/UserService';
import { UserDao } from '../../src/dao/UserDao';
import { ThreadDao } from '../../src/dao/ThreadDao';

describe('ThreadService', () => {
  let conn: Pool;
  let query: { (arg0: string): any; (arg1: string): Promise<unknown> };
  let userService: UserService;
  let threadDao: ThreadDao;
  let threadService: ThreadService;

  beforeAll(async () => {
    conn = createPool();
    query = promisify(conn.query).bind(conn);
  });

  beforeEach(() => {
    userService = new UserService(new UserDao(conn));
    threadDao = new ThreadDao(conn);
    threadService = new ThreadService(threadDao, userService);
  });

  afterEach(async () => {
    await query(`DELETE FROM user_in_thread;`);
    await query(`DELETE FROM messages;`);
    await query(`DELETE FROM threads;`);
    await query(`DELETE FROM users;`);
  });

  describe('createThread()', () => {
    it('should create a thread and return the id', async () => {
      const threadId = await threadService.createThread();

      const thread = await query(`SELECT * FROM threads;`);

      expect(thread[0].id).toEqual(threadId);
    });
  });

  describe('getMessagesInThread()', () => {
    it('should return a list of usernames and messages that belong in the thread', async () => {
      const username = 'vikas_boddu';
      await userService.createUser(username);
      const userId = await userService.getUserIdByUsername(username);

      const threadId = (await threadDao.createThread()).insertId;
      await threadDao.joinThread(userId, threadId);

      const message1 = 'Hel';
      const message2 = 'lo';
      await threadDao.createMessage(userId, threadId, message1);
      await threadDao.createMessage(userId, threadId, message2);

      const result = await threadService.getMessagesInThread(threadId);
      const [first, second] = result.messages;
      expect(first.username).toEqual(username);
      expect(first.message).toEqual(message1);
      expect(second.username).toEqual(username);
      expect(second.message).toEqual(message2);
    });
  });
});
