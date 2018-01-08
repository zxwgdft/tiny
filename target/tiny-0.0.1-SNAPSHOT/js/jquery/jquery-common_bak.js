(function($) {
	
	// --------------------------------------
	// base
	// --------------------------------------

	$.extend({
		namespace2fn : function(name, fun) {
			if (name) {
				$.fn[name] = fun ? fun : function() {
					arguments.callee.$ = this;
					return arguments.callee;
				};
			}
			return this;
		},
		namespace2win : function() {
			var a = arguments, o = null, i, j, d;
			for (i = 0; i < a.length; i = i + 1) {
				d = a[i].split(".");
				o = window;
				for (j = (d[0] == "window") ? 1 : 0; j < d.length; j = j + 1) {
					o[d[j]] = o[d[j]] || {};
					o = o[d[j]];
				}
			}
			return o;
		},
		toJQuery : function(a) {
			if (a) {
				if (a instanceof jQuery)
					return a;
				if (typeof a === "string" || a instanceof Element)
					return $(a);
			}
			return null;
		},
		toJsonObject:function(a){
			return typeof a ==="string"?JSON.parse(a):a;	
		}
	});
	
	// --------------------------------------
	// constant
	// --------------------------------------

	
	$.namespace2win('tonto.constant');
	$.extend(tonto.constant,{
		response:{
			status:{			
				NO_LOGIN:-1,
				NO_PERMISSION:-2,
				SUCCESS:1,
				FAIL:2,
				ERROR:0
			}				
		}
	});
	
	$.extend({
		getRootPath : function() {
			if(!tonto.constant.rootPath)
			{
				var curWwwPath = window.document.location.href;
				var pathName = window.document.location.pathname;
				var pos = curWwwPath.indexOf(pathName);
				var localhostPath = curWwwPath.substring(0, pos);
				var projectName = pathName.substring(0, pathName.substr(1).indexOf(
						'/') + 1);
				tonto.constant.rootPath=localhostPath + projectName;
			}
			return tonto.constant.rootPath;
		},
		getRequestUrl(url){
			 return url.startsWith('http') ? url : $.getRootPath() + (url.startsWith('/') ? '' : '/') + url;
		}
	});

	// --------------------------------------
	// ajax
	// --------------------------------------
	$.extend({
		sendAjax: function(options){
			
			options.url = $.getRequestUrl(option.url);
			var callback = options.success;
            options.success = function(){

			}



			$.ajax(options);
			
		},
		getRequest : function(url, fun) {
			$.get($.getRequestUrl(url), function(data) {
					var jsonData=$.toJsonObject(data),s=jsonData.status;		
					var status=tonto.constant.response.status;
					
					if(status.NO_LOGIN===s)
					{
						$.alertLogin(function(){
							$.loadJsonContent(url, data, fun);						
						});
					}
					else if(status.NO_PERMISSION===s)
					{
						$.alertInfo(jsonData.message||"您没有权限访问该页面或执行该操作");
					}
					else if(status.ERROR===s)
					{
						$.alertError(jsonData.message||"访问页面或执行操作错误");
					}
					else
					{
						if (fun)
							fun(jsonData.result);
					}
				});
		},
		postRequest : function(url, data, fun) {
			$.ajax({
				type : "POST",
				url : $.getRequestUrl(url),
				data : data,
				success : function(data) {
					var jsonData=$.toJsonObject(data),s=jsonData.status;		
					var status=tonto.constant.response.status;
					
					if(status.NO_LOGIN===s)
					{
						$.alertLogin(function(){
							$.loadJsonContent(url, data, fun);						
						});
					}
					else if(status.NO_PERMISSION===s)
					{
						$.alertInfo(jsonData.message||"您没有权限访问该页面或执行该操作");
					}
					else if(status.ERROR===s)
					{
						$.alertError(jsonData.message||"访问页面或执行操作错误");
					}
					else
					{
						if (fun)
							fun(jsonData.result);
					}
				},
				error : function() {
					$content.html("加载数据错误！");
				}

			});
		}
	});
	$.fn.extend({
		loadContent : function(url, data, fun) {
			var $content = this;
			if(typeof data ==="function")
			{
				fun=data;
				data=null;
			}
			$.ajax({
				type : data?"POST":"GET",
				url : url,
				data : data,
				beforeSend : function() {
					$content.appendLoading();
				},
				success : function(data) {	
					try{						
						var json=typeof data ==="string"?JSON.parse(data):data,s=json.status;
						
						var status=tonto.constant.response.status;
						
						$content.html("");
						
						if(status.NO_LOGIN===s)
						{
							$.alertLogin(function(){
								$content.loadContent(url, data, fun);						
							});
						}
						else if(status.NO_PERMISSION===s)
						{
							$.alertInfo(json.message||"您没有权限访问该页面或执行该操作");
						}
						else if(status.ERROR===s)
						{
							$.alertError(json.message||"访问页面或执行操作错误");
						}
						else
						{
							$.alertInfo(json.msg);
						}
					}
					catch(error)
					{
						$content.html(data);
						if (fun)
							fun(data);
					}	
				},
				error : function() {
					$content.html("<div class='load-data-error'>加载数据错误！</div>");
				}

			});
		},
		loadJsonContent : function(url, data, fun) {
			var $content=$(this);
			$.ajax({
				type : "POST",
				url : url,
				data : data,
				beforeSend : function() {
					$content.appendLoading();
				},
				success : function(data) {
					var jsonData=$.toJsonObject(data),s=jsonData.status;		
					var status=tonto.constant.response.status;
					
					$content.html("");
					
					if(status.NO_LOGIN===s)
					{
						$.alertLogin(function(){
							$content.loadJsonContent(url, data, fun);						
						});
					}
					else if(status.NO_PERMISSION===s)
					{
						$.alertInfo(jsonData.message||"您没有权限访问该页面或执行该操作");
					}
					else if(status.ERROR===s)
					{
						$.alertError(jsonData.message||"访问页面或执行操作错误");
					}
					else
					{
						fun(jsonData);
					}
				},
				error : function() {
					$content.html("<div class='load-data-error'>加载数据错误！</div>");
				}

			});
		},
		formAjaxSubmit:function(successFun,failFun){
			var $form=$(this),fun=arguments.callee;
			$form.ajaxSubmit({
				beforeSubmit:function(){
					return $form.valid?$form.valid():true;
				},	
				success:function(response){
					var json = $.toJsonObject(response),s=json.status,status=tonto.constant.response.status;
					
					if(status.NO_LOGIN===s)
					{
						$.alertLogin(function(){
							$form.formAjaxSubmit(successFun,failFun);						
						});
					}
					else if(status.NO_PERMISSION===s)
					{
						$.alertInfo(json.message||"您没有权限访问该页面或执行该操作");
					}
					else if(status.ERROR===s)
					{
						$.alertError(json.message||"访问页面或执行操作错误");
					}
					else if(status.FAIL===s)
					{
						if(failFun)
						{
							failFun(json);
						}							
						else
						{
							$.alertError(json.message||"操作失败");
						}
					}
					else if(status.SUCCESS===s)
					{
						if(successFun)
							successFun(json);		
					}
				}
			});			
		},
		appendLoading : function() {
			this
					.html("<div align='center' style='line-height:100%;margin:20px'><img src='"
							+ $.getRootPath()
							+ "/image/load.gif'></div>");
		}
	});
	
	// --------------------------------------
	// login
	// --------------------------------------

	
	// --------------------------------------
	// alert
	// --------------------------------------
	
	
	
	$.extend({
				alertLogin: function(fun){
					var $modal = $("#tonto_alert_login");
					$modal = ($modal&&$modal.length > 0) ? $modal
							: $("<div class='modal fade' id='tonto_alert_login'>"+
									"<div class='modal-dialog'  style='width:500px'><div class='modal-content'>" +
									"<div class='modal-header'><h4 class='modal-title'>登录</h4>"+
									"</div><div class='modal-body'>" +
									"<form class='form-horizontal' id='loginForm' action='login' method='post' role='form'>" +
									"<div class='form-group'><label for='username' class='col-md-3 control-label'>用户名</label>" +
									"<div class='col-md-7'><div class='input-group'>" +
									"<input type='text' name='username' placeholder='请输入用户名' class='form-control required'> " +
									"<span class='input-group-addon'><span class='glyphicon glyphicon-user'></span></span></div></div></div>"+
									"<div class='form-group'><label for='password' class='col-md-3 control-label'>用户名</label>" +
									"<div class='col-md-7'><div class='input-group'>" +
									"<input type='password' name='password' placeholder='请输入密码' class='form-control required'> " +
									"<span class='input-group-addon'><span class='glyphicon glyphicon-lock'></span></span>" +
									"</div></div></div></form><div align='center'><button  id='login_btn' class='btn btn-primary btn-lg' "+
									"type='button'>登录</button></div></div></div></div></div>");
					
					$modal.modal({
						backdrop : "static",
						show : true,
						keyboard : false
					});
					
					$btn=$modal.find("#login_btn");
					
					var login=function(){
						var $form = $("#loginForm");
						$form.ajaxSubmit({
							beforeSubmit : function() {
								if($form.valid())
								{
									return true;
								}
								else
								{
									$btn.one("click",login);
									return false;
								}									
							},
							success : function(response) {
								response = $.toJsonObject(response);
								if (response && response.status == 1) {
									$modal.modal("hide");
									fun();
									return;
								} else {
									var msg = response && response.msg || "登录失败";
									$.alertError(msg);
									$btn.one("click",login);
									return;
								}
							},
							error :function(){
								$.alertError("服务器或网络异常");
								$btn.one("click",login);
							}
						});		
					}	
					
					$btn.one("click",login);
				},
				alertSuccess : function(msg,fun) {
					var $modal = $("#tonto_alert_success");
					$modal = ($modal&&$modal.length > 0) ? $modal
							: $("<div class='modal fade' id='tonto_alert_success'>"+
									"<div class='modal-dialog modal-alert'><div class='modal-content alert-container'>" +
									"<h3></h3><br><p><button type='button' class='btn btn-success' data-dismiss='modal'>确定</button></p>" +
									"</div></div></div>");
					$modal.find("h3").html("<img src='"+$.getRootPath()+"/image/success.png' class='alert-img'/>"+msg);
					$modal.modal({
						backdrop : "static",
						show : true,
						keyboard : false
					});
					
					if(fun&&fun instanceof Function)
						$modal.one("hide.bs.modal",fun);
				},
				alertInfo : function(msg,fun) {
					var $modal = $("#tonto_alert_info");
					$modal = ($modal&&$modal.length > 0) ? $modal
							: $("<div class='modal fade' id='tonto_alert_info'>"+
									"<div class='modal-dialog modal-alert'><div class='modal-content alert-container'>" +
									"<h3></h3><br><p><button type='button' class='btn btn-success' data-dismiss='modal'>确定</button></p>" +
									"</div></div></div>");
					$modal.find("h3").html("<img src='"+$.getRootPath()+"/image/info.png' class='alert-img'/>"+msg);
					$modal.modal({
						backdrop : "static",
						show : true,
						keyboard : false
					});
					
					if(fun&&fun instanceof Function)
						$modal.one("hide.bs.modal",fun);
				},
				alertError : function(msg,fun) {
					var $modal = $("#tonto_alert_error");
					$modal = ($modal&&$modal.length > 0) ? $modal
							: $("<div class='modal fade' id='tonto_alert_error'>"+
									"<div class='modal-dialog modal-alert'><div class='modal-content alert-container'>" +
									"<h3></h3><br><p><button type='button' class='btn btn-error' data-dismiss='modal'>确定</button></p>" +
									"</div></div></div>");
					$modal.find("h3").html("<img src='"+$.getRootPath()+"/image/error.png' class='alert-img'/>"+msg);
					$modal.modal({
						backdrop : "static",
						show : true,
						keyboard : false
					});
					
					if(fun&&fun instanceof Function)
						$modal.one("hide.bs.modal",fun);
				},
				alertConfirm : function(msg,fun){
					var $modal = $("#tonto_alert_confime");
					$modal = ($modal&&$modal.length > 0) ? $modal
							: $("<div class='modal fade' id='tonto_alert_error'>"+
									"<div class='modal-dialog modal-alert'><div class='modal-content alert-container'>" +
									"<h3>"+msg+"</h3><br>" +
									"<p></p>" +
									"</div></div></div>");
					$modal.find("h3").html(msg);
					$okbtn=$("<button type='button' class='btn btn-success' style='margin-right:10px' data-dismiss='modal'>确定</button>");
					$okbtn.one("click",function(){
						if(fun&&fun instanceof Function)
							fun(true);
					});
					$cancelbtn=$("<button type='button' class='btn btn-default' data-dismiss='modal'>取消</button>");
					$cancelbtn.one("click",function(){
						if(fun&&fun instanceof Function)
							fun(false);
					});
					
					$modal.find("p").append($okbtn).append($cancelbtn);
					$modal.modal({
						backdrop : "static",
						show : true,
						keyboard : false
					});	
				}
			});

	// --------------------------------------
	// 事件分发器
	// --------------------------------------

	$.namespace2win('tonto.event');

	var event_Dispatcher = function() {

	}

	event_Dispatcher.prototype.addEventListener = function(event, callback) {
		var map = this.listenerMap || (this.listenerMap = {});
		var listeners = map[event] || (map[event] = new Array());
		listeners.push(callback);
	}

	event_Dispatcher.prototype.distribute = function(event, data) {
		var map = this.listenerMap || (this.listenerMap = {});
		var listeners = map[event];
		if (listeners) {
			for ( var i = 0; i < listeners.length; i += 1) {
				listeners[i].call(this, data);
			}
		}
	}

	tonto.event.Dispatcher = event_Dispatcher;
	
	
	// --------------------------------------
	// Table
	// -------------------------------------- 
	
	

	/* options 参数配置基于bootstrp table，参考 http://bootstrap-table.wenzhixin.net.cn/zh-cn/documentation/
	 * 修改参数：
	 * 			url: 可以为方法，返回具体url字符串
	 *  				
	 */

	var _tonto_table = function(el, options) {
		
		var _self = this;

		if (!options.ajax) {
			options.ajax = function(request) {
				var url = request.url;
				if (typeof url === 'function') {
					url = url();
				}
				request.url = $.getRequestUrl(url);
				
				
				
				
			}
		}

		_selft.table = new BootstrapTable(el, options);

	}

	
	

})(jQuery);




