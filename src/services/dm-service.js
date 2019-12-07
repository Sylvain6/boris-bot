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
                if (event.direct_message_events) {
                    const id_array = Object.keys(event.users);
                    const sender = id_array[0];
                    const user = `@${event.users[sender].screen_name}`;
                    const msgTxt =
                      event.direct_message_events[0].message_create.message_data
                        .text;
                    this._onDm(user, msgTxt);
                }
            });

            await this.webhook.removeWebhooks();
            await this.webhook.start();
            await this.webhook.subscribe({
              oauth_token: process.env.TWITTER_ACCESS_TOKEN,
              oauth_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
            });
        } catch (e) {
            console.error(e);
            process.exit(1);
        }
    }

    async _onDm(user, msg) {
        const tweetContent = `${msg} source: ${user}`;
        this.client.post("statuses/update", { status: tweetContent }, function(
          err,
          data,
          response
        ) {
          console.log(data);
        });
    }

}

exports.TwitterBot = TwitterBot;