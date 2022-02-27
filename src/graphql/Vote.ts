import { objectType, extendType, nonNull, intArg } from "nexus";
import { User } from "@prisma/client";

export const Vote = objectType({ // Vote: "link" + "user"
    name: "Vote",
    definition(t) {
        t.nonNull.field("link", { type: "Link" });
        t.nonNull.field("user", { type: "User" });
    },
});

export const VoteMutation = extendType({ // Return instance of "Vote" type
    type: "Mutation",
    definition(t) {
        t.field("vote", {
          type: "Vote",
          args: {
            linkId: nonNull(intArg()), // linkId identifies "link", "userId" passed in Auth header
          },
          async resolve(parent, args, context) {
            const { userId } = context;
            const { linkId } = args;

            if (!userId) { // if JWT valid, "userId" available in "context"
              throw new Error("Cannot vote without logging in.");
            }

            const link = await context.prisma.link.update({
              where: { // which link to update
                id: linkId
              },
              data: { // Update payload
                voters: { // "voters" field updated with "user"
                  connect: {
                    id: userId
                  }
                }
              }
            })

            const user = await context.prisma.user.findUnique({ where: { id: userId } });

            return { // Resolver returns "Vote" object
              link,
              user: user as User // Typecast (prisma.user.findUnique = User || Null), needs to be "User"
            };
          },
        })
    }
})