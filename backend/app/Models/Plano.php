<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Plano extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'planos';

    protected $fillable = [
        'nome',
        'descricao',
        'valor',
        'duracao',
        'beneficios',
    ];

    protected $casts = [
        'valor' => 'decimal:2',
        'duracao' => 'integer',
        'beneficios' => 'array',
    ];

    public function alunos()
    {
        return $this->hasMany(Aluno::class);
    }

    public function pagamentos()
    {
        return $this->hasMany(Pagamento::class);
    }
}

