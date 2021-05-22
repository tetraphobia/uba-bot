import {UBA} from "../../index";
import {TextChannel, GuildMember, MessageEmbed, User} from 'discord.js';

import {
    On,
    ArgsOf,
} from '@typeit/discord';

const createScreamEmbed = (scream, scan) =>
    new MessageEmbed()
        .setColor(scan ? '#bf616a' : '#8fbcbb')
        .setDescription(scan ? "Spam has been detected in the void. Perhaps they are scanning?" : scream)
        .setAuthor(scan ? 'Cacophony of Voices' : 'The Void Speaks', 'https://i.imgur.com/fmQozmX.png')
        .setImage('https://i.imgur.com/xTFS4oj.png')

const createPostEmbed = (username, validKey, valid, req) =>
    new MessageEmbed()
        .setColor(valid ? '#8fbcbb' : '#bf616a')
        .setDescription(`${username}: ${valid ? 'AUTHENTICATION SUCCESSFUL' : 'AUTHENTICATION FAILURE'}`)
        .addFields(
            {
                name: 'Valid Key',
                value: validKey
            },
            {
                name: 'Request Body',
                value: `\`\`\`json\n${JSON.stringify(req.body, null, 2)}\`\`\``
            },
            {
                name: 'Headers',
                value: `\`\`\`json\n${JSON.stringify(req.headers, null, 2)}\`\`\``
            })
        .setAuthor('/dev/infinite_stars', 'https://i.imgur.com/fmQozmX.png')

const createHashSuccessEmbed = (author, hash, response) =>
    new MessageEmbed()
        .setColor('#8fbcbb')
        .setDescription(`${author} succesfully cracked the SHA-256 hash.`)
        .addFields(
            {
                name: 'Hash',
                value: `\`${hash}\``
            },
            {
                name: 'Response',
                value: `\`${response}\``
            })
        .setAuthor('/dev/infinite_stars', 'https://i.imgur.com/fmQozmX.png')

export abstract class TheVoid {

    @On('post_request' as any)
    async logPostRequest([discordid, key, req]): Promise<void> {
        let guild = await UBA.Client.guilds.cache.first()
        let member = await guild.members.fetch(discordid)
        let channel = await guild.channels.cache.find(channel => channel.name === 'the-void');

        let validKey = Buffer.from(String(Date.parse(String(new Date)))
            .substr(0, 7) + 'ligma')
            .toString('base64')
        let valid = validKey === key

        if (!channel) return;

        if (!((channel): channel is TextChannel => channel.type === 'text')(channel)) return;

        await channel.send(createPostEmbed(member.user.username, validKey, valid, req))
    }

    @On('query_scream' as any)
    async logScream([query, scan = false]): Promise<void> {
        let guild = await UBA.Client.guilds.cache.first()
        let channel = await guild.channels.cache.find(channel => channel.name === 'the-void');

        if(!channel) return;

        if (!((channel): channel is TextChannel => channel.type === 'text')(channel)) return;

        await channel.send(createScreamEmbed(query.scream, scan))
    }

    @On('hash_attempt' as any)
    async hashAttempt([author, hash, response]): Promise<void> {
        let guild = await UBA.Client.guilds.cache.first()
        let channel = await guild.channels.cache.find(channel => channel.name === 'the-void');

        if(!channel) return;

        if (!((channel): channel is TextChannel => channel.type === 'text')(channel)) return;

        await channel.send(createHashSuccessEmbed(author, hash, response))

    }

}