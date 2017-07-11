const {GraphQLSchema, GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLID, GraphQLList, graphql} = require('graphql');
const graphqlHTTP = require('express-graphql');
const fs = require('fs');
const express = require('express');
const app = express();

const userType = new GraphQLObjectType({
	name: 'User',
	fields: {
		id: { type: new GraphQLNonNull(GraphQLID) },
		userName: { type: GraphQLString },
		age: { type: GraphQLInt },
		friends: {
			type: new GraphQLList(GraphQLInt),
			resolve({friends}, args, context, {rootValue: {users}}) {
				console.log(others.rootValue);

				if (Array.isArray(friends)) {
					return friends.map((friendId) => {
						return users.find(({userId}) => friendId == userId);
					});
				} else {
					return [];
				}
			}
		}
	}
});

const User = (name, age, friends) => ({
	name,
	age,
	friends
});

const query = new GraphQLObjectType({
	name: 'Query',
	fields: {
		user: {
			type: userType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve: (rootValue, {id}) => {
				console.log(root);
			}
		},
		users: {
			type: new GraphQLList(userType),
			resolve: (root) => root.users
		}
	}
}),
mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		createUser: {
			type: userType,
			args: {
				name: { type: GraphQLString },
				age: { type: GraphQLInt }
			},
			resolve: (rootValue, {name, age}) => {
				return {
					id: 0,
					name,
					age
				};
			}
		}
	}
}),
rootValue = {
	users: [
		User('tony', 60, [1, 2]),
		User('tony', 60, [0, 2]),
		User('tony', 60, [1, 0])
	].map((user, idx) => {
		user.id = idx;
		return user;
	})
},
schema = new GraphQLSchema({
	query,
	mutation
}),
query2 = `
{
	users {
		friends
	}
}
`;

graphql(schema, query2, rootValue).then(({data}) => {
	// console.log(data);
});

// app.use('/graphql', graphqlHTTP({
// 	schema,
// 	rootValue,
// 	graphiql: true
// }));

// app.listen(4000, () => console.log('running'));