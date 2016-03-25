/**
  文件上传美化插件
  2013-10-12 Devotion Created
  **/
  (function ($) {
	  var defaultSettings = {
	  	  divMargin:25,  //增加的div的margin,使得div居中
		  width: 179,    //宽度
		  height: 179,    //高度
		  uploadStyle: "btn",//btn , img , htm 默认btn
		  content: "上 传",     /*当uploadStyle为以下状态时需输入的内容
							 btn:按钮文本； 
							 htm:自定义按钮html 
							 img:图片地址*/
		 fontSize: 20  //按钮文本字体大小 [当uploadStyle为btn时有效]
	 };
  
	 $.fn.UploadBeautify = function (settings) {
		 settings = $.extend({}, defaultSettings, settings || {});
 
		 return this.each(function () {
			 var elem = $(this);
			 var html = [];
			 html.push('<div style="width:' + settings.width + 'px;height:' + settings.height + 'px;background:#333;border-radius:25px;position:relative;overflow:hidden;text-decoration:none;margin:' + (settings.divMargin-25) + 'px auto;">');
			 // html.push('<span>');
			 switch (settings.uploadStyle) {
				 case "img":
					 html.push('<img id="img_'+settings.uploadNum+'" src="' + settings.content + '" style="width:' + (settings.width-20) + 'px;height:' + (settings.height-26) + 'px;margin:10px auto;"/>');
					 break;
			 }
			 // html.push('</span>');
			 html.push('</div>');
 
			 var jqHtml = $(html.join(''));
			 elem.css({
				 "height": settings.height + "px",
				 "font-size": "400px",
				 "position": "absolute",
				 "cursor": "pointer",
				 "top": 0,
				 "right": 0,
				 "filter": "alpha(opacity=0)", //适配IE
				 "-moz-opacity": 0,            //适配火狐
				 "opacity": 0,
				 "z-index": 2
			 });
 
			 var elemParent = elem.parent();
			 elemParent.append(jqHtml);
			 jqHtml.append(elem);             //给this添加样式
		 });
	 };
 })(jQuery);