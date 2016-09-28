var express = require('express');
var router = express.Router();
//var io = require('socket.io')(server);

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/about',function(req,res){
	res.render('about',{title:'My Bio',name:'Himanshu Chowdhary'});
});

module.exports = router;
