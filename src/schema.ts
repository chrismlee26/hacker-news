import { makeSchema } from 'nexus'
import { join } from 'path'
import * as types from "./graphql"; // import graphql model "Link"

export const schema = makeSchema({
  types, // Pass "types" to makeSchema function
  outputs: {
      typegen: join(process.cwd(), "nexus-typegen.ts"),
      schema: join(process.cwd(), "schema.graphql"),
  },
  contextType: {
    module: join(process.cwd(), "./src/context.ts"), // Path to module of context interface
    export: "Context", // Name of exported interface in module
},
})