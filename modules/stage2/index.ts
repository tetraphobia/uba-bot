import {UBA} from "../../index";
import express from 'express';
import {GuildMember, MessageEmbed} from 'discord.js';


import {
    On,
    ArgsOf
} from '@typeit/discord';

const createSuccessEmbed = () =>
    new MessageEmbed()
        .setColor('#a3be8c')
        .setDescription(`
        Well done.
        
        Now in order to join our void-screaming club, we need to see how loudly you can scream into the void.
        
        We've prepared one of our many voids for you to scream into. Go now, and scream into it.
        `)
        .addFields({
            name: 'The Void', value: 'https://lunar.r3valkyrie.com/'
        })
        .setAuthor('/tmp/the_gauntlet/stage1/')
        .setFooter('Use the !restart command to restart the trial.', 'https://iconic.app/icons/iconic/png/white/information.png')
        .setThumbnail('https://iconic.app/icons/iconic/png/white/lock-unlocked.png')

const createWelcomeEmbed = async (member: GuildMember): Promise<MessageEmbed> =>
    new MessageEmbed()
        .setColor('#8fbcbb')
        .setDescription(`
        A whisper from beyond requested that I promote you.
        
        Welcome home, ${member.user.username}.
        `)
        .setAuthor('/dev/infinite_stars')
        .setThumbnail('https://i.imgur.com/fmQozmX.png')
        .setImage('https://i.imgur.com/L1QAFHC.png')


async function promote(member: GuildMember): Promise<void> {
    let role = await member.guild.roles.cache.find(role => role.name === '🕯️ Acolyte')
    let trial = await member.guild.roles.cache.find(role => role.name === 'Trial')
    if (member.roles.cache.has(trial.id)){
        await member.roles.remove(trial)
        await member.roles.add(role)
        let embed = await createWelcomeEmbed(member)
        await member.send(embed)
            .catch(console.error)
    }

}

export abstract class Stage2 {
    private static _exp = express();
    static get exp(){return this._exp};

    @On('stageOneSuccess' as any)
    async stagePassed([channel]): Promise<void>{
        channel.send(createSuccessEmbed())
    }

    @On('post_request' as any)
    async validate([discordid, key]): Promise<void>{
        const keyTest = Buffer.from(String(Date.parse(String(new Date))).substr(0, 8) + 'ligma').toString('base64')

        if(key === keyTest){
            let guild = await UBA.Client.guilds.cache.first()
            await guild.members.fetch(discordid)
                .then(promote)
                .catch(console.log)
        }
    }

    static init(){
        this._exp.use(express.json())

        this._exp.get('/', (req, res) => {
            res.sendFile(`${__dirname}/web/index.html`)
        })

        this._exp.post('/validate', (req, res) => {
            if (req.body.discordid && req.body.key){
                const {discordid, key} = req.body
                UBA.Client.emit('post_request', discordid, key)
            }
	    res.sendStatus(200);
        })

        this._exp.use(express.static(`${__dirname}/web/static`))

        this._exp.listen(UBA.config.webserver_port)
        console.log(`🚀 Webserver listening on port ${UBA.config.webserver_port}`)
    }
}

Stage2.init()
