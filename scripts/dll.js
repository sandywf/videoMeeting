'use strict';


process.on('unhandledRejection', err => {
  throw err;
});

const webpack = require('webpack');
const config = require('../config/webpack.config.dll');

(function(){
	build();
})();

function build() {
    console.log('create Dll');
    webpack(config).run((err) => {
  		console.log(err);
	});
}
