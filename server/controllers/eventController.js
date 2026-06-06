let clients = [];

export const eventController = (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders(); 

  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).end("Missing userId");
  }

  const clientId = Date.now(); 
  const newClient = { id: clientId, userId, res };

  clients.push(newClient);
  console.log(
    `User ${userId} - [${clientId}] connected via SSE. Total clients: ${clients.length}`,
  );

  req.on("close", () => {
    clients = clients.filter((c) => c.id !== clientId);
    console.log(
      `User ${userId} - [${clientId}] disconnected. Total clients: ${clients.length}`,
    );
  });
};

export function sendEventToUser(userId, data) {
  clients.forEach((client) => {
    if (client.userId === userId) {
      client.res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  });
}
