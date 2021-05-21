import {UBA} from "../index";
import fetch from 'node-fetch';

const data = JSON.stringify({
    discordid: '833449832034336819',
    key: Buffer.from(String(Date.parse(String(new Date))).substr(0, 10) + 'ligma').toString('base64')
})

async function test() {
    await fetch(
        `http://localhost:3000/validate`,
        {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )
        .then(console.log)
        .catch(console.error)
}
test()
