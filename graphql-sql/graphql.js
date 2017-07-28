
// sequeilze 객체 require
// =========================================================
const { database, models } = require('./sequelize');
const { Character: CharacterModel, Movie: MovieModel } = models;
// =========================================================

// graphql 스키마 정리
// =========================================================
const graphql = require('graphql');
const promisify = require('./modules/promisify');
const joinMonster = promisify(require('join-monster').default);
const {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLInt,
	GraphQLString,
	GraphQLList,
	GraphQLEnumType,
	graphql: graphqlPromise
} = graphql;

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
					if (character.movies) {
						return character.movies;
					} else {
						return character.getMovies();
					}
				}
			}
		};
	}
});

const Movie = new GraphQLObjectType({
	name: 'movie',
	sqlTable: 'movies',
	uniqueKey: 'id',
	fields() {
		return {
			id: {
				type: GraphQLInt
			},
			title: {
				type: GraphQLString
			},
			year: {
				type: GraphQLInt
			},
			character: {
				type: Character,
				resolve(movie) {
					return movie.getCharacter();
				}
			}
		}
	}
});

// queryName의 쿼리에서 fieldName을 가져올시에 join을 사용할 지를 정하는 함수
let responseNeedJoin = (queryName, fieldName, resolveInfo, model) => {
	let schemaResolveInfo = resolveInfo.operation.selectionSet.selections.find((field) => field.name.value === queryName),
	includeJoinModel = false;
	if (schemaResolveInfo) {
		let querys = schemaResolveInfo.selectionSet.selections.map((selection) => selection.name.value);
		includeJoinModel = querys.includes(fieldName);
	}
	if (includeJoinModel) {
		return model ? [model] : true;
	} else {
		return model ? [] : false;
	}
}

const query = new GraphQLObjectType({
	name: 'Query',
	fields() {
		return {
			characters: {
				type: new GraphQLList(Character),
				resolve(root, args, context, resolveInfo) {
					let include = [];
					include = include.concat(responseNeedJoin('characters', 'movie', resolveInfo, MovieModel));
					return CharacterModel.findAll({
						include
					});
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
					return MovieModel.findAll();
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
			insertCharacter: {
				type: Character,
				args: {
					name: {type: GraphQLString},
					job: {type: GraphQLString},
					age: {type: GraphQLInt}
				},
				resolve(root, value) {
					return CharacterModel.create(value).catch((err) => {
						return CharacterModel.find({
							where: value
						});
					});
				}
			},
			insertMovie: {
				type: Movie,
				args: {
					title: { type: GraphQLString },
					year: { type: GraphQLInt }
				},
				resolve(root, value) {
					return MovieModel.create(value).catch((err) => {
						console.log('movie 뮤테이션 에러');
						console.log(err);
						return MovieModel.find({
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