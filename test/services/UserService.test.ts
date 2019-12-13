import { promisify } from 'util';

import { UserDao } from '../../src/dao/UserDao';

import createPool from '../test-connection';
import { Pool } from 'mysql';
import { UserService } from '../../src/services/UserService';

describe('UserService', () => {
  let conn: Pool;
  let query: { (arg0: string): any; (arg1: string): Promise<unknown> };
  let userDao: UserDao;
  let userService: UserService;

  beforeAll(async () => {
    conn = createPool();
    query = promisify(conn.query).bind(conn);
  });

  beforeEach(() => {
    userDao = new UserDao(conn);
    userService = new UserService(userDao);
  });

  afterEach(async () => {
    await query(`DELETE FROM users;`);
  });

  describe('getUserIdByUsername()', () => {
    it('should get the user id with the given username', async () => {
      const username = 'vikas_boddu';
      const userId = (await userDao.createUser(username)).insertId;

      const result = await userService.getUserIdByUsername(username);
      expect(result).toEqual(userId);
    });
  });

  describe('userExistsByUsername()', () => {
    it('should return false if the user does not exist', async () => {
      const username = 'vikas_boddu';

      const result = await userService.userExistsByUsername(username);
      expect(result).toBeFalsy();
    });

    it('should return true if the user exists', async () => {
      const username = 'vikas_boddu';
      await userDao.createUser(username);

      const result = await userService.userExistsByUsername(username);
      expect(result).toBeTruthy();
    });
  });

  describe('createUser()', () => {
    it('should not create a user entry if the given username already exists', async () => {
      // const tmpFn = userDao.createUser;
      userDao.createUser = jest.fn();

      const username = 'vikas_boddu';
      await query(`INSERT INTO users(username) VALUES ('${username}');`);

      await userService.createUser(username);
      expect(userDao.createUser).not.toBeCalled();

      // userDao.createUser = tmpFn;
    });

    it('should create a user entry with the given username', async () => {
      const username = 'vikas_boddu';

      await userService.createUser(username);

      const user = await query(
        `SELECT * FROM users WHERE username='${username}';`
      );
      expect(user[0].username).toEqual(username);
    });
  });
});
