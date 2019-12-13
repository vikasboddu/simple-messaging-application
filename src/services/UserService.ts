import { UserDao } from '../dao/UserDao';

export class UserService {
  constructor(private userDao: UserDao) {}

  public async getUserIdByUsername(username: string): Promise<number> {
    return (await this.userDao.getUserIdByUsername(username))[0].id;
  }

  public async userExistsByUsername(username: string): Promise<boolean> {
    return (await this.userDao.getUserIdByUsername(username)).length > 0;
  }

  public async createUser(username: string) {
    const userExists = await this.userExistsByUsername(username);

    if (!userExists) {
      await this.userDao.createUser(username);
    }
  }
}
