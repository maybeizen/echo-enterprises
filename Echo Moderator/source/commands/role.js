const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const c = require("chalk");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("role")
    .setDescription("Manage roles for a user")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add a role to a user")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to add the role to")
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to add to the user")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("take")
        .setDescription("Remove a role from a user")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to remove the role from")
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to remove from the user")
            .setRequired(true)
        )
    ),

  run: async ({ interaction, client }) => {
    const subcommand = interaction.options.getSubcommand();
    const user = interaction.options.getMember("user");
    const role = interaction.options.getRole("role");
    const author = interaction.member;
    const highestRole = author.roles.highest;

    if (!author.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return interaction.reply("You are not allowed to run this command!", {
        ephemeral: true,
      });
    }

    if (subcommand === "add") {
      if (user.roles.cache.has(role.id)) {
        return interaction.reply("The provided user already has that role!");
      }

      if (role.comparePositionTo(highestRole) > 0) {
        return interaction.reply(
          "You are not allowed to add that role. That user has a higher role than you!"
        );
      }

      try {
        await user.roles.add(role);

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Role Added")
              .setDescription(`You added role ${role} to ${user}`)
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
        return interaction.reply(
          "An internal error occurred! Please try again later."
        );
      }
    } else if (subcommand === "take") {
      if (!user.roles.cache.has(role.id)) {
        return interaction.reply("The provided user does not have that role!", {
          ephemeral: true,
        });
      }

      if (role.comparePositionTo(highestRole) > 0) {
        return interaction.reply(
          "You are not allowed to remove that role. That user has a higher role than you!"
        );
      }

      try {
        await user.roles.remove(role);

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Role Removed")
              .setDescription(`You removed role ${role} from ${user}`)
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

        return interaction.reply(
          "An internal error occurred! Please try again later."
        );
      }
    }
  },
};
