const {graphql} = require('graphql');
const bodyParser = require('body-parser');
const {graphqlExpress, graphiqlExpress} = require('graphql-server-express');
const {makeExecutableSchema} = require('graphql-tools');
const graphqlHTTP = require('express-graphql');
const fs = require('fs');
const express = require('express');
const app = express();

let typeDefs = [`
type Query {
	hello: String
}
`];

let resolvers = {
	Query: {
		hello(root) {
			return 'world';
		}
	}
}

let schema = makeExecutableSchema({typeDefs, resolvers});
app.use('/graphql', bodyParser.json(), graphqlExpress({schema}));
app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));
app.listen(4000, () => console.log('running'))