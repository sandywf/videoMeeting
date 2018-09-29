'use strict';


process.on('unhandledRejection', err => {
  throw err;
});

const webpack = require('webpack');
const config = require('../config/webpack.config.codyy');

(function(){
	build();
})();

function build() {
    console.log('create Codyy');
    webpack(config).run((err) => {
  		console.log(err);
	});
}
