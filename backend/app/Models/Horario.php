<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Horario extends Model
{
    use HasFactory;

    protected $fillable = [
        'dia_semana_id',
        'hora_inicio',
        'hora_fim',
        'tipo_aula',
    ];

    public function diaSemana()
    {
        return $this->belongsTo(DiaSemana::class);
    }
}

