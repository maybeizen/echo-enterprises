const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const c = require("chalk");
const durationList = {
  300000: "5 Minutes",
  1800000: "30 Minutes",
  3600000: "1 Hour",
  21600000: "6 Hours",
  86400000: "1 Day",
  259200000: "3 Days",
  604800000: "7 Days",
  1209600000: "14 Days",
  2414880000: "28 Days",
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to timeout")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("duration")
        .setDescription("How long to time the user out for.")
        .setRequired(true)
        .addChoices(
          {
            name: "5 Minutes",
            value: "300000",
          },
          {
            name: "30 Minutes",
            value: "1800000",
          },
          {
            name: "1 Hour",
            value: "3600000",
          },
          {
            name: "6 Hours",
            value: "21600000",
          },
          {
            name: "1 Day",
            value: "86400000",
          },
          {
            name: "3 Days",
            value: "259200000",
          },
          {
            name: "7 Days",
            value: "604800000",
          },
          {
            name: "14 Days",
            value: "1209600000",
          },
          {
            name: "28 Days",
            value: "2414880000",
          }
        )
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("The reason for timing out")
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
    const reason =
      interaction.options.getString("reason") || "No Reason Provided";
    const duration = interaction.options.getString("duration");
    const durationInReadableValues = durationList[duration];
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
      await user.timeout(Number(duration));

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`User Timed Out`)
            .setDescription(`${interaction.user} has timed out by ${user}`)
            .setColor("Purple")
            .setFooter({
              text: "Echo Enterprises",
              iconURL: client.user.avatarURL(),
            })
            .addFields(
              {
                name: "Reason",
                value: reason,
                inline: true,
              },
              {
                name: "Duration",
                value: durationInReadableValues,
                inline: true,
              }
            ),
        ],
      });

      await logChannel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle(`User Timed Out`)
            .setDescription(`${user} was timed out by ${interaction.user}`)
            .setColor("Purple")
            .setFooter({
              text: "Echo Enterprises",
              iconURL: client.user.avatarURL(),
            })
            .addFields(
              {
                name: "Reason",
                value: reason,
                inline: true,
              },
              {
                name: "Duration",
                value: durationInReadableValues,
                inline: true,
              }
            ),
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
