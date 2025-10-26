import { authHandler } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  return authHandler(event.node.req, event.node.res);
});