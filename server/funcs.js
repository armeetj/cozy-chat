const { createClient } = require("redis");
const { randomUsername, randomColor } = require("./utils/usernames");
const USERS_KEY = "cozy:users";
const HANDLES_KEY = "cozy:handles";
const client = createClient();
client.connect();

const createUser = async (id) => {
  let randomHandle = randomUsername();
  for (let i = 0; i < 100; i++) {
    if (await uniqueHandle(randomHandle)) break;
    randomHandle = randomUsername();
  }
  await addHandle(randomHandle, id);
  const data = {
    id: id,
    handle: randomHandle,
    color: randomColor(),
    status: null,
    joined: Date.now(),
  };
  await client.hSet(USERS_KEY, id, JSON.stringify(data));
};

const removeUser = async (id) => {
  const removedUser = await getUser(id);
  await removeHandle(removedUser.handle);
  return removedUser;
};

const uniqueHandle = async (handle) => {
  return await client.hExists(HANDLES_KEY, handle);
};

const addHandle = async (handle, id) => {
  await client.hSet(HANDLES_KEY, handle, id);
};

const removeHandle = async (handle) => {
  await client.hDel(HANDLES_KEY, handle);
};

const changeHandle = async (id, handle) => {
  const data = await getUser(id);
  // TODO: censoring
  data.handle = handle;
  await client.hSet(USERS_KEY, id, JSON.stringify(data));
};

const getUser = async (id) => {
  return await client.hGet(USERS_KEY, id);
};

const getUsers = async (id) => {
  return await client.hGetAll(USERS_KEY);
}

const getConnectedUsers = async () => {
  return await client.hGetAll(USERS_KEY);
};

const getConnectedCount = async () => {
  return await client.hLen(USERS_KEY);
};

module.exports = {
  getUser,
  getUsers,
  createUser,
  removeUser,
  addHandle,
  removeHandle,
  getConnectedCount,
};
