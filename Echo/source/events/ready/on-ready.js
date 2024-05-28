const c = require("chalk");

module.exports = async (client) => {
  await client.user.setActivity({
    name: "Echo Enterprises",
    type: 3, // 1: Playing 2: Listening 3: Watching, 4: Streaming
  });

  console.log(c.cyan(`Applied status to ${client.user.username}...`));

  console.log(c.green(`${client.user.username} is online and ready...`));
};
