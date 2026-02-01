const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const {ownerid} = require("../../config.json");
const emoji = require("../../emoji.json");
const { perm, db } = require("../../database/index");


module.exports = {
    name:"criar",
    description:"Crie um produto. [ OwnerOnly ]",
    type: ApplicationCommandType.ChatInput,
    options:[
        {
            name:"id",
            description:"Coloque o ID do produto",
            type: ApplicationCommandOptionType.String,
            required:true
        }
    ],
    run: async(client, interaction) => {
        const userid = interaction.user.id
        if(!await perm.get(`${userid}`)) return interaction.reply({content:`Você não tem permissão!`, ephemeral:true});
        const id = interaction.options.getString("id");
        const prod = await db.get(`${id}`);
        if(prod) return interaction.reply({content:`Já existe um produto com este ID`, ephemeral:true});
        await interaction.reply({
            content:`Aguarde um momento...`,
            ephemeral:true
        });
        
        await interaction.channel.send({
            embeds:[
                new EmbedBuilder()
                .setTitle(`${interaction.guild.name} | Produto`)
                .setDescription(`\`\`\` Sem Descrição \`\`\` \n${emoji.planeta} **| Produto:** ${id} \n${emoji.dinheiro} **| Preço:** \`R$10.00\`\n${emoji.caixa} **| Estoque:** \`0\``)
            ],
            components:[
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${id}_compra`)
                    .setLabel("Compra")
                    .setStyle(3)
                    .setEmoji(emoji.cart)
                )
            ]
        }).then(async() => {
            await db.set(`${id}`, {
                title:`${interaction.guild.name} | Produto`,
                description:"``` Sem Descrição ```",
                nome: id,
                emoji: "🛒",
                preco: 10.00,
                conta:[],
                banner:"remover",
                pessoas:[]
            });
            interaction.editReply({
                content:`Criado com sucesso!`
            })
        })
    }
}