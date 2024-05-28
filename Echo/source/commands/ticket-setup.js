const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ChannelType,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket-embed")
    .setDescription("Send the embed for ticket creations...")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to send the ticket embed to...")
        .addChannelTypes(ChannelType.GuildText)
        .addChannelTypes(ChannelType.GuildAnnouncement)
    ),

  run: ({ interaction, client }) => {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return interaction.reply("You are not allowed to run this command!");
    }

    const ticketChannel = interaction.options.getChannel("channel");
    const ticketEmbed = new EmbedBuilder()
      .setTitle("Support Tickets")
      .setDescription(
        "Select the button below and you will prompted to a private channel, where you can speak privately with the staff of **Echo Enterprises**."
      )
      .setColor("Purple")
      .setFooter({
        text: "Echo Enterprises",
        iconURL: client.user.avatarURL(),
      });
    const ticketRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("new-ticket-button")
        .setLabel("Create Ticket")
        .setStyle(ButtonStyle.Secondary)
    );

    if (ticketChannel) {
      interaction.reply({
        content: `Ticket Embed Sent to ${ticketChannel}`,
        ephemeral: true,
      });
      ticketChannel.send({
        embeds: [ticketEmbed],
        components: [ticketRow],
      });
    } else {
      interaction.reply({
        embeds: [ticketEmbed],
        components: [ticketRow],
      });
    }
  },
};
