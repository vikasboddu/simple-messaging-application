import { ThreadService } from '../services/ThreadService';
import { RequestWithContext } from '../Context';
import { AsyncRouter } from 'express-async-router';
import { UserService } from '../services/UserService';

const router = AsyncRouter();

router.post('/', async function(req: RequestWithContext) {
  let users = req.body.users;

  const userService: UserService = req.context.getUserService();
  const threadService: ThreadService = req.context.getThreadService();

  await Promise.all(
    users.map((username: string) => userService.createUser(username))
  );

  const threadId = await threadService.createThread();
  await Promise.all(
    users.map((username: string) =>
      threadService.joinThread(username, threadId)
    )
  );

  return { thread_id: threadId };
});

router.post('/:id/:username', async function(req: RequestWithContext) {
  const threadId = parseInt(req.params.id);
  const username = req.params.username;
  const message = req.body.message;

  const threadService: ThreadService = req.context.getThreadService();

  // check if user is in thread ?
  await threadService.createMessage(username, threadId, message);

  // res.status(204);
});

router.get('/:id', async function(req: RequestWithContext) {
  const threadId = parseInt(req.params.id);

  const threadService: ThreadService = req.context.getThreadService();
  return threadService.getMessagesInThread(threadId);
});

export default router;
