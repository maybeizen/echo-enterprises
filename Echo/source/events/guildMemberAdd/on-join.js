module.exports = async (member, guild) => {
  const channel = guild.channels.cache.get("1182448315456032788");
  const role = member.guild.roles.cache.get("1182472420767051908");
  const c = require("chalk");

  if (member.bot) return;

  if (!channel || !role) {
    console.log(
      c.yellow("Welcome channel or autorole not found! ") + c.gray("on-join.js")
    );
    return;
  }

  console.log("\n" + `-`.repeat(25) + "\n");
  console.log(
    c.cyan(
      `${member.user.username} has joined ${member.guild.name}! (${member.guild.memberCount})`
    )
  );
  console.log("\n" + `-`.repeat(25) + "\n");

  await member.roles.add(role);
  await channel.send(`Hey ${member}. Welcome to **${member.guild.name}**!`);
};
