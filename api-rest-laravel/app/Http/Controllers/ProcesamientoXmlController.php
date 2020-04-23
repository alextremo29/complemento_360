<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Tipo_archivo;
use App\Informacion_archivo;

class ProcesamientoXmlController extends Controller
{
    public $wsdl;
    public $url;
    function __construct()
    {
    	$this->wsdl = "http://test.analitica.com.co/AZDigital_Pruebas/WebServices/ServiciosAZDigital.wsdl";
    	$this->url = "http://test.analitica.com.co/AZDigital_Pruebas/WebServices/SOAP/index.php";
    }
    public function consumirBuscarArchivo()
    {
    	$sentencias = array();
    	$params = array(
			"Condiciones" =>[
				"Condicion" => [
					"Tipo" => "FechaInicial",
					"Expresion" => "2019-07-01 00:00:00"
				]
			]
		);

		try {
			$client = new \SoapClient($this->wsdl);
			$client->__setLocation($this->url);
			$result = $client->BuscarArchivo($params);
			$result = get_object_vars($result);
			
			foreach ($result["Archivo"] as $value) {
				$array_archivo = explode('.',$value->Nombre);
				$nombre = preg_replace('([^A-Za-z0-9\-\_])', '', $array_archivo[0]);
				$tipo_archivo = count($array_archivo)== 1 ? 1: $this->validaTipoArchivo(end($array_archivo));
				$informacion_archivo = new Informacion_archivo();
				$informacion_archivo->id=$value->Id;
				$informacion_archivo->nombre = $nombre;
				$informacion_archivo->tipo_archivo_id = $tipo_archivo;
				$informacion_archivo->save();
				$sentencias[]="insert into informacion_archivo (nombre, tipo_archivo_id) values ('$nombre',$tipo_archivo);";
			}
			$data = array(
				'code' => 200,
				'status' => 'success',
				'sentencias' => $sentencias
			);
		} catch (SoapFault $e) {
			$data =array(
				'code' => 400,
				'status' => "Bad Request",
				'error' => $e->getMessage()
			);
		}
		return response()->json($data, $data["code"]);
    }
    public function validaTipoArchivo($extencion)
    {
    	$tipo_archivo = Tipo_archivo::where('nombre',$extencion)->first();
    	if (!empty($tipo_archivo) && is_object($tipo_archivo)) {
    		return $tipo_archivo->id;
    	} else{
    		$tipo_archivo = new Tipo_archivo();
    		$tipo_archivo->nombre = $extencion;
    		$tipo_archivo->save();
    		return $tipo_archivo->id;
    	}
    }
    public function getInformacion()
    {
    	$informacion_archivo = Informacion_archivo::all();
    	foreach ($informacion_archivo as $archivo) {
    		$tipo_archivo = $archivo->tipo_archivo->nombre;
    		$data["data"][]=array(
    			"id" => $archivo->id,
    			"nombre" => $archivo->nombre,
    			"tipo_archivo" => $archivo->tipo_archivo->nombre
    		);
    	}
    	return response()->json($data, 200);
    }
    public function getTotalPorTipo()
    {
    	$tipo_archivo = \DB::table('tipo_archivo as t')
    						->join('informacion_archivo as i','i.tipo_archivo_id','=','t.id')
    						->select(\DB::raw('count(*) as total, t.nombre as nombre'))
    						->groupBy('t.nombre')
    						->orderBy('total','desc')
    						->get();
    	$data["data"] = $tipo_archivo;
    	return response()->json($data, 200);
    }
}
