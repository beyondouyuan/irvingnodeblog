/*
 * @Author: beyondouyuan
 * @Date:   2017-03-06 16:44:43
 * @Last Modified by:   beyondouyuan
 * @Last Modified time: 2017-03-07 17:16:38
 */

// 'use strict';
// 文章相关的控制器
var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Post = mongoose.model('Post'),
    Category = mongoose.model('Category');

module.exports = function(app) {
    app.use('/posts', router);
};

// 文章列表页
router.get('/', function(req, res, next) {
    Post.find({ published: true })
        .sort('created')
        .populate('author')
        .populate('category')
        .exec(function(err, posts) {
            if (err) return next(err);
            // 分页功能，实际上分页应该是在查询数据时执行
            // 此处已经是将所有数据查询下来后再行分页了
            // 页码/默认为1
            var pageNum = Math.abs(parseInt(req.query.page || 1, 10));
            // 每页展示数据条数
            var pageSize = 10;
            // 文章总数
            var totalCount = posts.length;
            // 总页数
            var pageCount = Math.ceil(totalCount / pageSize);
            // 页码不可能大于总数
            if (pageNum > pageCount) {
                // 取整后若是页码大于总页数，这页码为最后一页
                pageNum = pageCount;
            }
            res.render('blog/index', {
                title: '文章列表',
                // 截取文章数进行分页
                posts: posts.slice((pageNum - 1) * pageSize, pageNum * pageSize),
                pageNum: pageNum,
                pageCount: pageCount,
                pretty: true,
            });
        });
});

// 分页标签路由，根据标签名，获取一个标签下的所有文章
router.get('/category/:name', function(req, res, next) {
    Category.findOne({ name: req.params.name })
        .exec(function(err, category) {
            if (err) {
                return next(err);
            }
            // 若无错误，这根据分类查找文章
            Post.find({ category: category, published: true })
                .sort('created')
                .populate('category')
                .populate('author')
                .exec(function(err, posts) {
                    if (err) {
                        return next(err);
                    }
                    var pageNum = Math.abs(parseInt(req.query.page || 1, 10));
                    var pageSize = 10;
                    var totalCount = posts.length;
                    var pageCount = Math.ceil(totalCount / pageSize);
                    if (pageNum > pageCount) {
                        pageNum = pageCount;
                    }
                    res.render('blog/category', {
                        category: category,
                        posts: posts.slice((pageNum - 1) * pageSize, pageNum * pageSize),
                        pageNum: pageNum,
                        pageCount: pageCount,
                        articleNum: totalCount,
                        pretty: true,
                    });
                });
        });
});
// 文章详情页路由，根据id获取对应id的一篇博文
router.get('/view/:id', function(req, res, next) {
    // 若文章id不存在也即文章不存在
    if (!req.params.id) {
        return next(new Error('文章不存在'));
    }
    // 使链接即支持_id参数又支持slug参数
    var conditions = {};
    try {
        conditions._id = mongoose.Types.ObjectId(req.params.id);
    } catch (err) {
        conditions.slug = req.params.id;
        console.log(err);
    }
    Post.findOne(conditions)
        .populate('category')
        .populate('author')
        .exec(function(err, post) {
            if (err) {
                return next(err);
            }
            res.render('blog/view', {
                title: post.title,
                post: post,
            });
        });
});
// 点赞喜欢功能
router.get('/love/:id', function(req, res, next) {
    if (!req.params.id) {
        return next(new Error('文章不存在'));
    }
    // 使链接即支持_id参数又支持slug参数
    var conditions = {};
    try {
        conditions._id = mongoose.Types.ObjectId(req.params.id);
    } catch (err) {
        conditions.slug = req.params.id;
        console.log(err);
    }
    Post.findOne(conditions)
        .populate('category')
        .populate('author')
        .exec(function(err, post) {
            if (err) {
                return next(err);
            }
            post.meta.love = post.meta.love ? post.meta.love + 1 : 1;
            // meta被点击后，标记为已发生改变
            post.markModified('meta');
            // 保存点赞更改
            post.save(function(err) {
                // 将修改后的文章渲染回到详情页面
                res.redirect('/posts/view/' + post.slug);
            });
        });
});

// 评论功能/使用post方法提交
router.post('/comment/:id', function(req, res, next) {
    if (!req.body.email) {
        return next(new Error('email不能为空！'));
    }
    if (!req.body.content) {
        return next(new Error('评论不能为空！'));
    }
    // 使链接即支持_id参数又支持slug参数
    var conditions = {};
    try {
        conditions._id = mongoose.Types.ObjectId(req.params.id);
    } catch (err) {
        conditions.slug = req.params.id;
        console.log(err);
    }
    Post.findOne(conditions)
        .exec(function(err, post) {
            if (err) {
                return next(err);
            }
            // huoqu来自表单提交的数据
            var comment = {
                email: req.body.email,
                content: req.body.content,
                created: new Date()
            };
            // 将提交的评论push入文章的comment数组
            // post.comments.push(comment);
            // push将会把最新评论添加到数组后面
            // 使用unshift()可将其添加到数组开头
            post.comments.unshift(comment);
            // 标记post的commtn已经发生改变
            post.markModified('comments');
            // 保存评论数据
            post.save(function(err, post) {
            	// 提示
            	req.flash("info", "评论成功")
                // 重定向回到当前文章详情页
                res.redirect('/posts/view/' + post.slug);
            });
        });
});
