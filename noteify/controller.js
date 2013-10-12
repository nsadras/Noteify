var fs = require('fs');
var util = require('./util.js');

// Homepage
exports.index = function(req, res){
  res.render('index', { title: 'Noteify' });
};

//Get video and analyze score
exports.score = function(req, res){
  var url = req.query['url'];
  util.convert(url, function(fileURl){
    console.log('done downloading and converting');
    res.json({musicUrl: fileURl});
  });
}

exports.data = function(req, res){
  var filePath = __dirname + '/data/' + req.query['file'];

  var stat = fs.statSync(filePath);
  res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Length': stat.size
  });

  var readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
}
