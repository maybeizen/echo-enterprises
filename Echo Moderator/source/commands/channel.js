const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const c = require("chalk");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("channel")
    .setDescription("Manage a channel for the server")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("lock")
        .setDescription("Lock the supplied channel")
        .addChannelOption((option) =>
          option.setName("channel").setDescription("The channel to lock")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("unlock")
        .setDescription("Unlock the supplied channel")
        .addChannelOption((option) =>
          option.setName("channel").setDescription("The channel to unlock")
        )
    ),

  run: async ({ interaction, client }) => {
    const channel = interaction.options.getChannel("channel");
    const subcommand = interaction.options.getSubcommand();

    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)
    ) {
      await interaction.reply("You are not allowed to run this command!");

      return;
    }

    if (!interaction.inGuild()) {
      await interaction.reply(
        "You are not allowed to run this command in DMs!"
      );
      return;
    }

    if (subcommand === "lock") {
      try {
        if (!channel) {
          await interaction.channel.permissionOverwrites.edit(
            interaction.guild.id,
            {
              SendMessages: false,
            }
          );
          await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Channel Locked")
                .setDescription(
                  `${interaction.user} has locked channel ${interaction.channel}`
                )
                .setColor("Purple")
                .setFooter({
                  text: "Echo Enterprises",
                  iconURL: client.user.avatarURL(),
                }),
            ],
          });
        } else {
          await channel.permissionOverwrites.edit(interaction.guild.id, {
            SendMessages: false,
          });
          await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Channel Locked")
                .setDescription(
                  `${interaction.user} has locked channel ${interaction.channel}`
                )
                .setColor("Purple")
                .setFooter({
                  text: "Echo Enterprises",
                  iconURL: client.user.avatarURL(),
                }),
            ],
          });
        }
      } catch (error) {
        console.error(c.red(error));
        console.log(c.gray(error.stack));

        await interaction.reply(
          "An internal error occurred! Please try again later."
        );
      }
    } else if (subcommand === "unlock") {
      try {
        if (!channel) {
          await interaction.channel.permissionOverwrites.edit(
            interaction.guild.id,
            {
              SendMessages: true,
            }
          );
          await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Channel Unlocked")
                .setDescription(
                  `${interaction.user} has unlocked channel ${interaction.channel}`
                )
                .setColor("Purple")
                .setFooter({
                  text: "Echo Enterprises",
                  iconURL: client.user.avatarURL(),
                }),
            ],
          });
        } else {
          await channel.permissionOverwrites.edit(interaction.guild.id, {
            SendMessages: true,
          });
          await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Channel Unlocked")
                .setDescription(
                  `${interaction.user} has unlocked channel ${interaction.channel}`
                )
                .setColor("Purple")
                .setFooter({
                  text: "Echo Enterprises",
                  iconURL: client.user.avatarURL(),
                }),
            ],
          });
        }
      } catch (error) {
        console.error(c.red(error));
        console.log(c.gray(error.stack));

        await interaction.reply(
          "An internal error occurred! Please try again later."
        );
      }
    }
  },
};
