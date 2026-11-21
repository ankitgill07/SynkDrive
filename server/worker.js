import { httpServerHandler } from "cloudflare:node";
import app from "./app.js";

// Cloudflare's Node HTTP bridge handles a listening server by its port.
// Passing the Express app directly does not register its HTTP server.
app.listen(3000);

export default httpServerHandler({ port: 3000 });
