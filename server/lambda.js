import serverless from "serverless-http";
import app from "./app.js";
import connetDB from "./db/db.js";

await connetDB();

const serverlessHandler = serverless(app);

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return await serverlessHandler(event, context);
};