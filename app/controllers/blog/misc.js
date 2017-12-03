/*
 * @Author: beyondouyuan
 * @Date:   2017-03-06 16:44:43
 * @Last Modified by:   beyondouyuan
 * @Last Modified time: 2017-03-06 16:57:44
 */

// 'use strict';

// 前台页面路由设计
var express = require('express'),
    router = express.Router();

// 设置前台页面路由规则
// 此后前台页面所有访问路径[即路由规则]为
// localhost:3000/**
module.exports = function(app) {
    app.use('/', router);
};
// home[即前台页面]规则下的根目录
// 访问路径为
// localhost:3000/
router.get('/', function(req, res, next) {
    // 首页重定向至文章列表页
    res.redirect('/posts');
});
// home[即前台页面]路由规则下的archiving目录
// 访问路径为
// localhost:3000/archiving
router.get('/archiving', function(req, res, next) {
    res.render('blog/index', {
        title: '归档',
        pretty: true
    });
});
// home[即前台页面]路由规则下的about目录
// 访问路径为
// localhost:3000/about
router.get('/note', function(req, res, next) {
    res.render('blog/index', {
        title: '笔记',
        pretty: true
    });
});
// home[即前台页面]路由规则下的contact目录
// 访问路径为
// localhost:3000/contact
router.get('/contact', function(req, res, next) {
    res.render('blog/index', {
        title: '联系',
        pretty: true
    });
});

// home[即前台页面]路由规则下的about目录
// 访问路径为
// localhost:3000/about
router.get('/about', function(req, res, next) {
    res.render('blog/index', {
        title: '关于',
        pretty: true
    });
});
