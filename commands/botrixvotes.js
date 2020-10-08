module.exports={
name: "botrixvotes",
description: "null",

async run (client, message, args) {
    const request = require('request');
    request('https://botrix.cc/api/v1/bot/760002548957970432', (error, res, body)=> {
        console.log("Votes: "+JSON.parse(body).bot.votes);
        message.channel.send("Votes: "+JSON.parse(body).bot.votes)
    })
}
}