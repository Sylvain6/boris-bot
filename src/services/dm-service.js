const { Autohook } = require('twitter-autohook');
const Twitter = require('twit');
const words = require('../words');

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
                    if (event.direct_message_events[0].message_create.sender_id === process.env.ACCOUNT_ID)
                        return;
                    const id_array = Object.keys(event.users);
                    const sender = id_array[0];
                    const user = event.users[sender];
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
            const username = `@${user.screen_name}`;
            const {
                bannedWords,
                requiredWords,
                wantedWords,
                contains
            } = words;
            const formattedMsg = msg.toLowerCase();
            if (!contains(formattedMsg, bannedWords)) {
                if (contains(formattedMsg, requiredWords)) {
                    if (contains(formattedMsg, wantedWords)) {
                        const tweetContent = `${msg} source: ${username}`;
                        this.client.post('statuses/update', {
                            status: tweetContent
                        }, (
                            err,
                            data,
                            response
                        ) => console.log(data));
                        return;
                    }
                }
            }
            this._wrongMessage(user);
        }

    _wrongMessage(user) {
        const text = 'Je ne peux pas tweeter cela, désolé, je vais plutôt retourner chercher des problèmes sur les lignes souterraines !';
        const obj = {
            "event": {
                "type": "message_create",
                "message_create": {
                    "target": {
                        "recipient_id": user.id
                    },
                    "message_data": {
                        "text": text,
                    }
                }
            }
        }
        this.client.post('direct_messages/events/new', obj)
        .catch(err => console.error(err))
        .then(screen_name => console.log(`Message bien envoyé à ${user.screen_name}`));
    }

}

exports.TwitterBot = TwitterBot;