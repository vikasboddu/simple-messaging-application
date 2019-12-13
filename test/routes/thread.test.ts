import supertest from 'supertest';
import { initializeApp } from '../test-api-helpers';
import thread from '../../src/routes/thread';

const baseUrl = '/thread';

const testUserService: { [index: string]: jest.Mock<any, any> } = {
  getUserIdByUsername: jest.fn(),
  userExistsByUsername: jest.fn(),
  createUser: jest.fn(),
};

const testThreadService: { [index: string]: jest.Mock<any, any> } = {
  createThread: jest.fn(),
  getThreadById: jest.fn(),
  createMessage: jest.fn(),
  joinThread: jest.fn(),
  getMessagesInThread: jest.fn(),
};

const context = {
  getUserService: () => testUserService,
  getThreadService: () => testThreadService,
};

const app = initializeApp(context as any);
app.use(baseUrl, thread);

const agent = supertest.agent(app);

describe('thread router', () => {
  afterEach(() => {
    Object.keys(testUserService).forEach(key => {
      testUserService[key].mockClear();
    });

    Object.keys(testThreadService).forEach(key => {
      testThreadService[key].mockClear();
    });
  });

  describe('Test POST /', () => {
    it('should call userService.createUsername for each username', async () => {
      await agent.post(`${baseUrl}`).send({
        users: ['vikas', 'boddu'],
      });

      expect(testUserService.createUser).toHaveBeenCalledTimes(2);
      expect(testUserService.createUser).toHaveBeenCalledWith('vikas');
      expect(testUserService.createUser).toHaveBeenCalledWith('boddu');
    });
  });

  //todo incomplete tests
});
