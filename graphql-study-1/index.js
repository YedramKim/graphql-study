const { graphql, buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');
const fs = require('fs');
const express = require('express');
const app = express();

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

// 어제 재원쌤이 오셨을 때 

let Person = (name, job, age = 10) => ({
	name,
	job() {
		return `job is ${job}.`;
	},
	age
});

let people = ([
	Person('john', 'programmer'),
	Person('carly', 'designer'),
	Person('trumph', 'president'),
	Person('tom', 'shipper'),
	Person('tony start', 'Iron man'),
	Person('Steve', 'Captain America'),
	Person('Peter', 'Spider man')
]).map((person, idx) => {
	person.id = idx;
	return person;
});

let rootValue = {
	people: () => {
		return people;
	},
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

app.use('/graphql', graphqlHTTP({
	schema,
	rootValue,
	graphiql: true
}));
app.listen(4000, () => {
	console.log('running');
});