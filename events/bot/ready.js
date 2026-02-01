const { ActivityType } = require("discord.js"); // Importando ActivityType
const axios = require('axios'); // Importando axios

module.exports = {
    name: "ready",
    run: async (client) => {
        

        console.log(`${client.user.tag} Foi iniciado \n - Atualmente ${client.guilds.cache.size} servidores!\n - Tendo acesso a ${client.channels.cache.size} canais!\n - Contendo ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} usuarios!`)

        let status = [
            {
                name: "🤖 Sovereign Store",
                type: ActivityType.Streaming,
                url: 'https://www.twitch.tv/Invictozin',
            },
        ];

        function clearConsole() {
            console.clear();
        }

        setInterval(clearConsole, 10000);

        client.user.setActivity(status[0].name, {
            type: status[0].type,
            url: status[0].url,
        });

        // Altera a descrição do bot para a oficial
        const description = "» Criador: yInvicto\n» Me adquira: https://discord.gg/rXxgm72Zj4";
        try {
            await axios.patch(`https://discord.com/api/v10/applications/${client.user.id}`, {
                description: description
            }, {
                headers: {
                    "Authorization": `Bot ${client.token}`,
                    "Content-Type": 'application/json',
                }
            });
        } catch (error) {
            console.error('Erro ao atualizar descrição do bot:', error);
        }
    },
};

