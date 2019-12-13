import { createPool, Pool, PoolConfig } from 'mysql';
import { ThreadDao } from './dao/ThreadDao';
import { ThreadService } from './services/ThreadService';
import { Request } from 'express';
import { UserDao } from './dao/UserDao';
import { UserService } from './services/UserService';

export class Context {
  private readonly pool: Pool;

  private readonly userDao: UserDao;
  private readonly userService: UserService;

  private readonly threadDao: ThreadDao;
  private readonly threadService: ThreadService;

  constructor(mysqlPoolConfig: PoolConfig) {
    this.pool = createPool(mysqlPoolConfig);

    this.userDao = new UserDao(this.pool);
    this.userService = new UserService(this.userDao);

    this.threadDao = new ThreadDao(this.pool);
    this.threadService = new ThreadService(this.threadDao, this.userService);
  }

  public getUserService(): UserService {
    return this.userService;
  }

  public getThreadService(): ThreadService {
    return this.threadService;
  }
}

export interface RequestWithContext extends Request {
  context: Context;
}
