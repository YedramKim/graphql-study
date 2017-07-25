const express = require('express');
const graphqlHTTP = require('express-graphql');
const app = express();
const promisify = require('./modules/promisify');
const { schema } = require('./graphql');

app.use('/graphql', graphqlHTTP({
	graphiql: true,
	pretty: true,
	schema
}));

module.exports = promisify(app.listen, app);