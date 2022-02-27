import { PrismaClient } from "@prisma/client";
import { decodeAuthHeader, AuthTokenPayload } from "./utils/auth";   
import { Request } from "express";

export const prisma = new PrismaClient();

export interface Context { // Define "Context" interface & bbjects attached to Context object
    prisma: PrismaClient;
    userId?: number; // "userId" not attached to "context" when requests sent without Authorization header
}

export const context = ({ req }: { req: Request }): Context => { // context function needs to execute to return actual object Type "Context"
    const token =
        req && req.headers.authorization
            ? decodeAuthHeader(req.headers.authorization)
            : null;

    return {  
        prisma,
        userId: token?.userId, 
    };
};