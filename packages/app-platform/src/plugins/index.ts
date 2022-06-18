import prisma from "./prisma";
import users from "./users";
import matches from "./matches";
import auth from "./auth";

const plugins = [prisma, auth, users, matches];

export default plugins;
