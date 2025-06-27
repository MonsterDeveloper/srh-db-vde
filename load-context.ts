import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1"
import type { AppLoadContext } from "react-router"
import * as schema from "./database/schema"

declare global {
  interface CloudflareEnvironment extends Env {}
}


declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: CloudflareEnvironment
      ctx: Omit<ExecutionContext, "props">
    }
    database: DrizzleD1Database<typeof schema>
  }
}

type GetLoadContextArgs = {
  request: Request
  context: Pick<AppLoadContext, "cloudflare">
}

export function getLoadContext({
  context,
}: GetLoadContextArgs): AppLoadContext {
  const env = context.cloudflare.env
  const database = drizzle(env.DB, { schema })


  return {
    cloudflare: { env, ctx: context.cloudflare.ctx },
    database,
  } satisfies AppLoadContext
}
