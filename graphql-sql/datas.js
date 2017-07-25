let characters = [
	{
		name: 'Peter Benjamin Parker',
		job: 'spider man',
		age: 15
	},
	{
		name: 'Anthony Edward Stark',
		job: 'iron man',
		age: 50
	},
	{
		name: 'Steven Grant Rogers',
		job: 'captain america',
		age: 96
	},
	{
		name: 'Scott Edward Harris Lang',
		job: 'ant man',
		age: 34
	},
	{
		name: 'Robert Bruce Banner',
		job: 'hulk',
		age: 46
	}
];

let movies = [
	{
		title: 'Iron man',
		year: 2008
	},
	{
		title: 'Incredible Hulk',
		year: 2008
	},
	{
		title: 'First avenger',
		year: 2011
	},
	{
		title: 'ant man',
		year: 2015
	},
	{
		title: 'spider man: homecoming',
		year: 2017
	}
];

// relative character and movie
let convertObj = (character, movie) => ({character, movie});
let relativeCAM = [
	convertObj(2, 1),
	convertObj(5, 2),
	convertObj(3, 3),
	convertObj(4, 4),
	convertObj(1, 5)
];

module.exports = { characters, movies, relativeCAM };