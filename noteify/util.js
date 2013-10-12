var fs = require('fs');
var ytdl = require('ytdl');
var ffmpeg = require('fluent-ffmpeg');
var sox = require('sox');

var counter = 1;

module.exports = {
  convert: function(url, callback) {
    // Download Youtube video as WAV
    var stream = ytdl(url);
    var wavFile = './data/' + counter + '.wav';
    var proc = new ffmpeg({source: stream})
      .toFormat('wav')
      .saveToFile(wavFile, function(stdout, stderr){
        // Convert WAV to MIDI
        var job = sox.transcode(wavFile, './data/' + counter + '.midi', {format: 'midi'});
        job.on('progress', function(info){
          console.log(info);
        });
        job.on('end', function(){
          console.log('done!');
        });

        job.start();
      });
  }
}