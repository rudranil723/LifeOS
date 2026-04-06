import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
    const msgs = await prisma.chatMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 5 })
    console.log(msgs)
}
main().finally(() => prisma.$disconnect())