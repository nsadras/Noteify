var ytdl = require('ytdl');
var ffmpeg = require('fluent-ffmpeg');

var trim = 30; // 30 seconds is the longest video
var counter = 1;

module.exports = {
  convert: function(url, callback) {
    // Download Youtube video as WAV
    var stream = ytdl(url);
    var wavFile = './data/' + counter + '.wav';

    process.on('uncaughtException',function(error){
      console.log(error);
    })

    var proc = new ffmpeg({source: stream})
      .toFormat('wav')
      .setDuration(30)
      .saveToFile(wavFile, function(stdout, stderr){
        callback(counter + '.wav');
        counter++;
      });

  }
}