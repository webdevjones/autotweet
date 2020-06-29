const Twitter = require('twitter')
const config = require('./utils/config')
const axios = require('axios')
const convert = require('xml-js')
const fs = require('fs')

var client = new Twitter({
    consumer_key: config.TWITTER_CONSUMER_KEY,
    consumer_secret: config.TWITTER_CONSUMER_SECRET,
    access_token_key: config.FSA_ACCESS_TOKEN,
    access_token_secret: config.FSA_ACCESS_TOKEN_SECRET
})

const tweet_em = async (feed_url) => {
    const xml = await axios.get(feed_url)
    const oldXml = fs.readFileSync('fsa.xml', { encoding: 'utf8', flag: 'r' })
    if (oldXml === xml.data) {
        return
    }
    fs.writeFileSync('fsa.xml', xml.data)

    let converted = convert.xml2js(xml.data, { compact: true, spaces: 4 })
    const newElements = converted.rss.channel.item
    converted = convert.xml2js(oldXml, { compact: true, spaces: 4 })
    const oldElements = converted.rss.channel.item

    newElements.forEach(async elem => {
        if (!oldElements.find(e => e.title._text === elem.title._text)) {
            const elem_title = elem.title._text
            const elem_link = elem.link._text
            const tiny_url = await axios.get(`http://tinyurl.com/api-create.php?url=${elem_link}`)
            const twitter_link = tiny_url.data
            const status = `${elem_title} ${twitter_link}`
            client.post('statuses/update', { status: status }, (error, tweet, response) => {
                if (!error) {
                    console.log(tweet)
                }
                else{
                    console.log('error\n', tweet)
                }
            })
        }
    })
}
tweet_em('https://www.newsbusters.org/autotweet/business')