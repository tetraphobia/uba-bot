import { Client } from '@typeit/discord';

interface Config {
    token: string,
    modules_enabled: string[],
    prefix: string,
    webserver_port: number
}


export class UBA {
    private static _config: Config = require(`${__dirname}/config.json`);
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
