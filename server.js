var path = require('path');
var webpack = require('webpack');
var express = require('express');
var config = require('./webpack.dev.config');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

var app = express();
var compiler = webpack(config);

const serverOptions = {
  contentBase: config.src,
  quiet: false,
  noInfo: false,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: config.output.publicPath,
  headers: { 'Access-Control-Allow-Origin': '*' },
  stats: { colors: true },
};

app.use(webpackDevMiddleware(compiler, serverOptions));
app.use(webpackHotMiddleware(compiler));

app.get('/api', function(req, res) {
  var data = {
    ret: true,
    msg: 'success',
    data: {
      list: ['The', 'result', 'come', 'from', 'server.']
    }
  };

  res.statusCode = 500;
  res.end(JSON.stringify(data));
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, './example/index.html'));
});

app.listen(3000, function(err) {
  if (err) {
    return console.error(err);
  }

  console.log('Listening at http://localhost:3000/');
})
