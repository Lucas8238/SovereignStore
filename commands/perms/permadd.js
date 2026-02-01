const { ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const {ownerid} = require("../../config.json");
const { perm } = require("../../database/index");


module.exports = {
    name:"permadd",
    description:"Adicione permissão à um usuario. [ OwnerOnly ]",
    type: ApplicationCommandType.ChatInput,
    options:[
        {
            name:"usuario",
            description:"Qual será o usuario que vai adicionar?",
            type: ApplicationCommandOptionType.User,
            required:true
        }
    ],
    run: async(client, interaction) => {
       if (!ownerid.includes(interaction.user.id)) { 
    return interaction.reply({
        content: "❌ Apenas os donos podem usar esta função.",
        ephemeral: true
    });
}
        const user = interaction.options.getUser("usuario");

        await perm.set(`${user.id}`, user.id);
        interaction.reply({content:`O Usuario: ${user} foi adicionado com sucesso!`, ephemeral:true});

}}