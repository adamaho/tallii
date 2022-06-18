import { PrismaClient, Prisma } from "@prisma/client";

import * as argon2 from "argon2";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
    {
        username: "adamaho",
        email: "adamaho@prisma.io",
        password: "brazil"
    },
    {
        username: "bryannegoad",
        email: "bryannegoad@prisma.io",
        password: "brazil"
    },
    {
        username: "ruthaho",
        email: "ruthaho@prisma.io",
        password: "brazil"
    }
];

const matchData: Prisma.MatchCreateInput[] = [
    {
        name: "Backgammon",
        game_type: "BACKGAMMON",
        description: "hello what is going on with you?",
        creator: {
            connect: {
                user_id: 1
            }
        },
        admins: {
            create: [
                {
                    user: {
                        connect: {
                            user_id: 1
                        }
                    }
                }
            ]
        },
        teams: {
            create: [
                {
                    name: "sweetie"
                },
                {
                    name: "bubba"
                }
            ]
        }
    },
    {
        name: "Golf with Manny",
        game_type: "GOLF",
        creator: {
            connect: {
                user_id: 2
            }
        },
        admins: {
            create: [
                {
                    user: {
                        connect: {
                            user_id: 2
                        }
                    }
                }
            ]
        },
        teams: {
            create: [
                {
                    name: "manny",
                    players: {
                        create: {
                            user_id: 1
                        }
                    }
                },
                {
                    name: "aho",
                    players: {
                        create: {
                            user_id: 2
                        }
                    }
                }
            ]
        }
    }
];

async function main() {
    console.log(`Start seeding ...`);
    console.log("Creating users...");
    for (const u of userData) {
        await prisma.user.create({
            data: {
                ...u,
                password: await argon2.hash(u.password)
            }
        });
    }
    console.log("Users created...");

    console.log("creating matches");
    for (const m of matchData) {
        await prisma.match.create({
            data: m
        });
    }
    console.log("Matches created...");
    console.log(`Seeding finished.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
