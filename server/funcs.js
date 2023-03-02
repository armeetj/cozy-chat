const { createClient } = require("redis");

const client = createClient();
client.connect();

const getConnectedClients = async () => {
  const numClients = parseInt(await client.get("cozy:connected_clients"));
  if (!numClients) {
    await setConnectedClients(0);
    return 0;
  }
  return numClients;
};

const setConnectedClients = async (n) => {
  await client.set("cozy:connected_clients", n);
};

const incrementConnectedClients = async () => {
  await setConnectedClients(await getConnectedClients() + 1);
};

const decrementConnectedClients = async () => {
  const n = await getConnectedClients();
  if (n > 0) await setConnectedClients(n - 1);
};

module.exports = {
  getConnectedClients,
  setConnectedClients,
  incrementConnectedClients,
  decrementConnectedClients,
};
