const { EmbedBuilder } = require("discord.js");
const c = require("chalk");

module.exports = async (msg, client) => {
  if (msg.author.bot) return;

  const logChannel = msg.guild.channels.cache.get("1182475670836760657");

  console.log("\n" + c.white(`-`).repeat(25) + "\n");
  console.log(c.cyan(`Message by ${msg.author.username} deleted...`));
  console.log(c.cyan(`Content: `) + c.white(msg.content));
  console.log("\n" + c.white(`-`).repeat(25) + "\n");

  await logChannel
    .send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Deleted Message")
          .setDescription(`A message by ${msg.author} was deleted...`)
          .setColor("Purple")
          .setFooter({
            text: "Echo Enterprises",
            iconURL: client.user.avatarURL(),
          })
          .addFields({
            name: "Content",
            value: `${msg.content}`,
            inline: true,
          }),
      ],
    })
    .catch((error) => {
      console.error(c.red(error));
      console.log(c.gray(error.stack));
    });
};
