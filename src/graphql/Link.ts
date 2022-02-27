import { extendType, objectType } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";  

export const Link = objectType({
    name: "Link", // Define the name of the type
    definition(t) {  // Add fields to type
        t.nonNull.int("id"); // Add an 'id' field, type Int
        t.nonNull.string("description"); // Add a 'descriptions field', type String
        t.nonNull.string("url"); // Add a 'url field', type String
    },
});

let links: NexusGenObjects["Link"][]= [ // Use "links" variable to store links at runtime (in memory)
  {
      id: 1,
      url: "www.howtographql.com",
      description: "Fullstack tutorial for GraphQL",
  },
  {
      id: 2,
      url: "graphql.org",
      description: "GraphQL official website",
  },
];

export const LinkQuery = extendType({ // Extend "Query" root type, adding a new root field: "feed"
  type: "Query",
  definition(t) {
      t.nonNull.list.nonNull.field("feed", { // Define "feed" return type query as not nullable array of type "Link"
          type: "Link",
          resolve(parent, args, context, info) { // Resolver function of "feed" query: "resolve". arcs = "parent", "args", "context", "info"
              return links;
          },
      });
  },
});