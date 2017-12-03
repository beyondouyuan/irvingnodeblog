/*
 * @Author: beyondouyuan
 * @Date:   2017-03-07 22:29:22
 * @Last Modified by:   beyondouyuan
 * @Last Modified time: 2017-03-27 00:26:41
 */

// 文章相关的控制器
var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    slug = require('slug'),
    Post = mongoose.model('Post'),
    User = mongoose.model('User'),
    Category = mongoose.model('Category');

// 后端文章相关路由规划


module.exports = function(app) {
    app.use('/admin/posts', router);
};

// 文章列表页
router.get('/', function(req, res, next) {
    // 排序功能
    // 若传入参数包含排序字段，则按参数排序，否则按默认创建日期排序
    var sortby = req.query.sortby ? req.query.sortby : 'created';
    // 若参数包含排序顺序字段，则按照参数顺序排序，否则默认按降序排序
    var sortdir = req.query.sortdir ? req.query.sortdir : 'desc';
    // 将表单标题改为链接，点击表单标题，这可传入排序关键词
    // 若没有传入任何排序参数，则默认按照创建日期排序
    if (['title', 'category', 'author', 'created', 'published'].indexOf(sortby) === -1) {
        sortby = 'created';
    }
    // 若没有传入任何排序方向字段，则默认按照降序排序
    if (['desc', 'asc'].indexOf(sortdir) === -1) {
        sortdir = 'desc';
    }
    // 构造排序对象，并传递给mongoose
    var sortObj = {};
    sortObj[sortby] = sortdir;

    // Post.find({ published: true })
    //     .sort(sortObj)
    //     .populate('author')
    //     .populate('category')
    //     .exec(function(err, posts) {
    //         if (err) return next(err);
    //         // 分页功能，实际上分页应该是在查询数据时执行
    //         // 此处已经是将所有数据查询下来后再行分页了
    //         // 页码/默认为1
    //         var pageNum = Math.abs(parseInt(req.query.page || 1, 10));
    //         // 每页展示数据条数
    //         var pageSize = 10;
    //         // 文章总数
    //         var totalCount = posts.length;
    //         // 总页数
    //         var pageCount = Math.ceil(totalCount / pageSize);
    //         // 页码不可能大于总数
    //         if (pageNum > pageCount) {
    //             // 取整后若是页码大于总页数，这页码为最后一页
    //             pageNum = pageCount;
    //         }
    //         res.render('admin/posts/index', {
    //             title: '文章列表',
    //             // 截取文章数进行分页
    //             posts: posts.slice((pageNum - 1) * pageSize, pageNum * pageSize),
    //             pageNum: pageNum,
    //             pageCount: pageCount,
    //             // 传递排序字段
    //             sortby: sortby,
    //             sortdir: sortdir,
    //             pretty: true,
    //         });
    //     });
    //

    // 筛选功能
    // 筛选条件
    var conditions = {};
    // 当有筛选条件传入时，按传入筛选条件查找
    // 若无查询条件传入，则查询出所有数据
    if (req.query.category) {
        conditions.category = req.query.category.trim();
    }
    if (req.query.author) {
        conditions.author = req.query.author.trim();
    }
    // 根据登录的用户查询文章
    User.find({}, function(err, authors) {
        if (err) {
            return next(err);
        }
        // 根据筛选条件查询
        Post.find(conditions)
            .sort(sortObj)
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
                res.render('admin/posts/index', {
                    title: '文章列表',
                    // 截取文章数进行分页
                    posts: posts.slice((pageNum - 1) * pageSize, pageNum * pageSize),
                    pageNum: pageNum,
                    pageCount: pageCount,
                    // 传递排序字段
                    sortby: sortby,
                    sortdir: sortdir,
                    authors: authors,
                    pretty: true,
                    // 传递筛选字段
                    filter: {
                        category: req.query.category || "",
                        author: req.query.author || ""
                    }
                });
            });
    });

});

