
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'British Airways | Race The Plane'});
};

//data.text = tweet