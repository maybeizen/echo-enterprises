const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ChannelType,
} = require("discord.js");

const ticketEmbed = new EmbedBuilder()
  .setTitle("🎫︱Tickets")
  .setDescription(
    "Select the button below and you will prompted to a private channel, where you can speak privately with the staff of **Echo Enterprises**."
  )
  .setColor("#c24cff")
  .setFooter({
    text: "Powered by Echo Enterprises",
  });

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket-setup")
    .setDescription("Send the ticket embed.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to send the ticket embed to.")
        .addChannelTypes(ChannelType.GuildText)
        .addChannelTypes(ChannelType.GuildAnnouncement)
    ),

  run: ({ client, interaction }) => {
    const guild = interaction.guild;
    const ticketChannel = interaction.options.getChannel("channel");
    const ticketButton = new ButtonBuilder()
      .setCustomId("newTicketButton")
      .setLabel("New Ticket")
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("🎫");
    const ticketRow = new ActionRowBuilder().addComponents(ticketButton);

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

  options: {
    userPermissions: ["Administrator"],
  },
};
