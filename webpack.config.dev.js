const { log } = require('console');
const path = require('path');
const { UserscriptPlugin } = require('webpack-userscript');
const dev = process.env.NODE_ENV === 'development';

log('development:', dev)

module.exports = {
  mode: dev ? 'development' : 'production',
  entry: path.resolve(__dirname, 'src', 'index.js'),
  output: {
	  path: path.resolve(__dirname, 'dist'),
	  filename: 'anilist-nolife-dev.user.js',
  },
  devServer: {
	hot: false,
	liveReload: false,
	client: {
		overlay: false,
	},
	port: 1234
  },
  plugins: [
    new UserscriptPlugin({
      headers(original) {
        if (dev) {
          return {
            ...original,
			name: 'anilist-nolife-dev',
			match: ['https://anilist.co/*'],
            version: `${original.version}-build.[buildNo]`,
          }
        }

        return original;
      },
    }),
  ],
};