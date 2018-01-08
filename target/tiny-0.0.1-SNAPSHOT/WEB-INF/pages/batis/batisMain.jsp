<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>Batis监控</title>

<jsp:include page="../head.jsp"></jsp:include>

<script type="text/javascript">
	
		$(function(){	
		
			var table = $.createTable("#main", {
				url:"batis/statement",
				queryParams :function(params){
					params.aaa = "test";
					return params;
				},
				pagination:true,
				method:"post",
				columns:[
					{
		                field: 'id',
		                title: 'ID'
		            }, {
		                field: 'sqlCommandType',
		                title: '类型'
		            }, {
		                field: 'sql',
		                title: 'SQL'
		            }
				]
			
			});	
		});
	</script>

</head>

<body>
	<div id='main'></div>
	
	<form action="http://localhost/tiny/batis/statement" method="post">
		<input type="text" name="limit" value="10">
		<input type="text" name="page" value="1">
		<input type="submit" value="确认">
	</form>
	
</body>
</html>
