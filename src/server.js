import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import proxy from 'express-http-proxy';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

var server = require('http').createServer().listen(8765);
var Gun = require('gun');
Gun({web: server});

polka() // You can also use Express
	.use(function(req, res, next) {
		res.status = code => (res.statusCode = code);
		res.set = res.setHeader.bind(res);
		next();
	})
  	.use('/gun', proxy('http://localhost:8765'))
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware()
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
