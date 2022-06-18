import Hapi from "@hapi/hapi";

import { errorResponse } from "../errors";
import { payloadResponse } from "../utilities";
import type { UserForToken } from "./auth";

// import Joi from "joi";

/**
 * The following is the schema for a match response
 *
 * match_id
 * name
 * description
 * game_type
 * winning_team
 * created_at
 * updated_at
 */

/** ----------------------------------------------------------
 * Utilities and Constants
 -------------------------------------------------------------*/

/** ----------------------------------------------------------
 * Get matches for me
 -------------------------------------------------------------*/
/**
 * Gets all matches that the currently logged in user created or is a player in
 *
 * @param request The Hapi Request object
 * @param h The Hapi Response methods
 * @returns http response based on the status of the reponse
 *
 */
async function handleGetMeMatches(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    // get an instance of prisma
    const { prisma } = request.server.app;

    // get jwt token from request
    const user = request.auth.credentials.user as UserForToken;

    try {
        // get all of the matches matching the current
        const meMatches = await prisma.match.findMany({
            where: {
                OR: [
                    {
                        creator_user_id: user.userId
                    },
                    {
                        teams: {
                            some: {
                                players: {
                                    some: {
                                        user_id: user.userId
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        });

        return h.response(payloadResponse("matches", meMatches)).code(200);
    } catch (error) {
        return h
            .response(errorResponse(error as string, "DATABASE_ERROR"))
            .code(500);
    }
}

/** ----------------------------------------------------------
 * Get one match by the match_id
 -------------------------------------------------------------*/
/**
 * Gets a single match by match_id
 *
 * @param request The Hapi Request object
 * @param h The Hapi Response methods
 * @returns http response based on the status of the reponse
 *
 */
async function handleGetOneMatch(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    // get an instance of prisma
    const { prisma } = request.server.app;

    const { match_id: matchId } = request.params;

    try {
        // get all of the matches matching the current
        const oneMatch = await prisma.match.findFirst({
            where: {
                match_id: Number(matchId)
            }
        });

        if (oneMatch == null) {
            return h
                .response(
                    errorResponse(
                        "The requested match does not exist",
                        "NOT_FOUND"
                    )
                )
                .code(404);
        }

        return h.response(payloadResponse("match", oneMatch)).code(200);
    } catch (error) {
        console.log(error);
        return h
            .response(errorResponse(error as string, "DATABASE_ERROR"))
            .code(500);
    }
}

/** ----------------------------------------------------------
 * Match Plugin
 -------------------------------------------------------------*/
const matchPlugin: Hapi.Plugin<null> = {
    name: "matches",
    dependencies: ["prisma", "auth"],
    async register(server: Hapi.Server) {
        server.route([
            {
                method: "GET",
                path: "/me/matches.json",
                handler: handleGetMeMatches,
                options: {
                    // this is so fuckin sick. Use this to verify write permissions for a specific asset
                    // pre: [{ method: (_, h: Hapi.ResponseToolkit) => { console.log("asdasd"); return h.response("asdfasdf").takeover().code(500) }, assign: 'm3' },],
                    auth: "jwt"
                }
            },
            {
                method: "GET",
                path: "/matches/{match_id}.json",
                handler: handleGetOneMatch,
                options: {
                    auth: "jwt"
                }
            }
        ]);
    }
};

export default matchPlugin;
