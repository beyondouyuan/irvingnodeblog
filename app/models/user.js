/*
* @Author: beyondouyuan
* @Date:   2017-03-06 15:43:22
* @Last Modified by:   beyondouyuan
* @Last Modified time: 2017-03-06 15:45:11
*/

// 'use strict';

// 为用户数据建模
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    // 用户名
    name: { type: String, required: true },
    // 邮箱
    email: { type: String, required: true },
    // 密码
    password: { type: String, required: true },
    // 创建日期
    created: { type: Date }
});

mongoose.model('User', UserSchema);
