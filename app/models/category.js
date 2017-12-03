/*
 * @Author: beyondouyuan
 * @Date:   2017-03-06 15:40:34
 * @Last Modified by:   beyondouyuan
 * @Last Modified time: 2017-03-06 17:44:00
 */

// 'use strict';

// 为分类数据建模
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CategorySchema = new Schema({
    // 标题
    name: { type: String, required: true },
    // 内容
    // 链接
    slug: { type: String, required: true },
    // 创建日期
    created: { type: Date }
});

mongoose.model('Category', CategorySchema);
