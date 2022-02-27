import { objectType, extendType, nonNull, stringArg } from "nexus";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { APP_SECRET } from "../utils/auth";


export const AuthPayload = objectType({
    name: "AuthPayload",
    definition(t) {
        t.nonNull.string("token");
        t.nonNull.field("user", {
            type: "User",
        });
    },
});

export const AuthMutation = extendType({
  type: "Mutation",
  definition(t) {

    t.nonNull.field("login", { 
      type: "AuthPayload",
      args: {
          email: nonNull(stringArg()),
          password: nonNull(stringArg()),
      },
      async resolve(parent, args, context) { // Use Prisma Client to retrieve existing "user" by "email" in "login" Mutation
          const user = await context.prisma.user.findUnique({
              where: { email: args.email },
          });
          if (!user) {
              throw new Error("No such user found");
          }
          const valid = await bcrypt.compare( // Compare password with db
              args.password,
              user.password,
          );
          if (!valid) {
              throw new Error("Invalid password");
          }
          const token = jwt.sign({ userId: user.id }, APP_SECRET); // Create JWT with "id"
          return { // Return "token" and "user" in Type "AuthPayload"
              token,
              user,
          };
        },
    });

    t.nonNull.field("signup", { // "signup" mutation returns instance of AuthPayLoad
          type: "AuthPayload",  
          args: { // Mandatory args: "email", "password", "name"
              email: nonNull(stringArg()), 
              password: nonNull(stringArg()),
              name: nonNull(stringArg()),
          },
          async resolve(parent, args, context) {
              const { email, name } = args;
              const password = await bcrypt.hash(args.password, 10); // Hash "user" password in signup mutation resolver
              const user = await context.prisma.user.create({ // Store new User record in db with Prisma
                  data: { email, name, password },
              });
              const token = jwt.sign({ userId: user.id }, APP_SECRET); // Generate JWT with "APP_SECRET" Information in foken is "id"
              return { // Return "token" and "user" in Type "AuthPayload"
                  token,
                  user,
              };
          },
      });
  },
  
});
