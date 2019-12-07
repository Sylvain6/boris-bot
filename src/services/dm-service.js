const { Autohook } = require("twitter-autohook");
const Twitter = require("twit");

class TwitterBot {
    constructor (credentials) {
        this.webhook = new Autohook({
            token: credentials.access_token,
            token_secret: credentials.access_token_secret,
            consumer_key: credentials.consumer_key,
            consumer_secret: credentials.consumer_secret,
            env: credentials.webhook_env,
        });
        this.client = new Twitter({
            consumer_key: credentials.consumer_key,
            consumer_secret: credentials.consumer_secret,
            access_token: credentials.access_token,
            access_token_secret: credentials.access_token_secret
        });
        this.event_cache = {};
}


    async subscribe() {
        try {
            this.webhook.on('event', async event => {
                console.log(event);
            });

            await this.webhook.removeWebhooks();
            await this.webhook.start();
            await this.webhook.subscribe({
                oauth_token: '194635067273822212-zmhLX8tK6TD2eXKjWo6FLmfc8QPFN5',
                oauth_token_secret: 'IJ6yjF0pitqEd2KuEb7JrmGYTSaGrKZmRjdC2DgM5sFuG',
            });
        } catch (e) {
            console.error(e);
            process.exit(1);
        }
    }

}

exports.TwitterBot = TwitterBot;