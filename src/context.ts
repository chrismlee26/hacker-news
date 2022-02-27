import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

export interface Context { // Define "Context" interface & bbjects attached to Context object
    prisma: PrismaClient;
}

export const context: Context = {
    prisma,
};
