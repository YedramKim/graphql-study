const Sequelize = require('sequelize');


// 데이터 베이스 정의
// ====================================================
const dbName = 'graphql';
const dbId = 'root';
const dbPass = 'phpmyadmin';
const database = new Sequelize(dbName, dbId, dbPass, {
	host: 'localhost',
	dialect: 'mysql',
	port: '3306'
});
// ====================================================

// 테이블 정의
// ====================================================
const Character = database.define('character', {
	id: {
		type: Sequelize.INTEGER,
		allowNull: false,
		autoIncrement: true,
		primaryKey: true
	},
	name: {
		type: Sequelize.STRING,
		unique: 'person'
	},
	job: {
		type: Sequelize.STRING,
		unique: 'person'
	},
	age: {
		type: Sequelize.INTEGER,
		defaultValue: 20
	}
}, {
	paranoid: true
});

Character.connectMovie = function(characterInfo, movieInfo) {
	let character;

	if (typeof characterInfo === 'number') {
		characterInfo = {
			id: characterInfo
		};
	}

	if (typeof movieInfo === 'number') {
		movieInfo = {
			id: movieInfo
		};
	}

	return Character.find({
		where: characterInfo
	})
		.then((u) => {
			character = u;
			return Movie.find({
				where: movieInfo
			});
		})
		.then((movie) => {
			return character.addMovie(movie);
		});
};

const Movie = database.define('movie', {
	id: {
		type: Sequelize.INTEGER,
		allowNull: false,
		autoIncrement: true,
		primaryKey: true
	},
	title: {
		type: Sequelize.STRING
	},
	year: {
		type: Sequelize.INTEGER,
		defaultValue: 2008
	}
}, {
	paranoid: true
});

Character.hasMany(Movie);
Movie.belongsTo(Character);
// ====================================================

module.exports.database = database;
module.exports.models = { Character, Movie };