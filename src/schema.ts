import { makeSchema } from 'nexus'
import { join } from 'path'
import * as types from "./graphql"; // import graphql model "Link"

export const schema = makeSchema({
  types, // Pass "types" to makeSchema function
  outputs: {
      typegen: join(process.cwd(), "nexus-typegen.ts"),
      schema: join(process.cwd(), "schema.graphql"),
  },
})