<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Informacion_archivo extends Model
{
    protected $table = "informacion_archivo";

    public function tipo_archivo()
    {
    	return $this->belongsTo('App\Tipo_archivo','tipo_archivo_id');
    }
}
