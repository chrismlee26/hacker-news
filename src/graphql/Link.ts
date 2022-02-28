import { extendType, idArg, nonNull, objectType, stringArg, intArg, inputObjectType, enumType, arg, list } from "nexus";
import { Prisma } from "@prisma/client"

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
    t.nonNull.field("feed", { // "feed" returns single non-nullable instance of Type "Feed"
      type: "Feed",
      args: {
        // Filter
        filter: stringArg(), // Filter optional
        // Pagination - Limit-Offset
        skip: intArg(), // optional integer
        take: intArg(),
        orderBy: arg({ type: list(nonNull(LinkOrderByInput)) }), // Array of input "LinkOrderByInput"
      },
      async resolve(parent, args, context) { // Find and return all "Link" records in db using context.prisma
        const where = args.filter // if "filter", construct "{where}" as filter condition
          ? {
            OR: [ // "description" &/ "url" have substring to match filter string
              { description: { contains: args.filter } },
              { url: { contains: args.filter } },
            ],
            }
          : {}; // If no "filter", "where" condition will be empty object
        const links = await context.prisma.link.findMany({  
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.LinkOrderByWithRelationInput>
            | undefined,
        });
        const count = await context.prisma.link.count({ where }); // Prisma count api to return # records in db
        return { // resolve function updated to match Type "Feed"
            links,
            count,
        };
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

export const LinkOrderByInput = inputObjectType({
  name: "LinkOrderByInput",
  definition(t) {
      t.field("description", { type: Sort });
      t.field("url", { type: Sort });
      t.field("createdAt", { type: Sort });
  },
});

export const Sort = enumType({
  name: "Sort",
  members: ["asc", "desc"], // Ascending and Descending sort
});

export const Feed = objectType({
  name: "Feed",
  definition(t) {
      t.nonNull.list.nonNull.field("links", { type: Link }); // "links" array of "Link" Type
      t.nonNull.int("count"); // Count number of links
  },
});