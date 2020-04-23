<?php

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
