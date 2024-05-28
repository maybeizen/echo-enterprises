const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const c = require("chalk");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user from the server")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to kick from this server")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("The reason for the kick")
    ),

  run: async ({ interaction, client }) => {
    await interaction.deferReply();
    const user = interaction.options.getMember("user");
    const reason =
      interaction.options.getString("reason") || "No Reason Provided";
    const targetUserRolePosition = user.roles.highest.position;
    const authorUserRolePosition = interaction.member.roles.highest.position;
    const botRolePosition = interaction.guild.members.me.roles.highest.position;
    const logChannel = interaction.guild.channels.cache.get(
      "1182475701350309908"
    );

    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)
    ) {
      await interaction.editReply("You are not allowed to run this command!");

      return;
    }

    if (!interaction.inGuild()) {
      await interaction.editReply("This command must be run in a server.");
      return;
    }

    if (!targetUser) {
      return await interaction.editReply(
        "That user does not exist, or is not in this server."
      );
    }

    if (targetUser.id === interaction.guild.ownerId) {
      return await interaction.editReply(
        "You are not allowed to kick that user! They are the owner of the server!"
      );
    }

    if (targetUserRolePosition >= authorUserRolePosition) {
      return await interaction.editReply(
        "You are not allowed to kick that user! They have a higher role than you."
      );
    }

    if (targetUserRolePosition >= botRolePosition) {
      return await interaction.editReply(
        "I am not allowed to kick that user. They have a higher role than me!"
      );
    }

    try {
      await targetUser.kick({ reason: reason });
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`Kicked ${user.username}`)
            .setDescription(
              `${interaction.user} has was kicked by ${targetUser}.`
            )
            .setColor("Purple")
            .setFooter({
              text: "Echo Enterprises",
              iconURL: client.user.avatarURL(),
            })
            .addFields({ name: "Reason", value: reason }),
        ],
      });

      await logChannel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle(`Kicked ${user.username}`)
            .setDescription(`${targetUser} was kicked by ${interaction.user}`)
            .setColor("Purple")
            .setFooter({
              text: "Echo Enterprises",
              iconURL: client.user.avatarURL(),
            })
            .addFields({ name: "Reason", value: reason }),
        ],
      });
    } catch (error) {
      console.error(c.red(error));
      console.log(c.gray(error.stack));

      await interaction.editReply(
        "An interal error occured! Please try again later."
      );
    }
  },
};
