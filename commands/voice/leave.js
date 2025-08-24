const { SlashCommandBuilder } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Make the bot leave the voice channel"),

    async execute(interaction) {
        // Get the connection for this guild
        const connection = getVoiceConnection(interaction.guild.id);

        if (!connection) {
            return interaction.reply("❌ I'm not in a voice channel right now!");
        }

        connection.destroy(); // Disconnects the bot
        await interaction.reply("✅ Left the voice channel!");
    },
};