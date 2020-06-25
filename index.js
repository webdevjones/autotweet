const Twitter = require('twitter')
const config = require('./utils/config')
const axios = require('axios')
const convert = require('xml-js')

var client = new Twitter({
    consumer_key: config.TWITTER_CONSUMER_KEY,
    consumer_secret: config.TWITTER_CONSUMER_SECRET,
    access_token_key: config.TWITTER_ACCESS_TOKEN,
    access_token_secret: config.TWITTER_ACCESS_TOKEN_SECRET
})

const tweet_em = async (feed_url) => {
    const xml = await axios.get(feed_url)
    const converted = convert.xml2js(xml.data, { compact: true, spaces: 4 })
    const elements = converted.rss.channel.item

    elements.forEach(async elem => {
        const elem_title = elem.title._text
        const elem_link = elem.link._text
        const tiny_url = await axios.get(`http://tinyurl.com/api-create.php?url=${elem_link}`)
        const twitter_link = tiny_url.data
        const status = `${elem_title} ${twitter_link}`
        client.post('statuses/update', { status: status }, (error, tweet, response) => {
            console.log(tweet)
            if (!error) {

                console.log(tweet)
            }
        })

    })
}
tweet_em('https://www.newsbusters.org/feed/twitter')