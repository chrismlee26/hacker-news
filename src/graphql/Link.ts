import { extendType, nonNull, objectType, stringArg } from "nexus";   

export const Link = objectType({
    name: "Link", // Define the name of the type
    definition(t) {  // Add fields to type
        t.nonNull.int("id"); // Add an 'id' field, type Int
        t.nonNull.string("description"); // Add a 'descriptions field', type String
        t.nonNull.string("url"); // Add a 'url field', type String
    },
});

export const LinkQuery = extendType({
  type: "Query",
  definition(t) {
      t.nonNull.list.nonNull.field("feed", {
          type: "Link",
          resolve(parent, args, context) {  
              return context.prisma.link.findMany(); // Find and return all "Link" records in db using context.prisma
          },
      });
  },
});

export const LinkMutation = extendType({
  type: "Mutation",
  definition(t) {
      t.nonNull.field("post", {
          type: "Link",
          args: {
              description: nonNull(stringArg()),
              url: nonNull(stringArg()),
          },
          resolve(parent, args, context) { 
              const newLink = context.prisma.link.create({ // Create method on "Link" model.
                  data: { // Pass data resolvers receive from "args"
                      description: args.description,
                      url: args.url,
                  },
              });
              return newLink;
          },
      });
  },
});