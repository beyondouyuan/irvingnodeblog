var express = require('express');
var glob = require('glob');

var favicon = require('serve-favicon');
var logger = require('morgan');
// 时间格式化
var moment = require('moment');
// 文本截取
var truncate = require('truncate');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');
// 添加分类，一边在所有页面总应用分类
var validator = require('express-validator');
var mongoose = require('mongoose');

// express会话模块
var session = require('express-session');

// 跨会话信息传递
var flash = require('connect-flash');

// var message = require('express-messages');

var Category = mongoose.model('Category');

module.exports = function(app, config) {
    var env = process.env.NODE_ENV || 'development';
    app.locals.ENV = env;
    app.locals.ENV_DEVELOPMENT = env == 'development';

    app.set('views', config.root + '/app/views');
    app.set('view engine', 'jade');
    // 在中间件中添加本地的全局变量用于切换页面样式
    app.use(function(req, res, next) {
        // 本地变量用于传递到模板中使用
        app.locals.pageName = req.path;
        app.locals.moment = moment;
        app.locals.truncate = truncate;
        console.log(app.locals.pageName);
        Category.find(function(err, categories) {
            if (err) {
                return next(err);
            }
            app.locals.categories = categories;
            next();
        });
    });
    // app.use(favicon(config.root + '/public/img/favicon.ico'));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(cookieParser());



    // 验证模块
    app.use(validator({
        errorFormatter: function(param, msg, value) {
            var namespace = param.split('.'),
                root = namespace.shift(),
                formParam = root;

            while (namespace.length) {
                formParam += '[' + namespace.shift() + ']';
            }
            return {
                param: formParam,
                msg: msg,
                value: value
            };
        }
    }));

    // 使用会话机制
    app.use(session({
        secret: 'irvingnodeblog-development',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }
    }));
    // 使用跨会话信息传递
    app.use(flash());
    // 将会话保存至本地，以便在模板中可以调用
    app.use(function(req, res, next) {
        res.locals.messages = require('express-messages')(req, res);
        // var errors = req.flash('error');
        // app.locals.errors = errors.length ? errors : null;
        // var infos = req.flash('info');
        // app.locals.infos = infos.length ? infos : null;
        next();
    });
    app.use(compress());
    app.use(express.static(config.root + '/public'));
    app.use(methodOverride());

    var controllers = glob.sync(config.root + '/app/controllers/**/*.js');
    controllers.forEach(function(controller) {
        require(controller)(app);
    });

    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err,
                title: 'error'
            });
        });
    }

    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {},
            title: 'error'
        });
    });

    return app;
};
