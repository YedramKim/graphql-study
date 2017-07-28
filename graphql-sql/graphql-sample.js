const { graphql } = require('graphql');
const { database } = require('./sequelize');
const { schema } = require('./graphql');


database.sync()
	.then(() => {
		return graphql(schema, `
			query {
				movies { 
					id
					title
					year
				}
			}`,{});
	}).then((response) => {
		// console.log(JSON.stringify(response, null, '  '));
	})
	.catch((err) => {
		console.log('에러');
		console.log(err);
		process.exit(1);
	});