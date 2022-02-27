import { objectType } from "nexus";

export const User = objectType({
    name: "User",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("name");
        t.nonNull.string("email");
        t.nonNull.list.nonNull.field("links", { // "links" represents all "links" posted by a user
            type: "Link",
            resolve(parent, args, context) { // Explicitly define "links" as User object does not automatically contain "links" type
                return context.prisma.user // Query for user.links. "parent" arg contains user record.
                    .findUnique({ where: { id: parent.id } })
                    .links();
            },
        }); 
    },
});