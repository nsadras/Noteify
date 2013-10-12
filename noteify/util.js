var ytdl = require('ytdl');
var ffmpeg = require('fluent-ffmpeg');

var counter = 1;

module.exports = {
  convert: function(url, callback) {
    // Download Youtube video as WAV
    var stream = ytdl(url);
    var wavFile = './data/' + counter + '.wav';
    var proc = new ffmpeg({source: stream})
      .toFormat('wav')
      .saveToFile(wavFile, function(stdout, stderr){
        callback(counter + '.wav');
        counter++;
      });
  }
}