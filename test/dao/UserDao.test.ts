import { promisify } from 'util';

import { UserDao } from '../../src/dao/UserDao';

import createPool from '../test-connection';
import { Pool } from 'mysql';

describe('UserDao', () => {
  let conn: Pool;
  let query: { (arg0: string): any; (arg1: string): Promise<unknown> };
  let userDao: UserDao;

  beforeAll(async () => {
    conn = createPool();
    query = promisify(conn.query).bind(conn);
  });

  beforeEach(() => {
    userDao = new UserDao(conn);
  });

  afterEach(async () => {
    await query(`DELETE FROM users;`);
  });

  describe('createUser()', () => {
    it('should create an entry in the users table with the given username', async () => {
      const username = 'vikas_boddu';

      const result = await userDao.createUser(username);
      expect(result.affectedRows).toEqual(1);

      const user = await query(
        `SELECT username FROM users WHERE id=${result.insertId};`
      );
      expect(user[0].username).toEqual(username);
    });
  });

  describe('getUserIdByUsername()', () => {
    it('should get the user id with the given username', async () => {
      const username = 'vikas_boddu';
      const userId = (await userDao.createUser(username)).insertId;

      const result = await userDao.getUserIdByUsername(username);
      expect(result[0].id).toEqual(userId);
    });
  });
});
