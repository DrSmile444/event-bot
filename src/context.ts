import type { CommandContext, Context, Filter, FilterQuery, MiddlewareFn, SessionFlavor } from 'grammy';

import type { SessionData } from './interfaces';
import type { SelfDestructedFlavor } from './plugins';

export type GrammyContext = SelfDestructedFlavor<Context> & SessionFlavor<SessionData>;

export type GrammyMiddleware<C extends GrammyContext = GrammyContext> = MiddlewareFn<C>;
export type GrammyCommandMiddleware = GrammyMiddleware<CommandContext<GrammyContext>>;
export type GrammyQueryMiddleware<Q extends FilterQuery> = GrammyMiddleware<Filter<GrammyContext, Q>>;
