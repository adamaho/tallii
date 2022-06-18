import Hapi from "@hapi/hapi";

import plugins from "./plugins";

const server: Hapi.Server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || "localhost"
});

async function start(): Promise<Hapi.Server> {
    await server.register(plugins);
    await server.start();
    return server;
}

process.on("unhandledRejection", async (err) => {
    await server.app.prisma.$disconnect();
    console.log(err);
    process.exit(1);
});

start()
    .then((s) => {
        console.log(`🚀 Server ready at: ${s.info.uri}`);
    })
    .catch((err) => {
        console.log(err);
    });
