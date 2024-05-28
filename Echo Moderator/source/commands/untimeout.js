const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const c = require("chalk");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("untimeout")
    .setDescription("Un-timeout a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to un-timeout")
        .setRequired(true)
    ),

  run: async ({ interaction, client }) => {
    await interaction.deferReply({});

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ModerateMembers
      )
    ) {
      await interaction.editReply("You are not allowed to run this command!");
      return;
    }

    const user = interaction.options.getMember("user");
    const targetUserRolePosition = user.roles.highest.position;
    const authorUserRolePosition = interaction.member.roles.highest.position;
    const botRolePosition = interaction.guild.members.me.roles.highest.position;
    const logChannel = interaction.guild.channels.cache.get(
      "1182475701350309908"
    );

    if (!user) {
      await interaction.editReply(
        "That user does not exist, or is not in this server."
      );
      return;
    }

    if (user.id === interaction.guild.ownerId) {
      await interaction.editReply(
        "You are not allowed to mute that user! They are the owner of this server."
      );
      return;
    }

    if (user.permissions.has(PermissionsBitField.Flags.Administrator)) {
      await interaction.editReply(
        "You are not allowed to mute that user! They are an administratator"
      );
      return;
    }

    if (targetUserRolePosition >= authorUserRolePosition) {
      await interaction.editReply(
        "You are not allowed to mute that user. They have a higher role than you!"
      );
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply(
        "I am not allowed to mute that user. They have a higher role than me!"
      );

      return;
    }

    try {
      await user.timeout(null);

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`User Un-Timed Out`)
            .setDescription(`${interaction.user} has un-timed out by ${user}`)
            .setColor("Purple")
            .setFooter({
              text: "Echo Enterprises",
              iconURL: client.user.avatarURL(),
            }),
        ],
      });

      await logChannel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle(`User Un-Timed Out`)
            .setDescription(`${interaction.user} has un-timed out by ${user}`)
            .setColor("Purple")
            .setFooter({
              text: "Echo Enterprises",
              iconURL: client.user.avatarURL(),
            }),
        ],
      });
    } catch (error) {
      console.error(c.red(error));
      console.log(c.gray(error.stack));

      await interaction.editReply(
        "An internal error occurred! Please try again later."
      );
    }
  },
};
