import Hapi from "@hapi/hapi";
import Jwt from "@hapi/jwt";
import Joi from "joi";

import * as argon2 from "argon2";

import { Prisma } from "@prisma/client";

import { errorResponse } from "../errors";

/** ----------------------------------------------------------
 * Utilities
 -------------------------------------------------------------*/
export interface UserForToken {
    userId: number;
    username: string;
    email: string;
}

interface PublicUser {
    user_id: number;
    email: string;
    username: string;
    avatar_background: string;
    avatar_emoji: string;
    created_at: Date;
    updated_at: Date;
}

interface UserSignupLoginResponse {
    access_token: string;
    refresh_token: string;
    user: PublicUser;
}

/**
 *
 * Creates a jwt with the user credentials in the claims.
 *
 * @param user the user credentials to include in the claims of the token
 * @returns a string of the jwt token
 */
function createAccessToken(user: UserForToken) {
    return Jwt.token.generate(
        {
            aud: "urn:audience:test", // TODO: change to env  var
            iss: "urn:issuer:test", // TODO: change to env var`
            user
        },
        {
            key: "some_shared_secret", // TODO: change to env var
            algorithm: "HS512"
        },
        {
            ttlSec: 14400 // 4 hours
        }
    );
}

/**
 *
 * Creates a jwt for use as the refresh token
 *
 * @returns a string of the jwt token
 */
function createRefreshToken() {
    return Jwt.token.generate(
        {
            aud: "urn:audience:test", // TODO: change to env  var
            iss: "urn:issuer:test" // TODO: change to env var`
        },
        {
            key: "some_refresh_shared_secret", // TODO: change to env var
            algorithm: "HS512"
        },
        {
            ttlSec: 31536000 // 1 year
        }
    );
}

/**
 *
 * Creates a hashed password
 *
 * @returns hashes a password
 */
export function hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
}

/**
 *
 * Verifies a hashed password
 *
 * @returns boolean indicating if the password is verified
 */
function verifyPassword(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password);
}

/** ----------------------------------------------------------
 * Refresh Token
 -------------------------------------------------------------*/
interface RefreshTokenPayload {
    refresh_token: string;
    access_token: string;
}

// validation schema for the payload
const refreshPayloadValidation = Joi.object({
    refresh_token: Joi.string().required(),
    access_token: Joi.string().required()
});

/**
 *
 * Takes a provided access token and refresh token and creates a new access token
 *
 * @param request The Hapi Request object
 * @param h The Hapi Response methods
 * @returns http response based on the status of the response
 *
 *
 * The following logic happens here:
 *
 * 1. Get the requesting user credentials from the Authorization header
 * 2. Using the refresh token and user credentials, get the refresh token from the database
 * 3. If the refresh token exists, then we know we can make a new access token
 * 4. If not, return a 401 unauthorized error
 */
async function handleRefresh(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    // get instance of prisma
    const { prisma } = request.server.app;

    // get request payload
    const { refresh_token: refreshToken, access_token: accessToken } =
        request.payload as RefreshTokenPayload;

    // get user id from expired access token
    const {
        decoded: { payload }
    } = Jwt.token.decode(accessToken);

    try {
        // get the refresh token from the database
        const currentRefreshToken = await prisma.refreshToken.findFirst({
            where: {
                refresh_token: refreshToken,
                user_id: payload.userId
            }
        });

        // check if refresh token exists
        if (currentRefreshToken == null) {
            return h
                .response(
                    errorResponse(
                        "The provided refresh token is invalid.",
                        "UNAUTHORIZED"
                    )
                )
                .code(401);
        }

        // create a new access token
        const newAccessToken = createAccessToken(payload);

        return h
            .response({
                accessToken: newAccessToken,
                refreshToken
            })
            .code(200);
    } catch (err) {
        return h
            .response(errorResponse(err as string, "DATABASE_ERROR"))
            .code(500);
    }
}

/** ----------------------------------------------------------
 * Signup User
 -------------------------------------------------------------*/
