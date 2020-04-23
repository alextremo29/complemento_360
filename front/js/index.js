function consumir_servicio() {
	console.log("entro");
	var sentenciasText = "";
	$("#divSentencias").show();
	$("#setencias").html('<center><h3>Por favor espere<br><i class="fas fa-spinner fa-spin"></i></h3></center>')
	$.post('http://api-complemento-360.com.devel/api/BuscarArchivo').done(function(resp) {
		console.log(resp.sentencias);
		for (var i = 0; i < resp.sentencias.length; i++) {
			sentenciasText +=resp.sentencias[i]+"<br>";
		}
		$("#setencias").html(sentenciasText);
		$("#informes").show();
	}).fail(function(err) {
		console.log(err);
		respError = err.responseJSON;
		console.log(respError);
		var htmlError = '<br><div class="alert alert-danger" role="alert">Error al consumir el servicio</div>';
		$("#setencias").html(htmlError);
	})
}
function generar_informe1() {
	$("#summaryTable").find('tbody').html('<tr><td colspan=3><center><h3>Por favor espere<br><i class="fas fa-spinner fa-spin"></i></h3></center></td></tr>');
	var thead ="<tr><th>Id</th><th>Nombre</th><th>Tipo de archivo</th></tr>";
	$("#summaryTable").find('thead').html(thead);
	$.post('http://api-complemento-360.com.devel/api/informacion_archivo').done(function(resp) {
		$("#summaryTable").find('tbody').html('');
		for (var i = 0; i < resp.data.length; i++) {
			var row = '<tr><td>'+resp.data[i].id+'</td><td>'+resp.data[i].nombre+'</td><td>'+resp.data[i].tipo_archivo+'</td></tr>'
			$("#summaryTable").find('tbody').append(row);
		}
	}).fail(function(err) {
		console.log(err);
		respError = err.responseJSON;
		console.log(respError);
		var htmlError = '<br><div class="alert alert-danger" role="alert">Error al consumir el servicio</div>';
		$("#error").html(htmlError);	
	})
}
function generar_informe2() {
	$("#summaryTable").find('tbody').html('<tr><td colspan=3><center><h3>Por favor espere<br><i class="fas fa-spinner fa-spin"></i></h3></center></td></tr>');
	var thead ="<tr><th>Tipo de archivo</th><th>Total</th></tr>";
	$("#summaryTable").find('thead').html(thead);
	$.post('http://api-complemento-360.com.devel/api/cantidad_archivos').done(function(resp) {
		$("#summaryTable").find('tbody').html('');
		for (var i = 0; i < resp.data.length; i++) {
			var row = '<tr><td>'+resp.data[i].nombre+'</td><td>'+resp.data[i].total+'</td></tr>'
			$("#summaryTable").find('tbody').append(row);
		}
	}).fail(function(err) {
		console.log(err);
		respError = err.responseJSON;
		console.log(respError);
		var htmlError = '<br><div class="alert alert-danger" role="alert">Error al consumir el servicio</div>';
		$("#error").html(htmlError);	
	})
}