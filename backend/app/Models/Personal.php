<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Personal extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'personais';

    protected $fillable = [
        'nome',
        'especialidade',
        'email',
        'telefone',
        'foto',
        'biografia',
        'ativo',
    ];

    protected $casts = [
        'ativo' => 'boolean',
    ];

    public function agendamentos()
    {
        return $this->hasMany(Agendamento::class);
    }
}

