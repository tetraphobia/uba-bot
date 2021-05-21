import { Client } from '@typeit/discord';
import env from 'process';

interface Config {
    token: string,
    modules_enabled: string[],
    prefix: string,
    webserver_port: number
}


export class UBA {
    // Uncomment to use local config rather than env.
    // private static _config: Config = require(`${__dirname}/config.json`);
    private static _config: Config = {
        token: env.DIS_TOKEN,
        modules_enabled: ["stage1", "stage2"],
        prefix: env.PREFIX,
        webserver_port: env.PORT,
    }
    private static _client: Client;

    static get Client(): Client { return this._client }
    static get config(): Config { return this._config }

    static start(): void {
        this._client = new Client();
        this._client.login(
            UBA.config.token,
            `${__dirname}/client/*.ts`
        )
    }
}

UBA.start();
