import { Dao } from './Dao';
import { MysqlOperationResult, MysqlRawResults } from '../models/MysqlResponse';

export class ThreadDao extends Dao {
  public createThread(): Promise<MysqlOperationResult> {
    const query = `
      INSERT INTO threads(created_at) VALUES (DEFAULT);
      `;
    return this.executeQuery(query);
  }

  public getThreadById(id: number): Promise<MysqlRawResults> {
    const query = `
      SELECT * FROM threads WHERE id = ?;
      `;
    return this.executeQuery(query, [id]);
  }

  public createMessage(
    userId: number,
    threadId: number,
    message: string
  ): Promise<MysqlOperationResult> {
    const query = `
      INSERT INTO messages(user_id, thread_id, message) VALUES (?, ?, ?);
      `;
    return this.executeQuery(query, [userId, threadId, message]);
  }

  public joinThread(
    userId: number,
    threadId: number
  ): Promise<MysqlRawResults> {
    const query = `
      INSERT INTO user_in_thread (user_id, thread_id) VALUES (?, ?);
      `;
    return this.executeQuery(query, [userId, threadId]);
  }

  public getMessagesInThread(threadId: number): Promise<MysqlRawResults> {
    const query = `
      SELECT 
        u.username, 
        m.message 
      FROM messages m 
        JOIN users AS u ON u.id = m.user_id
      WHERE thread_id = ?;
      `;
    return this.executeQuery(query, [threadId]);
  }
}
