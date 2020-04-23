$(function() {
	$('.select2').select2();
    getCustomers();
});
function getCustomers() {
	var option="<option value=''></option>";
	$('#customer').select2('destroy');
	$.ajax({
		url:'../api-rest-laravel/public/api/customer',
		method: "GET",
	}).done(function(resp) {
		for (var i = 0; i < resp.customers.length; i++) {
			option+="<option value = '"+resp.customers[i].customer_id+"'>"+resp.customers[i].name+"</option>";
		}
		$("#customer").html(option);
		$("#customer").select2();
	}).fail(function(err) {
		console.log('error',err)
	})
}
function getOrders() {
	$("#respuesta").html('<center><h2>Please wait<br><i class="fas fa-spinner fa-spin"></i></h2></center>')
	$("#OrdersTable").find('tbody').html("");
	var json = {
		"customer_id":$("#customer").val(),
		"init_date":$("#init_date").val(),
		"final_date":$("#final_date").val()
	}
	// console.log(json)
	$.post('../api-rest-laravel/public/api/order/customer',json).done(function(resp) {
		console.log(resp);
		var row="";
		jQuery.each(resp.orders, function(i, val) {
			var products = "";
			for (var i = 0; i < val.order_details.length; i++) {
				products+= val.order_details[i].quantity+" X " + val.order_details[i].product_description+"<br>";
			}
			row+="<tr><td>"+val.creation_date+"</td><td>"+val.order_id+"</td><td>"+val.total+"</td><td>"+val.delivery_address+"</td><td>"+products+"</td></tr>"
			$("#OrdersTable").find('tbody').append(row);
		});
		$("#respuesta").html('')
	}).fail(function(err) {
		respError = err.responseJSON;
		console.log(respError);
		var htmlError = '<br><div class="alert alert-danger" role="alert">Data Invalid</div>';
		$("#respuesta").html(htmlError);
	})
}