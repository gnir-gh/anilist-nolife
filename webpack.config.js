const { UserscriptPlugin } = require('webpack-userscript');
const path = require('path');

module.exports = {
	entry: path.resolve(__dirname, 'src', 'index.js'),
	mode: 'production',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'anilist-nolife.user.js',
	},
	plugins: [new UserscriptPlugin({
		headers(original) {
			return {
				...original,
				match: ['https://anilist.co/*'],
				name: 'anilist-nolife'
			}
		}
	})],
};