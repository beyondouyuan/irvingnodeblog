/*
 * @Author: beyondouyuan
 * @Date:   2017-03-06 15:27:24
 * @Last Modified by:   beyondouyuan
 * @Last Modified time: 2017-03-06 16:40:57
 */

// 'use strict';
// 为博文数据建模
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PostSchema = new Schema({
    // 标题
    title: { type: String, required: true },
    // 内容
    content: { type: String, required: true },
    // 链接
    slug: { type: String, required: true },
    // 分类
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    // 作者
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    // default默认为未发布状态
    published: { type: Boolean, default: false },
    // 赞、踩、阅读量为混合类型
    meta: { type: Schema.Types.Mixed },
    // 评论为数据，每一条评论为一个混合类型
    comments: [Schema.Types.Mixed],
    // 创建日期
    created: { type: Date }
});
// 屏蔽系统自动分配的虚拟数据
// PostSchema.virtual('date')
//   .get(function(){
//     return this._id.getTimestamp();
//   });

mongoose.model('Post', PostSchema);
