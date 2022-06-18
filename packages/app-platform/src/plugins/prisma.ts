import { PrismaClient } from "@prisma/client";
import Hapi from "@hapi/hapi";

declare module "@hapi/hapi" {
    interface ServerApplicationState {
        prisma: PrismaClient;
    }
}

// plugin to instantiate Prisma Client
const prismaPlugin: Hapi.Plugin<null> = {
    name: "prisma",
    async register(s: Hapi.Server) {
        const prisma = new PrismaClient({
            log: [
                {
                    emit: "event",
                    level: "query"
                }
            ]
        });

        // eslint-disable-next-line no-param-reassign
        s.app.prisma = prisma;

        // Close DB connection after the server's connection listeners are stopped
        // Related issue: https://github.com/hapijs/hapi/issues/2839
        s.ext({
            type: "onPostStop",
            method: async (s1: Hapi.Server) => {
                s1.app.prisma.$disconnect();
            }
        });
    }
};

export default prismaPlugin;
