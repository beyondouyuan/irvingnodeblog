/*
 * @Author: beyondouyuan
 * @Date:   2017-03-05 18:08:50
 * @Last Modified by:   beyondouyuan
 * @Last Modified time: 2017-03-07 23:07:35
 */

var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    // 导入数据建模
    Post = mongoose.model('Post');

// 设置后台路由，后端路由均挂载在admin/下
// 此处不能再使用app.use('/', router);
// 必须得修改路由规则，否则将会与home.js[即前台页面路由规格]下发生冲突
// 此后所有访问后台的路径[即路由规则]都必须是
// localhost:3000/admin/**
module.exports = function(app) {
    app.use('/admin', router);
};
// 访问路径为
// localhost:3000/admin/
router.get('/', function(req, res, next) {
    // Post.find(function(err, posts) {
    //     if (err) return next(err);
    //     res.render('admin/index', {
    //         title: '后台首页',
    //         posts: posts
    //     });
    // });
    // 重定向
    res.redirect('/admin/posts');
});

// 访问路径为
// localhost:3000/admin/add
router.get('/add', function(req, res, next) {
    Post.find(function(err, posts) {
        if (err) return next(err);
        res.render('admin/index', {
            title: '后台添加文章页面',
            posts: posts
        });
    });
});

// 访问路径为
// localhost:3000/admin/posts
// router.get('/posts', function(req, res, next) {
//     Post.find(function(err, posts) {
//         if (err) return next(err);
//         res.render('admin/index', {
//             title: '后台文章列表',
//             posts: posts
//         });
//     });
// });
