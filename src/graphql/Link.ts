import { extendType, nonNull, objectType, stringArg } from "nexus";   
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

export const LinkMutation = extendType({ // Extend "Mutation" type to add "root field"
  type: "Mutation",    
  definition(t) {
      t.nonNull.field("post", { // Mutation "post" retuned a non-nullable "link" object
          type: "Link",  
          args: { // Define args to mutation
              description: nonNull(stringArg()), // Non-null
              url: nonNull(stringArg()), // Non-null
          },
          
          resolve(parent, args, context) {    
              const { description, url } = args; // args = "description" and "url"
              
              let idCount = links.length + 1; // Generate new "id" values for "link" objects & add "link" to "links" array and return "links" array
              const link = {
                  id: idCount,
                  description: description,
                  url: url,
              };
              links.push(link);
              return link;
          },
      });
  },
});