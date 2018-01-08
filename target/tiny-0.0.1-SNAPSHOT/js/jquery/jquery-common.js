(function ($) {

    // --------------------------------------
    // base
    // --------------------------------------

    $.extend({
        namespace2fn: function (name, fun) {
            if (name) {
                $.fn[name] = fun ? fun : function () {
                    arguments.callee.$ = this;
                    return arguments.callee;
                };
            }
            return this;
        },
        namespace2win: function () {
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
        }
    });

    // --------------------------------------
    // constant
    // --------------------------------------


    $.namespace2win('tonto.constant');
    $.extend(tonto.constant, {
        response: {
            status: {
                NO_LOGIN: -1,
                NO_PERMISSION: -2,
                SUCCESS: 1,
                FAIL: 2,
                ERROR: 0
            }
        }
    });

    $.extend({
        getRootPath: function () {
            if (!tonto.constant.rootPath) {
                var curWwwPath = window.document.location.href;
                var pathName = window.document.location.pathname;
                var pos = curWwwPath.indexOf(pathName);
                var localhostPath = curWwwPath.substring(0, pos);
                var projectName = pathName.substring(0, pathName.substr(1).indexOf(
                        '/') + 1);
                tonto.constant.rootPath = localhostPath + projectName;
            }
            return tonto.constant.rootPath;
        },
        getRequestUrl(url){
            return url.startsWith('http') ? url : $.getRootPath() + (url.startsWith('/') ? '' : '/') + url;
        }
    });

    // --------------------------------------
    // messager
    // --------------------------------------

    /* options 参数配置基于Messager，参考 http://github.hubspot.com/messenger/
     *
     */

    $.extend({
        infoMessage: function (message, type) {
            Messenger().post({
                message: message,
                showCloseButton: true,
                type: type || 'info'
            });
        },
        confirmMessage: function (message, type) {
            Messenger().post({
                message: message,
                hideAfter: false,
                showCloseButton: true,
                type: type || 'info'
            });
        }


    })


    // --------------------------------------
    // ajax
    // --------------------------------------
    $.extend({
        sendAjax: function (options) {

            options.url = $.getRequestUrl(options.url);
            var callback = options.success;
            options.success = function (response) {
                if (typeof response === 'string')
                    response = JSON.parse(response)
                var resStatus = response.status, status = tonto.constant.response.status;

                if (status.NO_LOGIN === resStatus) {
                    $.infoMessage("请先登录")
                }
                else if (status.NO_PERMISSION === resStatus) {
                    $.infoMessage(response.message || "您没有权限访问该页面或执行该操作", 'error');
                }
                else if (status.ERROR === resStatus) {
                    $.infoMessage(response.message || "访问页面或执行操作错误", 'error');
                }
                else {
                    if (callback)
                        callback(response.result);
                }
            }

            $.ajax(options);

        },
        getRequest: function (url, fun) {

        },
        postRequest: function (url, data, fun) {

        }
    });

    // --------------------------------------
    // login
    // --------------------------------------


    // --------------------------------------
    // alert
    // --------------------------------------


    // $.extend({
    // 			alertLogin: function(fun){
    // 				var $modal = $("#tonto_alert_login");
    // 				$modal = ($modal&&$modal.length > 0) ? $modal
    // 						: $("<div class='modal fade' id='tonto_alert_login'>"+
    // 								"<div class='modal-dialog'  style='width:500px'><div class='modal-content'>" +
    // 								"<div class='modal-header'><h4 class='modal-title'>登录</h4>"+
    // 								"</div><div class='modal-body'>" +
    // 								"<form class='form-horizontal' id='loginForm' action='login' method='post' role='form'>" +
    // 								"<div class='form-group'><label for='username' class='col-md-3 control-label'>用户名</label>" +
    // 								"<div class='col-md-7'><div class='input-group'>" +
    // 								"<input type='text' name='username' placeholder='请输入用户名' class='form-control required'> " +
    // 								"<span class='input-group-addon'><span class='glyphicon glyphicon-user'></span></span></div></div></div>"+
    // 								"<div class='form-group'><label for='password' class='col-md-3 control-label'>用户名</label>" +
    // 								"<div class='col-md-7'><div class='input-group'>" +
    // 								"<input type='password' name='password' placeholder='请输入密码' class='form-control required'> " +
    // 								"<span class='input-group-addon'><span class='glyphicon glyphicon-lock'></span></span>" +
    // 								"</div></div></div></form><div align='center'><button  id='login_btn' class='btn btn-primary btn-lg' "+
    // 								"type='button'>登录</button></div></div></div></div></div>");
    //
    // 				$modal.modal({
    // 					backdrop : "static",
    // 					show : true,
    // 					keyboard : false
    // 				});
    //
    // 				$btn=$modal.find("#login_btn");
    //
    // 				var login=function(){
    // 					var $form = $("#loginForm");
    // 					$form.ajaxSubmit({
    // 						beforeSubmit : function() {
    // 							if($form.valid())
    // 							{
    // 								return true;
    // 							}
    // 							else
    // 							{
    // 								$btn.one("click",login);
    // 								return false;
    // 							}
    // 						},
    // 						success : function(response) {
    // 							response = $.toJsonObject(response);
    // 							if (response && response.status == 1) {
    // 								$modal.modal("hide");
    // 								fun();
    // 								return;
    // 							} else {
    // 								var msg = response && response.msg || "登录失败";
    // 								$.alertError(msg);
    // 								$btn.one("click",login);
    // 								return;
    // 							}
    // 						},
    // 						error :function(){
    // 							$.alertError("服务器或网络异常");
    // 							$btn.one("click",login);
    // 						}
    // 					});
    // 				}
    //
    // 				$btn.one("click",login);
    // 			}
    // 		});

    // --------------------------------------
    // 事件分发器
    // --------------------------------------

    $.namespace2win('tonto.event');

    var event_Dispatcher = function () {

    }

    event_Dispatcher.prototype.addEventListener = function (event, callback) {
        var map = this.listenerMap || (this.listenerMap = {});
        var listeners = map[event] || (map[event] = new Array());
        listeners.push(callback);
    }

    event_Dispatcher.prototype.distribute = function (event, data) {
        var map = this.listenerMap || (this.listenerMap = {});
        var listeners = map[event];
        if (listeners) {
            for (var i = 0; i < listeners.length; i += 1) {
                listeners[i].call(this, data);
            }
        }
    }

    tonto.event.Dispatcher = event_Dispatcher;


    // --------------------------------------
    // Table
    // --------------------------------------

    $.namespace2win('tonto');

    /* options 参数配置基于bootstrp table，参考 http://bootstrap-table.wenzhixin.net.cn/zh-cn/documentation/
     * 修改参数：
     * 			url: 可以为方法，返回具体url字符串
     *
     */

    var _tonto_table = function (el, options) {

        var defaultOptions = $.fn.bootstrapTable.defaults;
        var constructor = $.fn.bootstrapTable.Constructor;

        if (typeof options === 'string')
            options = {url: options};

        if (!options.ajax) {
            options.ajax = function (request) {
                if (typeof url === 'function') request.url = request.url();
                $.sendAjax(request);
            }
        }

        var selfOptions = {
            sidePagination : 'server',
            dataField : 'dataList',
            totalField : 'totalCount',
            pageList : [10,20,40],
            pageSize : 20
        }


        return new constructor(el, $.extend(defaultOptions,selfOptions, options));
    };

    $.extend({
        createTable: function (el, options) {

            var tables = [];
            $(el).each(function (index) {
                tables[index] = new _tonto_table($(this), options);
            });

            if (tables.length == 1)
                return tables[0];
            return tables;
        }
    });

    $.fn.createTable = function () {

        var tables = [];

        this.each(function (index) {
            tables[index] = new _tonto_table($(this), options);
        });

        if (tables.length == 1)
            return tables[0];
        return tables;
    };

})(jQuery);




