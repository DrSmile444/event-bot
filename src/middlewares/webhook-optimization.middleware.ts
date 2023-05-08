import type { GrammyContext, GrammyMiddleware } from '../context';
import { TemporaryStorageKey, temporaryStorageService } from '../services';

const uniqueKeyBuilder = (context: GrammyContext) => `${context.update.update_id}:${context.msg?.chat.id || 0}:${context.from?.id || 0}`;

/**
 * Middleware which registers which messages are accepted and which are duplicated.
 *
 * @description
 * The problem: free hosting services have long time to wake up
 * which results telegram to send the update twice or even more.
 *
 * To solve it we need to get immediately response but this is possible only with faster hosting.
 * So the possible solution will be to track which update is already tracked so we don't need to
 * process it for the second time.
 * */
export const webhookOptimizationMiddleware: GrammyMiddleware = (context, next) => {
  const uniqueUpdateKey = uniqueKeyBuilder(context);
  const hasUpdate = temporaryStorageService.hasStoreItem(TemporaryStorageKey.WEBHOOK_OPTIMIZATION, uniqueUpdateKey);

  /**
   * Skip this update;
   * */
  if (hasUpdate) {
    return;
  }

  /**
   * This is the first time, so add it
   * */
  temporaryStorageService.addStoreItem(TemporaryStorageKey.WEBHOOK_OPTIMIZATION, uniqueUpdateKey);
  return next();
};
