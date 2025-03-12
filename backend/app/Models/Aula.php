<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Aula extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'aulas';

    protected $fillable = [
        'nome',
        'descricao',
        'dia_semana_id',
        'horario_inicio',
        'horario_fim',
        'instrutor',
        'capacidade_maxima',
        'ativa',
    ];

    protected $casts = [
        'capacidade_maxima' => 'integer',
        'ativa' => 'boolean',
    ];

    public function diaSemana()
    {
        return $this->belongsTo(DiaSemana::class, 'dia_semana_id');
    }
}

