const { database, models } = require('./sequelize');
const { Character, Movie } = models;
// promise판 app.listen
const server = require('./server');

// 데이터 베이스에 넣을 데이터 들입니다.
let { characters, movies, relativeCAM } = require('./datas');

// 데이터 베이스에 데이터를 비운뒤에 데이터를 다시 넣고 서버를 실행합니다.
database.sync()
	.then(() => {
		console.log('데이터 베이스 연결 성공');
		// 데이터 베이스에 데이터가 있는지 확인하고 없으면 require('./datas')에서 가져온 데이터를 넣게 합니다.
		return Character.count()
			.then((row) => {
				if (row === 0) {
					return Character.bulkCreate(characters)
						.then(() => {
							console.log('Character 데이터 생성 성공');
							return Movie.bulkCreate(movies);
						})
						.then(() => {
							console.log('Movie 데이터 생성 성공');
							return Promise.all(relativeCAM.map((rel) => {
								return Character.connectMovie(rel.character, rel.movie);
							}));
						}).then(() => {
							console.log('관계 설정 완료');
							return 0;
						});
				} else {
					return 0;
				}
			});
	})
	.then(() => {
		return server(80);
	})
	.then(() => {
		console.log('graphql server running...');
	}).catch((err) => {
		console.log('에러');
		console.log(err);
	});