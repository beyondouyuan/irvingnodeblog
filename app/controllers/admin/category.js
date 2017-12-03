/*
 * @Author: beyondouyuan
 * @Date:   2017-03-11 21:09:21
 * @Last Modified by:   beyondouyuan
 * @Last Modified time: 2017-05-22 20:59:59
 */

'use strict';



// 分类相关的控制器
var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Post = mongoose.model('Post'),
    Category = mongoose.model('Category');

// 后端分类相关路由规划


module.exports = function(app) {
    app.use('/admin/categories', router);
};

// 分类列表页
router.get('/', function(req, res, next) {

    Category.find()
        .sort('created')
        .exec(function(err, categories) {
            if (err) return next(err);
            var pageNum = Math.abs(parseInt(req.query.page || 1, 5));
            // 每页展示数据条数
            var pageSize = 5;
            // 分类总数
            var totalCount = categories.length;
            // 总页数
            var pageCount = Math.ceil(totalCount / pageSize);
            // 页码不可能大于总数
            if (pageNum > pageCount) {
                // 取整后若是页码大于总页数，这页码为最后一页
                pageNum = pageCount;
            }
            res.render('admin/category/index', {
                title: '分类列表',
                // 截取分类数进行分页
                categories: categories.slice((pageNum - 1) * pageSize, pageNum * pageSize),
                pageNum: pageNum,
                pageCount: pageCount,
                pretty: true,
            });
        });
});

// 添加分类
router.get('/add', function(req, res, next) {
    res.render('admin/category/add', {
        title: '添加分类',
        action: "/admin/categories/add",
        pretty: true,
        category: { _id: ' '}
    });
});

// 提交添加分类
router.post('/add', function(req, res, next) {

});

// 删除分类
// router.get('/delete/:id', function(req, res, next) {

// });

// // 编辑分类
// router.get('/edit/:id', function(req, res, next) {

// });
// // 编辑提交
// router.post('/edit/:id', function(req, res, next) {

// });
