import sirv from 'sirv';
import express from 'express';
import compression from 'compression';
import * as sapper from '@sapper/server';
import Gun from 'gun'

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

var server = express() // You can also use Express
	.use(function(req, res, next) {
		res.status = code => (res.statusCode = code);
		res.set = res.setHeader.bind(res);
		next();
	})
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware()
	)
	.use(Gun.serve)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});

Gun({web: server});