interface SignupPayload {
    username: Prisma.UserCreateInput["username"];
    email: Prisma.UserCreateInput["email"];
    password: Prisma.UserCreateInput["password"];
}

// validation schema for the payload
const signupPayloadValidation = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).case("lower").required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30).required()
});

/**
 *
 * Signs a user up with the platform
 *
 * The following logic happens here:
 *
 * 1. We take the provided info and create a user from it
 * 2. We create a refresh token in the db
 * 3. Using the response from the db, we create an accessToken with the users info in it
 * 4. Respond to the request with the accessToken, refreshToken and user
 *
 * @param request The Hapi Request object
 * @param h The Hapi Response methods
 * @returns http response based on the status of the reponse
 *
 */
async function handleSignup(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    const { prisma } = request.server.app;

    const { username, email, password } = request.payload as SignupPayload;

    try {
        // hash the password
        const hashedPassword = await hashPassword(password);

        const [createdUser, refreshToken] = await prisma.$transaction(
            async (tx) => {
                // create the user
                const user = await tx.user.create({
                    data: {
                        username,
                        email,
                        password: hashedPassword
                    },
                    select: {
                        user_id: true,
                        email: true,
                        username: true,
                        avatar_background: true,
                        avatar_emoji: true,
                        created_at: true,
                        updated_at: true
                    }
                });

                // create refresh token and save it to the database
                const rt = createRefreshToken();

                // create the refresh token in db
                await tx.refreshToken.create({
                    data: {
                        refresh_token: rt,
                        user_id: user.user_id
                    }
                });

                return [user, rt];
            }
        );

        // create jwt token
        const accessToken = createAccessToken({
            userId: createdUser.user_id,
            username: createdUser.username,
            email: createdUser.email
        });

        // create the response
        const response: UserSignupLoginResponse = {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: createdUser
        };

        return h.response(response).code(201);
    } catch (err) {
        return h
            .response(errorResponse(err as string, "DATABASE_ERROR"))
            .code(500);
    }
}

/** ----------------------------------------------------------
 * Login User
 -------------------------------------------------------------*/
interface LoginPayload {
    email: string;
    password: string;
}

// validation schema for the payload
const loginPayloadValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30).required()
});

/**
 *
 * Logs a user into the platform
 *
 * The following logic happens here:
 *
 * 1. We take the provided payload and check against the email and password combo
 * 2. We create a refresh token in the db
 * 3. Using the response from the db, we create an accessToken with the users info in it
 * 4. Respond to the request with the accessToken, refreshToken and user
 *
 * @param request The Hapi Request object
 * @param h The Hapi Response methods
 * @returns http response based on the status of the reponse
 *
 */
async function handleLogin(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    // get the prisma instance
    const { prisma } = request.server.app;

    // get the payload
    const { email, password } = request.payload as LoginPayload;

    try {
        // get the user from the db by email
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        // if the user doesnt exist return an error
        if (user == null) {
            return h
                .response(errorResponse("user does not exist", "UNKNOWN_USER"))
                .code(404);
        }

        // check if the password is the same
        if (!(await verifyPassword(user.password, password))) {
            return h
                .response(
                    errorResponse(
                        "user credential are invalid",
                        "INVALID_CREDENTIALS"
                    )
                )
                .code(400);
        }

        // create refresh token and save it to the database
        const rt = createRefreshToken();

        // create the refresh token in db
        await prisma.refreshToken.create({
            data: {
                refresh_token: rt,
                user_id: user.user_id
            }
        });

        // create jwt token
        const accessToken = createAccessToken({
            userId: user.user_id,
            username: user.username,
            email: user.email
        });

        // create the response
        const response: UserSignupLoginResponse = {
            access_token: accessToken,
            refresh_token: rt,
            user: {
                user_id: user.user_id,
                email: user.email,
                username: user.username,
                avatar_background: user.avatar_background,
                avatar_emoji: user.avatar_emoji,
                created_at: user.created_at,
                updated_at: user.updated_at
            }
        };

        return h.response(response).code(200);
    } catch (error) {
        return h
            .response(errorResponse(error as string, "DATABASE_ERROR"))
            .code(500);
    }
}

