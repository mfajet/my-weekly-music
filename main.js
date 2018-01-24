require('dotenv').config();
const fetch = require("node-fetch");
const createCollage = require("photo-collage");
const fs = require('fs');
const lastfmkey = process.env.lastfm;
const username = process.env.user;
var Twitter = require('twitter');
var twitterConfig = {
    consumer_key: process.env.twitterConsumerKey,
    consumer_secret: process.env.twitterConsumerSecret,
    access_token_key: process.env.twitterAccessToken,
    access_token_secret: process.env.twitterAccessTokenSecret,
}

var twitter = new Twitter(twitterConfig);
images =[];
fetch('http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&limit=25&page=1&period=7day&user=' + username + '&api_key=' + lastfmkey + '&format=json').then(response => {
    response.json().then(json => {
        console.log(json.topalbums.album[2]);
        var albums = json.topalbums.album;
        for(var i=0; i<albums.length;i++){
            var pic = albums[i].image[3]['#text'];
            if(pic===''){
                pic = 'https://static-cdn.jtvnw.net/jtv_user_pictures/2842e2cbec5f9e1c-profile_image-300x300.jpeg';
            }
            images.push(pic);
        }
    }).catch((err)=>{console.log(err);}).then(()=>{
        console.log("after");
        console.log(images);
        const options = {
          sources: images,
          width: 5, // number of images per row
          height: 5, // number of images per column
          imageWidth: 300, // width of each image
          imageHeight: 300, // height of each image
          spacing: 0, // optional: pixels between each image
        };
        var data
        createCollage(options)
          .then((canvas) => {
            const src = canvas.jpegStream();
            data = canvas.toBuffer();
            const dest = fs.createWriteStream("myFile.jpg");
            src.pipe(dest);
        }).then(()=>{
            twitter.post('media/upload', {media: data}, function(error, media, response) {
                if(!error){
                var status = {
                  status: 'My automatically generated top 25 weekly albums!',
                  media_ids: media.media_id_string // Pass the media id string
                }
                twitter.post('statuses/update', status)
                  .then(function (tweet) {
                    console.log(tweet);
                  })
                  .catch(function (error) {
                    throw error;
                  })
              }else{
                  //console.log(response);
              }
            })
        }).catch(function (error) {
          throw error;
        })
    }).catch(function (error) {
      throw error;
    })
}).catch((err)=>{console.log(err);})
