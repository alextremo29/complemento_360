<?php
// Modelo de la tabla tipo_archivo donde se almacen las direntes extenciones de los archivos 
namespace App;

use Illuminate\Database\Eloquent\Model;

class Tipo_archivo extends Model
{
    protected $table = "tipo_archivo";

    public function informacion_archivos()
    {
    	return $this->hasMany('App\Informacion_archivo');
    }
}
