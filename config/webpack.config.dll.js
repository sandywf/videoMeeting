'use strict';

const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin     = require("webpack/lib/optimize/UglifyJsPlugin");
const paths = require('./paths');


module.exports = [{
	devtool: 'cheap-module-source-map',
	entry: ['react', 'react-dom', 'react-router-dom', 'redux', 'react-redux', 'classnames'],
	output: {
		pathinfo: true,
		filename: 'dll/dev/vendor.js',
		publicPath: '/',
		library: 'vendor_library'
	},
	module: {
		strictExportPresence: true,
		rules: [{
			test: /\.(js|jsx)$/,
			include: paths.appSrc,
			loader: require.resolve('babel-loader'),
		}],
	},
	plugins: [
		new webpack.DllPlugin({
			path: 'dll/dev/vendor-manifest.json',
			name: 'vendor_library',
		}),
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('development')
			}
		})
	],
	performance: {
		hints: false,
	},
},{
	devtool: false,
	entry: ['react', 'react-dom', 'react-router-dom', 'redux', 'react-redux', 'classnames'],
	output: {
		pathinfo: true,
		filename: 'dll/prod/vendor.js',
		publicPath: '/',
		library: 'vendor_library'
	},
	module: {
		strictExportPresence: true,
		rules: [{
			test: /\.(js|jsx)$/,
			include: paths.appSrc,
			loader: require.resolve('babel-loader'),
		}],
	},
	plugins: [
		new webpack.DllPlugin({
			path: 'dll/prod/vendor-manifest.json',
			name: 'vendor_library'
		}),
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
	],
	performance: {
		hints: false,
	},
}];