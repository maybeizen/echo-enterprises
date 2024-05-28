const {
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  ChannelType,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  PermissionsBitField,
} = require("discord.js");
const c = require("chalk");
const Ticket = require("../../schemas/Ticket.js");

/**
 * @param {Object} param0
 * @param {param import("discord.js").ChatInputCommandInteraction} param0.interaction
 */

module.exports = async (interaction, client) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "new-ticket-button") {
    const guild = interaction.guild;
    const staffRoleId = "1182472642465386586";
    const user = interaction.user;

    const ticket = await Ticket.findOne({
      userId: interaction.user.id,
    });

    const types = [
      {
        label: "Simply Smoother",
        value: "ss",
        emoji: "1199466780909912114",
      },
      {
        label: "Simply Smoother (Vulkan)",
        value: "vulkan",
        emoji: "1201302353400299530",
      },
      {
        label: "Expanded Vanilla",
        value: "ev",
        emoji: "1184587839694970961",
      },
      {
        label: "Dawn",
        value: "dawn",
        emoji: "1204969102339481672",
      },
      {
        label: "Other",
        value: "other",
        emoji: "🎱",
      },
    ];

    const permissions = [
      {
        id: user.id,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
        ],
      },
      {
        id: guild.roles.everyone.id,
        deny: [
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.ViewChannel,
          ,
        ],
      },
      {
        id: staffRoleId,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
        ],
      },
    ];

    const menuOptions = types.map((type) =>
      new StringSelectMenuOptionBuilder()
        .setLabel(type.label)
        .setEmoji(type.emoji)
        .setValue(type.value)
    );

    const menu = new StringSelectMenuBuilder()
      .setCustomId(interaction.id)
      .setPlaceholder("Select a ticket to open...")
      .setMinValues(1)
      .setMaxValues(1)
      .addOptions(menuOptions);

    await interaction.deferReply({ ephemeral: true });

    if (ticket) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription(
              `Hey! You already have a ticket open at <#${ticket.channelId}>! Please use this ticket instead!`
            )
            .setColor("Red")
            .setFooter({
              text: "Echo Enterprises",
              iconURL: client.user.avatarURL(),
            }),
        ],

        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setLabel("Jump to Ticket")
              .setStyle(ButtonStyle.Link)
              .setURL(
                `https://discord.com/channels/${guild.id}/${ticket.channelId}`
              )
          ),
        ],
      });

      return;
    }

    const reply = await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Category")
          .setDescription(
            'Please select a category for this ticket. Use "Other" if none of the provided categories are suitable.'
          )
          .setColor("Purple"),
      ],
      components: [new ActionRowBuilder().addComponents(menu)],
      ephemeral: true,
    });

    const collectorFilter = (i) =>
      i.customId === interaction.id && i.user.id === interaction.user.id;
    const collector = reply.createMessageComponentCollector({
      filter: collectorFilter,
      componentType: ComponentType.StringSelect,
      time: 15_000,
    });

    collector.on("collect", async (i) => {
      const type = i.values[0];
      console.log(i.values);

      const parentCategory = interaction.guild.channels.cache.get(
        "1182907320448057396"
      );

      try {
        const channel = await guild.channels.create({
          name: `${type}-${i.user.username}`,
          type: ChannelType.GuildText,
          parent: parentCategory,
          permissionOverwrites: permissions,
        });

        if (!ticket) {
          const ticket = new Ticket({
            userId: user.id,
            channelId: channel.id,
          });

          await ticket.save();
        }

        await i.update({
          embeds: [
            new EmbedBuilder()
              .setTitle("Ticket Support")
              .setDescription(
                `Your ticket has been created. Press the button below to go to your ticket.`
              )
              .setColor("Purple")
              .setFooter({
                text: "Echo Enterprises",
                iconURL: client.user.avatarURL(),
              }),
          ],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setLabel("Jump")
                .setStyle(ButtonStyle.Link)
                .setURL(
                  `https://discord.com/channels/${guild.id}/${channel.id}`
                )
            ),
          ],
          ephemeral: true,
        });

        await channel.send({
          embeds: [
            new EmbedBuilder()
              .setTitle(`Ticket Support - ${i.user.username}`)
              .setDescription(
                `## Welcome to your Ticket, ${interaction.user}.
                            
                Please describe your issue in as much detail as possible. We will get back to you as soon as possible. Please do not ping staff members in your ticket. This will likely lead to an increased wait time.`
              )
              .setColor("Purple")
              .setFooter({
                text: "Echo Enterprises",
                iconURL: client.user.avatarURL(),
              })
              .setTimestamp(),
          ],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setLabel("Close Ticket")
                .setStyle(ButtonStyle.Danger)
                .setCustomId("close-ticket-button")
            ),
          ],
        });
      } catch (error) {
        console.log(c.red(error));
        console.log(c.gray(error.stack));

        await i.reply({
          content:
            "An error occurred while creating your ticket. Please try again later.",
          ephemeral: true,
        });
      }
    });
  }
};
