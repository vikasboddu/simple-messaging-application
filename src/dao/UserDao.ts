import { Dao } from './Dao';
import { MysqlRawResults } from '../models/MysqlResponse';

export class UserDao extends Dao {
  public createUser(username: string): Promise<MysqlRawResults> {
    const query = `
      INSERT INTO users (username) VALUES (?);
      `;
    return this.executeQuery(query, [username]);
  }

  public getUserIdByUsername(username: string): Promise<MysqlRawResults> {
    const query = `
      SELECT id FROM users WHERE username = ?;
      `;
    return this.executeQuery(query, [username]);
  }
}
