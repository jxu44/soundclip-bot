const { SlashCommandBuilder } = require("discord.js");
const { joinVoiceChannel, EndBehaviorType } = require("@discordjs/voice");
const prism = require('prism-media');

const audioBuffers = new Map(); // Stores PCM chunks per user

module.exports = {
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Make the bot join your current voice channel"),

    async execute(interaction) {
        const channel = interaction.member.voice.channel;

        if (!channel) {
            return interaction.reply("❌ You need to be in a voice channel for me to join!");
        }

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: false
        });

        // Listen for users starting to speak
        connection.receiver.speaking.on('start', userId => {
            if (userId === interaction.client.user.id) return;
            const opusStream = connection.receiver.subscribe(userId, { end: { behavior: EndBehaviorType.Manual } });
            const pcm = new prism.opus.Decoder({ frameSize: 960, channels: 2, rate: 48000 });

            opusStream.pipe(pcm);
            if (!audioBuffers.has(userId)) audioBuffers.set(userId, []);
            const userBuffer = audioBuffers.get(userId);

            pcm.on('data', chunk => {
                userBuffer.push(chunk);
                while (Buffer.concat(userBuffer).length > 960000) userBuffer.shift(); // keep last 5 sec
            });
        });

        interaction.reply(`✅ Joined and listening in ${channel.name}`);
    },
    audioBuffers // export buffer so other commands can access

    
};