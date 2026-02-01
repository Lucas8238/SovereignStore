const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const {ownerid, color} = require("../../config.json");
const { bot } = require("../../database/index");
const emoji = require("../../emoji.json");

module.exports = {
    name:"botconfig",
    description:"Configure as opções gerais do bot. [ OwnerOnly ]",
    type: ApplicationCommandType.ChatInput,
    run: async(client, interaction) => {
        if(interaction.user.id !== ownerid) return interaction.reply({content:`Apenas o meu dono pode usar esta função.`, ephemeral:true});
        const userid = interaction.user.id;
        interaction.reply({
            embeds:[
                new EmbedBuilder()
                .setTitle(`${interaction.guild.name} | Configuração do Bot`)
                .setDescription(`Selecione abaixo a opção abaixo que você deseja configurar:`)
                .setColor(color)
            ],
            components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_vendasonoff`)
                        .setEmoji(emoji.carrin)
                        .setLabel(`Vendas - ${bot.get(`vendas`) === true ? "Online" : "Offline"}`)
                        .setStyle(bot.get(`vendas`) === true ? 3 : 4),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_payments`)
                        .setLabel("Configurar Pagamentos") 
                        .setEmoji(emoji.engrenagem)
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_roles`)
                        .setLabel("Configurar Cargo Cliente")
                        .setEmoji(emoji.engrenagem)
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_channels`)
                        .setLabel("Configurar Canal de Logs Secretas")
                        .setEmoji(emoji.engrenagem)
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_categorys`)
                        .setLabel("Configurar Categoria Carrinho")
                        .setEmoji(emoji.engrenagem)
                        .setStyle(1),
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_channelspublic`)
                        .setEmoji(emoji.engrenagem)
                        .setLabel("Configurar Canal de Logs Públicas")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_terms`)
                        .setEmoji(emoji.engrenagem)
                        .setLabel("Configurar Termos")
                        .setStyle(1),
                    )
            ]
        })
    }
}