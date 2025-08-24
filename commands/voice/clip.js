const { SlashCommandBuilder } = require('discord.js');
const ffmpeg = require('fluent-ffmpeg');
const { Readable } = require('stream');
const path = require('path');
const joinCommand = require('./join'); // access audioBuffers

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clip')
        .setDescription('Save the last 5 seconds of your voice as a WAV file'),

    async execute(interaction) {
        const userId = interaction.user.id;
        const bufferArr = joinCommand.audioBuffers.get(userId);

        if (!bufferArr || bufferArr.length === 0)
            return interaction.reply('❌ No audio detected!');

        const wavPath = path.join(__dirname, `clip-${userId}-${Date.now()}.wav`);

        // Create a Readable stream from PCM data
        const pcmStream = new Readable();
        pcmStream.push(Buffer.concat(bufferArr));
        pcmStream.push(null);

        // Convert PCM to WAV
        ffmpeg(pcmStream)
            .inputFormat('s16le')       // Discord PCM format
            .audioFrequency(48000)
            .audioChannels(2)
            .output(wavPath)
            .on('end', () => interaction.reply(`✅ Saved your clip: ${wavPath}`))
            .on('error', err => {
                console.error(err);
                interaction.reply('❌ Error converting clip to WAV.');
            })
            .run();
    },
};
