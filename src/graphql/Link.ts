import { extendType, idArg, nonNull, objectType, stringArg, intArg } from "nexus";

export const Link = objectType({
  name: "Link", // Define the name of the type
  definition(t) {  // Add fields to type
    t.nonNull.int("id"); // Add an 'id' field, type Int
    t.nonNull.string("description"); // Add a 'descriptions field', type String
    t.nonNull.string("url"); // Add a 'url field', type String
    t.nonNull.dateTime("createdAt"); // DateTime scaler 
    t.field("postedBy", { // Add "postedBy" field on "User"
      type: "User",
      resolve(parent, args, context) { // Fetch "link" record using "parent.id" then associated "user" by chaining "postedBy()"
        return context.prisma.link
        .findUnique({ where: { id: parent.id } })
        .postedBy();
      },
    });
    t.nonNull.list.nonNull.field("voters", {
      type: "User",
      resolve(parent, args, context) {
        return context.prisma.link
          .findUnique({ where: { id: parent.id } })
          .voters();
      },
    });
  },
});

export const LinkQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("feed", {
      type: "Link",
      args: {
        // Filter
        filter: stringArg(), // Filter optional
        // Pagination - Limit-Offset
        skip: intArg(), // optional integer
        take: intArg(),
      },
      resolve(parent, args, context) { // Find and return all "Link" records in db using context.prisma
        const where = args.filter // if "filter", construct "{where}" as filter condition
          ? {
            OR: [ // "description" &/ "url" have substring to match filter string
              { description: { contains: args.filter } },
              { url: { contains: args.filter } },
            ],
            }
          : {}; // If no "filter", "where" condition will be empty object
        return context.prisma.link.findMany({
            where,
            skip: args?.skip as number | undefined, // Typecasting in case of undefined
            take: args?.take as number | undefined,
        });
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
        const { description, url } = args;
        const { userId } = context;

        if (!userId) { // Only authorized users can add a new "link"
          throw new Error("Cannot post without logging in.");
        }

        const newLink = context.prisma.link.create({
          data: {
            description,
            url,
            postedBy: { connect: { id: userId } }, // Connect operator to link "User" with "Link" and specify value for "postedBy"
          },
        });

        return newLink;
      },
    });
  },
});