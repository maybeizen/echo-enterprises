const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const c = require("chalk");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user from the server")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to ban").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("The reason for the ban")
    ),

  run: async ({ interaction, client }) => {
    await interaction.deferReply({});
    const logChannel = interaction.guild.channels.cache.get(
      "1182475701350309908"
    );

    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)
    ) {
      await interaction.editReply("You are not allowed to run this command!");
      return;
    }

    const user = interaction.options.getMember("user");
    const reason =
      interaction.options.getString("reason") || "No Reason Provided";
    const targetUserRolePosition = user.roles.highest.position;
    const authorUserRolePosition = interaction.member.roles.highest.position;
    const botRolePosition = interaction.guild.members.me.roles.highest.position;

    if (!user) {
      await interaction.editReply(
        "That user does not exist, or is not in this server."
      );
      return;
    }

    if (user.id === interaction.guild.ownerId) {
      await interaction.editReply(
        "You are not allowed to ban that user! They are the owner of this server."
      );
      return;
    }

    if (targetUserRolePosition >= authorUserRolePosition) {
      await interaction.editReply(
        "You are not allowed to ban this user. They have a higher role than you!"
      );
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply(
        "I am not allowed to ban this user. They have a higher role than me!"
      );

      return;
    }

    try {
      await user.ban({ reason: reason });

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`Banned ${user.user.username}`)
            .setDescription(
              `${interaction.user} has banned ${user} from this server!`
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
            .setTitle(`Banned ${user.user.username}`)
            .setDescription(`${user} was banned by ${interaction.user}`)
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
        `An internal error occured! Please try again later. \n\n ${error}`
      );
    }
  },
};
