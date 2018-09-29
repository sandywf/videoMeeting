'use strict';

const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin     = require("webpack/lib/optimize/UglifyJsPlugin");
const paths = require('./paths');


module.exports = [{
	devtool: 'cheap-module-source-map',
	entry: [paths.dllIndexJS],
	output: {
		pathinfo: true,
		filename: 'dll/dev/codyy.js',
		publicPath: '/'
	},
	module:{
        rules:[
            {
                test: /\.js$/,
				use: {
                    loader: "babel-loader",
					options:{
						babelrc:false,
						presets:['env']
					}
                }
            }
        ]
    },
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('development')
			}
		})
	]
},{
	devtool: false,
	entry: [paths.dllIndexJS],
	output: {
		pathinfo: true,
		filename: 'dll/prod/codyy.js',
		publicPath: '/'
	},
	module:{
		rules:[
			{
				test: /\.js$/,
				use: {
					loader: "babel-loader",
					options:{
						babelrc:false,
						presets:['env']
					}
				}
			}
		]
	},
	plugins: [
		new UglifyJsPlugin({
			compress: {
				warnings: false,
				drop_console: true,
				drop_debugger: true
			},
			sourceMap: false,
		}),
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		})
	]
}];