/** ----------------------------------------------------------
 * Logout User
 -------------------------------------------------------------*/
interface LogoutPayload {
    refresh_token: string;
}

// validation schema for the payload
const logoutPayloadValidation = Joi.object({
    refresh_token: Joi.string().required()
});

/**
 *
 * Logs a user out of the platform
 *
 * The following logic happens here:
 *
 * 1. We take the provided payload and check the refresh token and user_id match
 * 2. We delete the refresh token from the db
 * 3. Respond with just a 204 since the request is empty
 *
 * @param request The Hapi Request object
 * @param h The Hapi Response methods
 * @returns http response based on the status of the reponse
 *
 */
async function handleLogout(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    // init prisma
    const { prisma } = request.server.app;

    // get jwt token from request
    const user = request.auth.credentials.user as UserForToken;

    // get payload
    const { refresh_token: refreshToken } = request.payload as LogoutPayload;

    try {
        // get the refresh token
        const rt = await prisma.refreshToken.findUnique({
            where: {
                user_id: user.userId
            }
        });

        // check if the refresh tokens match
        if (refreshToken !== rt?.refresh_token) {
            return h
                .response(errorResponse("Unable to log user out", "FORBIDDEN"))
                .code(403);
        }

        // if the refresh tokens match delete the refresh token and respond with a 204
        await prisma.refreshToken.delete({
            where: {
                user_id: user.userId
            }
        });

        return h.response().code(204);
    } catch (error) {
        return h
            .response(errorResponse(error as string, "DATABASE_ERROR"))
            .code(500);
    }
}

/** ----------------------------------------------------------
 * Auth Plugin
 -------------------------------------------------------------*/
const authPlugin: Hapi.Plugin<null> = {
    name: "auth",
    dependencies: ["prisma"],
    async register(server: Hapi.Server) {
        // register the jwt plugin
        await server.register(Jwt);

        // create the auth strat
        server.auth.strategy("jwt", "jwt", {
            keys: "some_shared_secret", // TODO: change to env var
            verify: {
                aud: "urn:audience:test", // TODO: change to env  var
                iss: "urn:issuer:test", // TODO: change to env var`
                sub: false,
                nbf: true,
                exp: true,
                maxAgeSec: 14400,
                timeSkewSec: 15
            },
            validate: (artifacts) => ({
                isValid: true,
                credentials: { user: artifacts.decoded.payload.user }
            })
        });

        server.route([
            {
                method: "POST",
                path: "/auth/refresh.json",
                handler: handleRefresh,
                options: {
                    validate: {
                        payload: refreshPayloadValidation
                    }
                }
            },
            {
                method: "POST",
                path: "/auth/signup.json",
                handler: handleSignup,
                options: {
                    validate: {
                        payload: signupPayloadValidation
                    }
                }
            },
            {
                method: "POST",
                path: "/auth/login.json",
                handler: handleLogin,
                options: {
                    validate: {
                        payload: loginPayloadValidation
                    }
                }
            },
            {
                method: "POST",
                path: "/auth/logout",
                handler: handleLogout,
                options: {
                    auth: "jwt",
                    validate: {
                        payload: logoutPayloadValidation
                    }
                }
            }
            // {
            //     method: "GET",
            //     path: "/auth/foo",
            //     handler: (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
            //         console.log(request.auth.credentials);
            //         return h.response("Adfasdf").code(200);
            //     },
            //     options: {
            //         // this is so fuckin sick. Use this to verify write permissions for a specific asset
            //         // pre: [{ method: (_, h: Hapi.ResponseToolkit) => { console.log("asdasd"); return h.response("asdfasdf").takeover().code(500) }, assign: 'm3' },],
            //         auth: "jwt"
            //     }
            // }
        ]);
    }
};

export default authPlugin;
