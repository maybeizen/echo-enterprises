const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  Component,
} = require("discord.js");
const c = require("chalk");

module.exports = async (oldMsg, msg, client) => {
  if (msg.author.bot) return;

  const logChannel = msg.guild.channels.cache.get("1203805807679111311");
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel(`Jump`)
      .setEmoji(`⬆️`)
      .setStyle(ButtonStyle.Link)
      .setURL(
        `https://discord.com/channels/1182443597468012696/${msg.channel.id}/${msg.id}`
      )
  );

  console.log("\n" + c.white(`-`).repeat(25) + "\n");
  console.log(c.cyan(`Message by ${msg.author.username} edited...`));
  console.log(c.cyan(`Old Message: `) + c.white(oldMsg.content));
  console.log(c.cyan(`New Message: `) + c.white(msg.content));
  console.log("\n" + c.white(`-`).repeat(25) + "\n");

  await logChannel
    .send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Updated Message")
          .setDescription(`A message has been updated by ${msg.author}:`)
          .setColor("Purple")
          .setFooter({
            text: "Echo Enterprises",
            iconURL: client.user.avatarURL(),
          })
          .addFields(
            {
              name: "Old Message",
              value: `${oldMsg.content}`,
              inline: true,
            },
            {
              name: "New Message",
              value: `${msg.content}`,
              inline: true,
            }
          ),
      ],

      components: [row],
    })
    .catch((error) => {
      console.error(c.red(error));
      console.log(c.gray(error.stack));
    });
};
