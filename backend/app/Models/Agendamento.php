<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Agendamento extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'agendamentos';

    protected $fillable = [
        'aluno_id',
        'personal_id',
        'data',
        'horario',
        'status',
        'observacoes',
    ];

    protected $casts = [
        'data' => 'date',
    ];

    public function aluno()
    {
        return $this->belongsTo(Aluno::class);
    }

    public function personal()
    {
        return $this->belongsTo(Personal::class);
    }
}

