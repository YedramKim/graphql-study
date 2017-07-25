
// sequeilze 객체 require
// =========================================================
const { database, models } = require('./sequelize');
const { Character: CharacterModel, Movie: MovieModel } = models;
// =========================================================

// graphql 스키마 정리
// =========================================================
const graphql = require('graphql');
const joinMonster = require('join-monster').default;
const {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLInt,
	GraphQLString,
	GraphQLList
} = graphql;

const Movie = new GraphQLObjectType({
	name: 'movie',
	fields() {
		return {
			id: { type: GraphQLInt },
			title: { type: GraphQLString },
			year: { type: GraphQLInt }
		}
	}
});

const Character = new GraphQLObjectType({
	name: 'character',
	fields() {
		return {
			id: { type: GraphQLInt },
			age: { type: GraphQLInt },
			name: { type: GraphQLString },
			job: { type: GraphQLString },
			movie: {
				type: new GraphQLList(Movie),
				resolve(character) {
					return character.getMovies();
				}
			}
		};
	}
});

const query = new GraphQLObjectType({
	name: 'Query',
	fields() {
		return {
			characters: {
				type: new GraphQLList(Character),
				resolve(root) {
					return CharacterModel.findAll();
				}
			},
			character: {
				type: Character,
				args: {
					id: { type: GraphQLInt }
				},
				resolve(root, where) {
					return CharacterModel.find({
						where
					});
				}
			},
			movies: {
				type: new GraphQLList(Movie),
				resolve(root, args, context, resolveInfo) {
					console.log('조인몬스터 실행');
					joinMonster(resolveInfo, {}, (sql) => {
						console.log('해석완료:', sql);
					});
					return [];
					// return MovieModel.findAll();
				}
			},
			movie: {
				type: Movie,
				args: {
					id: { type: GraphQLInt }
				},
				resolve(root, where) {
					return MovieModel.find({
						where
					});
				}
			}
		};
	}
});

const mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields() {
		return {
			createCharacter: {
				type: Character,
				args: {
					name: {type: GraphQLString},
					job: {type: GraphQLString},
					age: {type: GraphQLInt}
				},
				resolve(root, value) {
					return CharacterModel.create(value).catch((err) => {
						console.log('graphql 뮤테이션 에러');
						console.log(err);
						return CharacterModel.find({
							where: value
						});
					});
				}
			}
		};
	}
});

const schema = new GraphQLSchema({
	query,
	mutation
});
// =========================================================

module.exports.schema = schema;