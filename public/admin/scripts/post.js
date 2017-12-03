/*
* @Author: beyondouyuan
* @Date:   2017-03-18 12:23:20
* @Last Modified by:   beyondouyuan
* @Last Modified time: 2017-03-18 23:23:15
*/

'use strict';

$(function() {
	// 富文本编辑器
	CKEDITOR.replace('js-post-content', {
		width: '100%',
		height: '30rem',
		// uiColor: '#14B8C4'
	});

	// 校验
	$("#add-post-form").validate();
});
