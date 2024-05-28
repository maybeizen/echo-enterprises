const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const Warns = require(`../schemas/Warn.js`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Give a user a warning...")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("give")
        .setDescription("Give a user a warning...")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to give a warning...")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("The reason for the warning...")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove a warn from a user...")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("the user to remove the warning from...")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("index")
            .setDescription(
              "The index of the warning to remove (in /warn list)..."
            )
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("Get a list of warning for a user...")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to list the warnings for.")
            .setRequired(true)
        )
    ),

  run: async ({ interaction, client }) => {
    await interaction.deferReply({});
    const user = interaction.options.getMember("user");
    const reason = interaction.options.getString("reason");
    const command = interaction.options.getSubcommand();
    const index = interaction.options.getInteger("index");
    const targetUserRolePosition = user.roles.highest.position;
    const authorUserRolePosition = interaction.member.roles.highest.position;

    if (user.user.bot) {
      await interaction.editReply(`You cannot manage warns for a bot!`);
      return;
    }

    if (command === "give") {
      const timestamp = new Date();

      if (
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.ManageMessages
        )
      ) {
        await interaction.editReply(`You are not allowed to run this command!`);
        return;
      }

      if (user.id === interaction.user.id) {
        await interaction.editReply("You cannot add a warn to yourself!");
        return;
      }

      if (targetUserRolePosition >= authorUserRolePosition) {
        await interaction.editReply(
          "You are not allowed to warn this user. They have a higher role than you!"
        );
        return;
      }

      const warns = await Warns.findOne({
        userId: user.id,
      });

      try {
        if (!warns) {
          const warns = new Warns({
            userId: user.id,
            warnsCount: 1,
            warns: [
              {
                warnIndex: 1,
                reason: reason,
                moderatorId: interaction.user.id,
                timestamp: timestamp,
              },
            ],
          });

          await warns.save();

          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle(`Warned Member`)
                .setDescription(`${interaction.user} has warned ${user}!`)
                .setColor("Purple")
                .setFooter({
                  text: "Echo Enterprises",
                  iconURL: client.user.avatarURL(),
                })
                .addFields(
                  {
                    name: "Reason",
                    value: `${reason}`,
                    inline: true,
                  },
                  {
                    name: "Total Warnings",
                    value: `${warns.warnsCount}` || `null`,
                    inline: true,
                  }
                ),
            ],
          });

          return;
        }
        warns.warnsCount++;
        warns.warns.push({
          warnIndex: warns.warnsCount,
          reason: reason,
          moderatorId: interaction.user.id,
          timestamp: timestamp,
        });

        if (warns.warnsCount >= 3) {
          await user.timeout(3600000);

          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle(`Punished Member`)
                .setDescription(
                  `${interaction.user} has warned ${user}! This was their third warning, so they have been timed out for 1 hour(s).`
                )
                .setColor("Purple")
                .setFooter({
                  text: "Echo Enterprises",
                  iconURL: client.user.avatarURL(),
                })
                .addFields(
                  {
                    name: "Reason",
                    value: `${reason}`,
                    inline: true,
                  },
                  {
                    name: "Total Warnings",
                    value: `${warns.warnsCount}` || `null`,
                    inline: true,
                  }
                ),
            ],
          });
        }

        await warns.save();

        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle(`Warned Member`)
              .setDescription(`${interaction.user} has warned ${user}!`)
              .setColor("Purple")
              .setFooter({
                text: "Echo Enterprises",
                iconURL: client.user.avatarURL(),
              })
              .addFields(
                {
                  name: "Reason",
                  value: `${reason}`,
                  inline: true,
                },
                {
                  name: "Total Warnings",
                  value: `${warns.warnsCount}` || `null`,
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
    } else if (command === "remove") {
      if (
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.ManageMessages
        )
      ) {
        await interaction.editReply(`You are not allowed to run this command!`);
        return;
      }

      if (user.id === interaction.user.id) {
        await interaction.editReply("You cannot add a warn to yourself!");
        return;
      }

      if (targetUserRolePosition >= authorUserRolePosition) {
        await interaction.editReply(
          "You are not allowed to warn this user. They have a higher role than you!"
        );
        return;
      }

      const warns = await Warns.findOne({ userId: user.id });

      try {
        if (
          !warns ||
          warns.warns.length === 0 ||
          index < 1 ||
          index > warns.warnsCount
        ) {
          await interaction.editReply(
            "You provided an invalid index, or the user has no warnings!"
          );
          return;
        }

        warns.warns.splice(index - 1, 1);
        warns.warnsCount--;

        await warns.save();

        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Removed Warning")
              .setDescription(
                `${interaction.user} has removed warning ${index} from ${user}`
              )
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
    } else if (command === "list") {
      try {
        let warnListEmbed = new EmbedBuilder()
          .setTitle(`Warnings for ${user.user.username}`)
          .setDescription(`Here are all of the warnings for ${user}`)
          .setColor("Purple")
          .setFooter({
            text: "Echo Enterprises",
            iconURL: client.user.avatarURL(),
          });

        const warns = await Warns.findOne({
          userId: user.id,
        });

        if (!warns || warns.warns.length === 0) {
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle(`Error`)
                .setDescription(`${user} does not have any warnings!`)
                .setColor("Red")
                .setFooter({
                  text: "Echo Enterprises",
                  iconURL: client.user.avatarURL(),
                }),
            ],
          });
          return;
        }

        warns.warns.forEach((warn, index) => {
          warnListEmbed.addFields({
            name: `(${index + 1}) Warning`,
            value: warn.reason,
            inline: true,
          });
        });

        await interaction.editReply({
          embeds: [warnListEmbed],
        });
      } catch (error) {
        console.error(c.red(error));
        console.log(c.gray(error.stack));
        await interaction.editReply(
          "An internal error occurred! Please try again later."
        );
      }
    }
  },
};
