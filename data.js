/*
 * @Author: beyondouyuan
 * @Date:   2017-03-06 17:54:05
 * @Last Modified by:   beyondouyuan
 * @Last Modified time: 2017-03-11 23:38:09
 */

// 'use strict';
// data.js用于随机插入大量文章测试数据
var loremipsum = require('lorem-ipsum'),
    slug = require('slug'),
    config = require('./config/config'),
    glob = require('glob'),
    mongoose = require('mongoose');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function() {
    throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function(model) {
    require(model);
});

// 获取到需要随机生成数据的原有数据建模
var Post = mongoose.model('Post');
var User = mongoose.model('User');
var Category = mongoose.model('Category');

// 查找一条user数据

User.findOne(function(err, user) {
    if (err) {
        return console.log('未找到用户');
    }

    // 找出所有分类，在每个分类下随机茶壶如30骗文章

    Category.find(function(err, categorys) {
        if (err) {
            return console.log('未找到分类');
        }
        // 遍历分类
        categorys.forEach(function(category) {
        	// 每个分类下插入35条文章的测试数据
        	for(var i = 0; i < 50; i++) {
	            // 标题随机生成一句话
	            var title = loremipsum({ count: 1, units: 'sentence' });
	            var post = new Post({
	                title: title,
	                slug: slug(title),
	                // 内容为随机的三十句话
	                content: loremipsum({ count: 30, units: 'sentence' }),
	                category: category,
	                author: user,
                    published: true,
	                meta: { love: 0},
	                comments: [],
	                created: new Date
	            });
	            // 保存生成的文章
	            post.save(function(err, post) {
	            	console.log('save post: ' + post.slug);
	            });
        	}
        });
    });
});