// 文章编辑页面/与添加文章用同一个页面模板
router.get('/edit/:id', function(req, res, next) {
    // 若文章id不存在也即文章不存在
    if (!req.params.id) {
        return next(new Error('文章不存在'));
    }
    Post.findOne({ _id: req.params.id })
        .populate('category')
        .populate('author')
        .exec(function(err, post) {
            if (err) {
                return next(err);
            }
            res.render('admin/posts/add', {
                title: '编辑文章',
                post: post,
                action: "/admin/posts/edit/" + post._id,
                pretty: true,
            });
        });
});
// 编辑提交
router.post('/edit/:id', function(req, res, next) {
    if (!req.params.id) {
        return next(new Error('文章不存在'));
    }
    Post.findOne({ _id: req.params.id })
        .exec(function(err, post) {
            if (err) {
                console.log(err);
                return next(err);
            }

            var title = req.body.title.trim();
            var category = req.body.category.trim();
            var content = req.body.content;
            // 覆盖原文章

            post.title = title;
            post.category = category;
            post.content = content;
            post.slug = slug(title);
            post.save(function(err, post) {
                if (err) {
                    console.log(err);
                    // req.flash('error','保存失败');
                    res.redirect('/admin/posts/edit' + post._id);
                } else {
                    // req.flash('info', '保存成功');
                    res.redirect('/admin/posts');
                }
            });
        });
});
// 删除文章
router.get('/delete/:id', function(req, res, next) {
    if (!req.params.id) {
        return next(new Erro('文章不存在'));
    }
    // 从数据库中删除对应id的文章
    Post.remove({ _id: req.params.id })
        .exec(function(err, rowsRemove) {
            if (err) {
                return next(err);
            }
            if (rowsRemove) {
                req.flash('info', '文章删除成功');
            } else {
                req.flash('error', '文章删除失败');
            }

            res.redirect('/admin/posts');
        });
});

// 添加文章
router.get('/add', function(req, res, next) {
    res.render('admin/posts/add', {
        title: '添加文章',
        action: "/admin/posts/add",
        // 传一个空值的post的到add.jade，否则添加文章的时候页面找不到post变量将会报错
        // post: { },
        pretty: true,
        // 不能传入一个完全是空值的post过去，否则会报错_id is undefind
        post: {
            category: { _id: ' '},
        },
    });
});

// 提交添加
router.post('/add', function(req, res, next) {

    // 引入express验证规则
    req.checkBody('title','文章标题不能为空').notEmpty();
    req.checkBody('category','必须选定指定分类').notEmpty();
    req.checkBody('content','文章内容不能为空').notEmpty();

    // 获取当前后端页面的错误
    var errors = req.validationErrors();

    if (errors) {
        console.log(errors);
        return res.render('admin/posts/add', {
            errors: errors,
            // 将用户已填写的内容回退
            title: req.body.title,
            content: req.body.content,
        });
    }

    var title = req.body.title.trim();
    var category = req.body.category.trim();
    var content = req.body.content;


    // var post = new Post({
    //     title: title,
    //     category: category,
    //     content: content,
    //     slug: slug(title),
    //     author: 'admin',
    //     published: true,
    //     meta:{love:0},
    //     comments: [],
    //     created: new Date()
    // });
    // 以登录的用户作为发布作者
    User.findOne({}, function(err, author) {
        if (err) {
            return next(err);
        }
        var post = new Post({
            title: title,
            category: category,
            content: content,
            slug: slug(title),
            author: author,
            published: true,
            meta: { love: 0 },
            comments: [],
            created: new Date()
        });
        // 以上所new的post目前存在于内存当中，将post持久化保存入数据库：
        post.save(function(err, post) {
            if (err) {
                console.log(err);
                // req.flash('error','保存失败');
                res.redirect('/admin/posts/add');
            } else {
                // req.flash('info', '保存成功');
                res.redirect('/admin/posts');
            }
        });
    });
});
