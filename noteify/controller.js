var util = require('./util.js');

// Homepage
exports.index = function(req, res){
  res.render('index', { title: 'Noteify' });
};

//Get video and analyze score
exports.score = function(req, res){
  var url = req.query['url'];
  util.convert(url, function(){
    console.log('done');
  });
}