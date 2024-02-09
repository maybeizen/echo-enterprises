const { ActivityType } = require("discord.js");
const chalk = require("chalk");

module.exports = async (client) => {
  await client.user.setActivity({
    name: `Echo Enterprises`,
    type: ActivityType.Watching,
  });

  console.log(
    chalk.blue(`✅ ${client.user.username} `) +
      chalk.white(`is now `) +
      chalk.green(`online`)
  );
};
