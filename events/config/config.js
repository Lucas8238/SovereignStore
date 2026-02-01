const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, RoleSelectMenuBuilder, StringSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType } = require("discord.js");
const {ownerid} = require("../../config.json");
const { bot, db } = require("../../database/index");
const emoji = require("../../emoji.json");
const fs = require("fs");



module.exports = {
    name:"interactionCreate",
    run:async(interaction, client) => {
        const {customId} = interaction;
        if(!customId) return;
        const userid = customId.split("_")[0];
        const id = customId.split("_")[1];
        if(interaction.user.id !== userid) return;
        if(!id) return;
        const prod = await db.get(`${id}`);
        if(!prod) return;

        if(customId.endsWith("_deleteprod")){
            const modal = new ModalBuilder()
          .setCustomId(`${userid}_${id}_deleteprodmodal`)
            .setTitle("Deletar Produto");

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setStyle(1)
            .setPlaceholder('Digite: "SIM"')
            .setLabel("Você deseja realmete deletar?");

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }

       if (customId.endsWith("_deleteprodmodal")) {
    const text = interaction.fields.getTextInputValue("text");

    if (text !== "SIM") {
        return interaction.reply({
            content: "Cancelado com sucesso!",
            ephemeral: true
        });
    }

    await db.delete(id);

    await interaction.reply({
        content: "Produto deletado com sucesso!",
        ephemeral: true
    });
}
    
        if(customId.endsWith("_titleprod")) {
            const modal = new ModalBuilder()
            .setTitle("Alterar Titulo")
            .setCustomId(`${userid}_${id}_titleprodmodal`);
            const text = new TextInputBuilder()
            .setCustomId("text")
            .setLabel("Escolha o novo título:")
            .setStyle(1)
            .setPlaceholder("Coloque o título desejado.")
            .setRequired(true);
            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_titleprodmodal")) {
            const text = interaction.fields.getTextInputValue("text");
            await db.set(`${id}.title`, text);
            config();
        }
    
        if(customId.endsWith("_nomeprod")) {
            const modal = new ModalBuilder()
            .setTitle("Alterar Nome")
            .setCustomId(`${userid}_${id}_nomeprodmodal`);
            const text = new TextInputBuilder()
            .setCustomId("text")
            .setLabel("Escolha o novo nome:")
            .setStyle(1)
            .setPlaceholder("Coloque o nome desejado.")
            .setRequired(true);
            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_nomeprodmodal")) {
            const text = interaction.fields.getTextInputValue("text");
            await db.set(`${id}.nome`, text);
            config();
        }

        if(customId.endsWith("_emoji")) {
            const modal = new ModalBuilder()
            .setTitle("Alterar Emoji")
            .setCustomId(`${userid}_${id}_emojiprodmodal`);
            const text = new TextInputBuilder()
            .setCustomId("text")
            .setLabel("coloque o novo emoji:")
            .setStyle(1)
            .setPlaceholder("🛒")
            .setRequired(true);
            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_emojiprodmodal")) {
            const text = interaction.fields.getTextInputValue("text");
            await db.set(`${id}.emoji`, text);
            config();
        }

        if(customId.endsWith("_descprod")) {
            const modal = new ModalBuilder()
            .setTitle("Alterar Descrição")
            .setCustomId(`${userid}_${id}_descprodmodal`);
            const text = new TextInputBuilder()
            .setCustomId("text")
            .setLabel("Escolha a nova descrição:")
            .setStyle(2)
            .setPlaceholder("Coloque a descrição desejada.")
            .setRequired(true);
            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_descprodmodal")) {
            const text = interaction.fields.getTextInputValue("text");
            await db.set(`${id}.description`, text);
            config();
        }

        if(customId.endsWith("_precoprod")) {
            const modal = new ModalBuilder()
            .setTitle("Alterar Preço")
            .setCustomId(`${userid}_${id}_precoprodmodal`);
            const text = new TextInputBuilder()
            .setCustomId("text")
            .setLabel("Escolha o novo preço:")
            .setStyle(1)
            .setPlaceholder("Coloque o preço desejado.")
            .setRequired(true);
            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_precoprodmodal")) {
            const text = parseFloat(interaction.fields.getTextInputValue("text")).toFixed(2);
            if(isNaN(text)) return interaction.reply({content:`Coloque apenas números.`, ephemeral:true});
            if(text < 0.01) return interaction.reply({content:`Coloque valores acima de R$0.01`, ephemeral:true});

            await db.set(`${id}.preco`, text);
            config();
        }
        if(customId.endsWith("_bannerprod")) {
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_${id}_bannerprodmodal`)
            .setTitle("Banner do Produto");

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setStyle(1)
            .setPlaceholder('Se quiser tirar é só digitar: remover')
            .setRequired(true)
            .setLabel("Coloque a URL da imagem.");

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_bannerprodmodal")) {
            const text = interaction.fields.getTextInputValue("text");
            if(text === "remover") {
                await db.set(`${id}.banner`, text);
                config();
            } else {
                await interaction.reply({content:`Aguarde um momento estou verificando a imagem`, ephemeral:true});
                try {
                    interaction.editReply({
                        embeds:[
                            new EmbedBuilder()
                            .setDescription(`Aqui está a nova imagem:`)
                            .setImage(text)
                        ]
                    }).then(async () => {
                        await db.set(`${id}.banner`, text);
                        configedit();
                    }).catch(() => {
                        interaction.editReply({content:`Coloque uma URL válida.`});
                    })
                } catch {
                    interaction.editReply({content:`Coloque uma URL válida.`});
                }
            }
        }
        if(customId.endsWith("_stockprod")) {
            stock();
        }
        if(customId.endsWith("_noiseoscara")) {
            config();
        }
        if(customId.endsWith("_addstockprod")) {
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_${id}_addstockprodmodal`)
            .setTitle("Coloque um estoque");

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setStyle(2)
            .setLabel("coloque o estoque")
            .setPlaceholder("email:senha\nemail2:senha2")
            .setRequired(true);

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_addstockprodmodal")) {
            const text = interaction.fields.getTextInputValue("text").split("\n");
            let b = 0;
            await text.map(async(a) => {
                if(a !== null && a !== "" && a !== undefined) {
                    b++;
                    await db.push(`${id}.conta`, a);
                }
            });
            interaction.reply({content:`Foram Adicionados: \`${b}\` ao estoque!`, ephemeral:true}); 
            await db.get(`${id}.pessoas`).map((rs) => {
                const user = interaction.client.users.cache.get(rs);
                if(user) {
                    user.send({
                        content:`O Produto \`${prod.nome}\` foi restocado e foram adicionados \`${b}\` de Estoque.`,
                        ephemeral:true
                    }).catch(() => {});
                }
            });
            return db.set(`${id}.pessoas`, []);
        }
        if(customId.endsWith("_backupstock")) {
            await interaction.reply({
                content:`${emoji.carregar} | Aguarde um Momento estou fazendo Backup..`,
                ephemeral:true
            });
            try {
                setTimeout(() => {
                var contas = `${db.get(`${id}.conta`)}`.split(',');
        
            const backupItems = contas.map((item, index) => `${index} | - ${item}`);
            var backup = `Aqui o seu estoque:\n\n${backupItems.join('\n')}`; 
        
            fs.writeFile('estoque.txt', backup, (err) => {
                if (err) throw err;
        
                interaction.editReply({
                    content:`${emoji.sim} | Aqui está o Backup do ProdutoID: ${id}`,
                    files: [{
                        attachment: 'estoque.txt',
                        name: 'estoque.txt'
                    }]
                }).then(() => {
                  
                    fs.unlink('estoque.txt', (err) => {
                        if (err) throw err;
                    });
                }).catch(err => {
                    console.error('Erro ao enviar o arquivo:', err);
                });
            });
                
            }, );
        } catch {
            interaction.editReply({content:`${emoji.aviso} | Ocorreu um erro ao tentar fazer backup do produtoID: ${id}`});
        }
        }
        if (customId.endsWith("_removestockprod")) {
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_${id}_removestockmodal`)
            .setTitle("🔧 | Remover");

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setLabel("Coloque o número da linha do produto:")
            .setStyle(1)
            .setPlaceholder("Ex: 1")
            .setMaxLength(4000);

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }

        if(customId.endsWith("_removestockmodal")) {
            const text = parseInt(interaction.fields.getTextInputValue("text"));
            if(isNaN(text)) return interaction.reply({content:`${emoji.aviso} | Error: Valor inválido!`, ephemeral:true});
            if(text < 0) return interaction.reply({content:`${emoji.aviso} | Error: Valor inválido!`, ephemeral:true});
            await interaction.reply({content:`${emoji.loading} | Aguarde um momento...`, ephemeral:true});

            const stock = await db.get(`${id}.conta`);
            if(Number(text) > stock.length) return interaction.reply({content:`${emoji.aviso} | Error: Item não encontrado!`, ephemeral:true});
            try{
                const a = await db.get(`${id}.conta`);
                const removedItem = a.splice(Number(text), 1)[0]; 
                await db.set(`${id}.conta`, a);

                interaction.editReply({content:`${emoji.sim} | Removido com sucesso! \n\n Produto Removido: ${removedItem}`});
                } catch (err){
                    interaction.editReply({
                        content:`${emoji.aviso} | Aconteceu um erro: \n${err.message}`,
                        ephemeral:true
                    }); 
                }
        }
        async function stock() {
            const prod = await db.get(`${id}`);
            if(!prod) return interaction.reply({content:`Não existe um produto com este ID`, ephemeral:true});
            interaction.update({
                embeds:[
                    new EmbedBuilder()
                    .setTitle(`${interaction.guild.name} | Gerenciar Estoque`)
                    .setThumbnail(interaction.guild.iconURL())
                    .setFooter({text:"FDS QUE ISSO TA SIMPLES TLGD? TÔ COM PREGUIÇA"})
                    .setDescription(`${emoji.lupa} | Escolha qual função você deseja usar`)
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_addstockprod`)
                        .setLabel("Adicionar")
                        .setStyle(3)
                        .setEmoji(emoji.mais),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_backupstock`)
                        .setLabel("Backup/Ver Estoque")
                        .setStyle(2)
                        .setEmoji(emoji.caixa),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_removestockprod`)
                        .setLabel("Remover")
                        .setStyle(4)
                        .setEmoji(emoji.menos),
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_noiseoscara`)
                        .setLabel("Voltar")
                        .setStyle(2)
                        .setEmoji(emoji.voltar)
                    )
                ]
            })

        }
        async function config() {
            const prod = await db.get(`${id}`);
        if(!prod) return interaction.reply({content:`Não existe um produto com este ID`, ephemeral:true});
        let banner = "`Não Configurado`";
        if(prod.banner.startsWith("https://")) {
            banner = `[Banner](${prod.banner})`
        } 
        interaction.update({
            embeds:[
                new EmbedBuilder()
                .setTitle(`${interaction.guild.name} | Configurar Produto`)
                .setDescription(`**Titulo Atual:** ${prod.title} \n\n**Descrição Atual:** ${prod.description} \n\n${emoji.lupa} | ID: ${id} \n${emoji.etiqueta} | Nome do Produto: ${prod.nome}\n${emoji.dinheiro} | Preço: ${Number(prod.preco).toFixed(2)} \n${emoji.paleta} | Banner: ${banner}`)
            ],
            components:[
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${userid}_${id}_titleprod`)
                    .setLabel(`Título`)
                    .setEmoji(emoji.engrenagem)
                    .setStyle(3),
                    new ButtonBuilder()
                    .setCustomId(`${userid}_${id}_nomeprod`)
                    .setLabel(`Nome`)
                    .setEmoji(emoji.engrenagem)
                    .setStyle(3),
                    new ButtonBuilder()
                    .setCustomId(`${userid}_${id}_emoji`)
                    .setLabel(`Emoji`)
                    .setEmoji(emoji.engrenagem)
                    .setStyle(3),
                    new ButtonBuilder()
                    .setCustomId(`${userid}_${id}_descprod`)
                    .setLabel(`Descrição`)
                    .setEmoji(emoji.engrenagem)
                    .setStyle(3),
                    new ButtonBuilder()
                    .setEmoji(emoji.engrenagem)
                    .setCustomId(`${userid}_${id}_precoprod`)
                    .setLabel(`Preço`)
                    .setStyle(3),
                ),
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${userid}_${id}_bannerprod`)
                    .setLabel("Configurar Banner")
                    .setEmoji(emoji.engrenagem)
                    .setStyle(1),
                    new ButtonBuilder()
                    .setCustomId(`${userid}_${id}_stockprod`)
                    .setLabel("Configurar estoque")
                    .setEmoji(emoji.engrenagem)
                    .setStyle(1),
                    new ButtonBuilder()
                    .setCustomId(`${userid}_${id}_deleteprod`)
                    .setLabel("Deletar")
                    .setEmoji(emoji.lixeira)
                    .setStyle(4)
                )
            ]
        })
        }
        async function configedit() {
            const prod = await db.get(`${id}`);
        if(!prod) return interaction.reply({content:`Não existe um produto com este ID`, ephemeral:true});
        let banner = "`Não Configurado`";
        if(prod.banner.startsWith("https://")) {
            banner = `[Banner](${prod.banner})`
        } 
        interaction.message.edit({
            embeds:[
                new EmbedBuilder()
                .setTitle(`${interaction.guild.name} | Configurar Produto`)
                .setDescription(`**Titulo Atual:** ${prod.title} \n\n**Descrição Atual:** ${prod.description} \n\n${emoji.lupa} | ID: ${id} \n${emoji.etiqueta} | Nome do Produto: ${prod.nome}\n${emoji.dinheiro} | Preço: ${Number(prod.preco).toFixed(2)} \n${emoji.paleta} | Banner: ${banner}`)
            ],
            components:[
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${userid}_${id}_titleprod`)
                    .setLabel(`Título`)
                    .setEmoji(emoji.engrenagem)
                    .setStyle(3),
                    new ButtonBuilder()
                    .setCustomId(`${userid}_${id}_nomeprod`)
                    .setLabel(`Nome`)
                    .setEmoji(emoji.engrenagem)
                    .setStyle(3),
                    new ButtonBuilder()
                    .setCustomId(`${userid}_${id}_emoji`)
                    .setLabel(`Emoji`)
                    .setEmoji(emoji.engrenagem)
                    .setStyle(3),
                    new ButtonBuilder()
                    .setCustomId(`${userid}_${id}_descprod`)
                    .setLabel(`Descrição`)
                    .setEmoji(emoji.engrenagem)
                    .setStyle(3),
                    new ButtonBuilder()
                    .setEmoji(emoji.engrenagem)
                    .setCustomId(`${userid}_${id}_precoprod`)
                    .setLabel(`Preço`)
                    .setStyle(3),
                ),
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${userid}_${id}_bannerprod`)
                    .setLabel("Configurar Banner")
                    .setEmoji(emoji.engrenagem)
                    .setStyle(1),
                    new ButtonBuilder()
                    .setCustomId(`${userid}_${id}_stockprod`)
                    .setLabel("Configurar estoque")
                    .setEmoji(emoji.engrenagem)
                    .setStyle(1),
                    new ButtonBuilder()
                    .setCustomId(`${userid}_${id}_deleteprod`)
                    .setLabel("Deletar")
                    .setEmoji(emoji.lixeira)
                    .setStyle(4)
                )
            ]
        })
        }
    }}