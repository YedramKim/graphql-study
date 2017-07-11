const { graphql, buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');
const fs = require('fs');
const express = require('express');
const app = express();

process.on('uncaughtException', (err) => console.log(err));

let schema = buildSchema(`
	type Query {
		people: [Person],
		person(id: ID): Person
	}

	type Person {
		id: ID
		name: String
		job: String
		age: Int
		friends: [Person]
	}

	input Baby {
		name: String,
		job: String,
		age: Int
	}

	type Mutation {
		addPerson2(newPerson: Baby): Person
		addPerson(newPerson: Baby): Person
	}
`);

let Person = (name, job, fList, age) => ({
	name,
	job(args, ctx, {rootValue: people}) {
		return `job is ${job}.`;
	},
	age,
	friends(args, ctx, {rootValue: {people}}) {
		return fList.map(fIdx => {
			return people.find(person => {
				return person.id == fIdx;
			});
		});
	}
});

let people = ([
	Person('colson', 'shield', [1, 2], 40),
	Person('tony start', 'Iron man', [0, 2, 3], 50),
	Person('Steve', 'Captain America', [0, 1], 80),
	Person('Peter', 'Spider man', [1], 15)
]).map((person, idx) => {
	person.id = idx;
	return person;
});

let rootValue = {
	people,
	person: ({id}) => people.find((person) => {
		return String(person.id) === id;
	}),
	addPerson: ({newPerson: {
		name, job, age
	}}) => {
		let person = Person(name, job, age || undefined);
		person.id = people.length;
		people.push(person);

		return person;
	}
};

let request = `
query {
	people {
		friends {
			id
		}
	}
}
`;

// graphql(schema, request, rootValue).then(({error, data}) => {
// 	if (error) {
// 		console.log(error);
// 	} else {
// 		console.log(data.people);
// 	}
// }).catch(err => console.log(err));

app.use('/graphql', graphqlHTTP({
	schema,
	rootValue,
	graphiql: true
}));
app.listen(4000, () => {
	console.log('running');
});
