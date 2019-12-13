import { promisify } from 'util';

import { ThreadDao } from '../../src/dao/ThreadDao';

import createPool from '../test-connection';
import { Pool } from 'mysql';
import { UserService } from '../../src/services/UserService';
import { UserDao } from '../../src/dao/UserDao';

describe('ThreadDao', () => {
  let conn: Pool;
  let query: { (arg0: string): any; (arg1: string): Promise<unknown> };
  let userService: UserService;
  let threadDao: ThreadDao;

  beforeAll(async () => {
    conn = createPool();
    query = promisify(conn.query).bind(conn);
  });

  beforeEach(() => {
    userService = new UserService(new UserDao(conn));
    threadDao = new ThreadDao(conn);
  });

  afterEach(async () => {
    await query(`DELETE FROM user_in_thread;`);
    await query(`DELETE FROM messages;`);
    await query(`DELETE FROM threads;`);
    await query(`DELETE FROM users;`);
  });

  describe('createThread()', () => {
    it('should create an entry in the threads table', async () => {
      const result = await threadDao.createThread();
      expect(result.affectedRows).toEqual(1);
    });
  });

  describe('getThreadById()', () => {
    it('should get the thread with the given id', async () => {
      const threadId = (await threadDao.createThread()).insertId;

      const result = await threadDao.getThreadById(threadId);
      expect(result[0].id).toEqual(threadId);
    });
  });

  describe('createMessage()', () => {
    it('should create a message with the given userId, threadId, and message', async () => {
      const username = 'vikas_boddu';
      await userService.createUser(username);
      const userId = await userService.getUserIdByUsername(username);

      const threadId = (await threadDao.createThread()).insertId;

      const message = 'Hello';

      const result = await threadDao.createMessage(userId, threadId, message);
      expect(result.affectedRows).toEqual(1);

      const messageRow = await query(
        `SELECT * FROM messages WHERE id = ${result.insertId}`
      );
      expect(messageRow[0].user_id).toEqual(userId);
      expect(messageRow[0].thread_id).toEqual(threadId);
      expect(messageRow[0].message).toEqual(message);
    });
  });

  describe('joinThread()', () => {
    it('should create a user_in_thread entry', async () => {
      const username = 'vikas_boddu';
      await userService.createUser(username);
      const userId = await userService.getUserIdByUsername(username);

      const threadId = (await threadDao.createThread()).insertId;

      await threadDao.joinThread(userId, threadId);

      const userInThread = await query(
        `SELECT * FROM user_in_thread WHERE user_id = ${userId} AND thread_id = ${threadId};`
      );
      expect(userInThread[0].user_id).toEqual(userId);
      expect(userInThread[0].thread_id).toEqual(threadId);
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

      const result = await threadDao.getMessagesInThread(threadId);
      expect(result[0].username).toEqual(username);
      expect(result[0].message).toEqual(message1);
      expect(result[1].username).toEqual(username);
      expect(result[1].message).toEqual(message2);
    });
  });
});
