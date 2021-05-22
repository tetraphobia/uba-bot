import {UBA} from "../../index";
import {GuildMember, MessageEmbed, User} from 'discord.js';
import {createHash, Hash} from 'crypto';

import {
    On,
    Command,
    ArgsOf,
    CommandMessage
} from '@typeit/discord';

function generateSHAHash(k = null): String {
    const key = k ? k : Math.random().toString(36).substring(6)
    return createHash('sha256')
        .update(key)
        .digest("hex")

}

const createHashEmbed = (hash) =>
    new MessageEmbed()
        .setColor('#bf616a')
        .setDescription(`
        To gain access to this server, we require our users to complete a trial.
        
        Identify the type of hash contained below, and discover the password contained within.
        
        Reply with the correct password to advance to the next stage.
        `)
        .addFields(
            {name: 'Hash', value: hash}
        )
        .setAuthor('/tmp/the_gauntlet/stage1/')
        .setFooter('Use the !restart command to restart the trial.', 'https://iconic.app/icons/iconic/png/white/information.png')
        .setThumbnail('https://iconic.app/icons/iconic/png/white/lock.png')

function sendHash(member: GuildMember | User ) {
    const hash: String = generateSHAHash()
    const embed = createHashEmbed(hash)

    member.send(embed)
        .catch(console.error)
}

export abstract class Stage1 {
    @Command('restart')
    async restart(command: CommandMessage): Promise<void> {
        sendHash(command.author)
    }


    @On('guildMemberAdd')
    async memberJoin([member]: ArgsOf<'guildMemberAdd'>): Promise<void> {
        sendHash(member)

        let role = member.guild.roles.cache.find(role => role.name === "Trial")

        member.roles.add(role)
            .catch(console.error)
    }

    @On('message')
    async messageRecieved([message]: ArgsOf<'message'>): Promise<void> {
        let originalMessage = message;
        if (message.author.bot) return;

        if (message.channel.type == "dm") {
            let response = message.content;

            message.channel.messages.fetch({limit: 100})
                .then(messages => messages.find(user => user.author.id === "845150870383624223"))
                .then(message => {
                    if(message.embeds[0]){
                        const hash = message.embeds[0].fields[0].value
                        const responseHash = generateSHAHash(response)

                        if (hash === responseHash){
                            if(UBA.config.modules_enabled.includes('stage2')) {
                                UBA.Client.emit('hash_attempt', originalMessage.author, hash, response)
                                UBA.Client.emit('stageOneSuccess', message.channel)
                            } else {
                                message.channel.send('Stage 2 is not enabled unfortunately')
                            }
                        }
                    } else return;
                })
        }
    }
}