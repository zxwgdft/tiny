<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
request.setAttribute("path", path);
%>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<link href="${path}/js/bootstrap/css/bootstrap.min.css" rel="stylesheet">
<link href="${path}/js/bootstrap/css/bootstrap-table.min.css" rel="stylesheet">
<link href="${path}/js/bootstrap/css/messenger.css" rel="stylesheet">
<link href="${path}/js/bootstrap/css/messenger-theme-future.css" rel="stylesheet">
<script src="${path}/js/jquery/jquery.min.js"></script>
<script src="${path}/js/bootstrap/js/bootstrap.js"></script>
<script src="${path}/js/bootstrap/js/messenger.js"></script>
<script src="${path}/js/bootstrap/js/messenger-theme-future.js"></script>
<script src="${path}/js/bootstrap/js/bootstrap-table.js"></script>
<script src="${path}/js/bootstrap/js/locale/bootstrap-table-zh-CN.min.js"></script>
<script src="${path}/js/jquery/jquery-common.js"></script>
