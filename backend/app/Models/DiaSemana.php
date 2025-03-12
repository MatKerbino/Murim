<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiaSemana extends Model
{
    use HasFactory;

    protected $table = 'dias_semana';

    protected $fillable = [
        'nome',
        'ordem',
    ];

    public function aulas()
    {
        return $this->hasMany(Aula::class, 'dia_semana_id');
    }
}

