import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // Instantiate PrismaClient

async function main() { // Define async function "main" to send queries to db
    const newLink = await prisma.link.create({
      data: {
        description: 'Fullstack tutorial for GraphQL',
        url: 'www.howtographql.com',
      },
    })
    const allLinks = await prisma.link.findMany(); // "findMany()" returns all "link" records that exist in db
    console.log(allLinks);
}

main() // call "main()" function
    .catch((e) => {
        throw e;
    })
    .finally(async () => { // Close db when script terminates
        await prisma.$disconnect();
    });