import Hapi from "@hapi/hapi";

import type { Prisma } from "@prisma/client";

import { errorResponse } from "../errors";

/** ----------------------------------------------------------
 * Update Me
 -------------------------------------------------------------*/
interface UpdateMePayload {
    username?: Prisma.UserUpdateInput["username"];
    avatarBackground?: Prisma.UserUpdateInput["avatar_background"];
    avatarEmoji?: Prisma.UserUpdateInput["avatar_emoji"];
}

/**
 *
 * Updates a user
 *
 * @param request The Hapi Request object
 * @param h The Hapi Response methods
 * @returns http response based on the status of the reponse
 */
async function updateUser(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    const { prisma } = request.server.app;

    const { username, avatarBackground, avatarEmoji } =
        request.payload as UpdateMePayload;

    try {
        // create the user
        const updatedUser = await prisma.user.update({
            data: {
                username,
                avatar_background: avatarBackground,
                avatar_emoji: avatarEmoji
            },
            where: {
                user_id: Number(request.params.userId)
            }
        });
        return h.response(updatedUser).code(200);
    } catch (err) {
        return h
            .response(errorResponse(err as string, "DATABASE_ERROR"))
            .code(500);
    }
}

/** ----------------------------------------------------------
 * User Plugin
 -------------------------------------------------------------*/
const usersPlugin: Hapi.Plugin<null> = {
    name: "api/users",
    dependencies: ["prisma", "auth"],
    async register(server: Hapi.Server) {
        server.route([
            {
                method: "PUT",
                path: "/users/me",
                handler: updateUser,
                options: {
                    auth: {
                        strategy: "jwt"
                    }
                }
            }
        ]);
    }
};

export default usersPlugin;
