import type { CommandContext, Context, Filter, FilterQuery, MiddlewareFn } from 'grammy';

import type { SelfDestructedFlavor } from './plugins';

export type GrammyContext = SelfDestructedFlavor<Context>;

export type GrammyMiddleware<C extends GrammyContext = GrammyContext> = MiddlewareFn<C>;
export type GrammyCommandMiddleware = GrammyMiddleware<CommandContext<GrammyContext>>;
export type GrammyQueryMiddleware<Q extends FilterQuery> = GrammyMiddleware<Filter<GrammyContext, Q>>;
