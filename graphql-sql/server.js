const express = require('express');
const graphqlHTTP = require('express-graphql');
const app = express();
const promisify = require('./modules/promisify');
const { schema } = require('./graphql');

app.post('/graphql', (req, res, next) => {
	console.time('graphql time check');
	next();
});

app.use('/graphql', graphqlHTTP({
	graphiql: true,
	pretty: true,
	schema
}));

app.post('/graphql', (req, res, next) => {
	console.timeEnd('graphql time check');
});

module.exports = promisify(app.listen, app);