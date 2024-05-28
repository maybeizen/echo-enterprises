const { EmbedBuilder } = require("discord.js");
const regex = /(?:https?:\/\/)?(?:[a-z0-9_\-]+\.)?[a-z0-9_\-]+\.[a-z]{2,}/;
const nonClickableLinks = require("../../db/nonClickableAllowedLinks");
const clickableLinks = require("../../db/clickableAllowedLinks");
const bypassUsers = require("../../db/bypassUsers");
const bypassRoles = require("../../db/bypassRoles");
const c = require("chalk");

module.exports = async (message, client) => {
  const logChannel = message.guild.channels.cache.get("1203805807679111311");
  const highestRole = message.member.roles.highest;

  if (message.author.bot) return;

  if (containsLink(message)) {
    if (!containsAllowedLink(message)) {
      if (
        bypassUsers.includes(message.author.id) ||
        bypassRoles.includes(highestRole)
      )
        return console.log(
          `${message.author.username} tried to send a link, but it was bypasses`
        );

      message.delete();

      const res = await message.channel.send(
        `Hey ${message.author}! You are not allowed to post links!`
      );

      console.log("\n" + c.white(`-`).repeat(25) + "\n");
      console.log(
        c.cyan(`${message.author.username} tried to send a blocked link!`)
      );
      console.log(c.cyan(`Message: `) + c.white(message.content));
      console.log("\n" + c.white(`-`).repeat(25) + "\n");

      await logChannel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("Blocked Message")
            .setDescription(
              `A message by ${message.author} was blocked because it contains a blocked link!`
            )
            .setColor("Purple")
            .setFooter({
              text: "Echo Enterprises",
              iconURL: client.user.avatarURL(),
            })
            .addFields({
              name: "Content",
              value: `${message.content}`,
              inline: true,
            }),
        ],
      });

      pause(5000);
      await res.delete();

      return;
    }
  }
};

function containsAllowedLink(message) {
  const combinedLinks = nonClickableLinks.concat(clickableLinks);
  for (const link of combinedLinks) {
    if (message.content.includes(link)) {
      return true;
    }
  }
  return false;
}

function containsLink(message) {
  return regex.test(message.content);
}

function pause(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
