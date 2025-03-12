<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Aluno extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'alunos';

    protected $fillable = [
        'nome',
        'email',
        'telefone',
        'data_nascimento',
        'matricula',
        'plano_id',
        'data_inicio',
        'data_fim',
        'status',
        'observacoes',
    ];

    protected $casts = [
        'data_nascimento' => 'date',
        'data_inicio' => 'date',
        'data_fim' => 'date',
    ];

    public function plano()
    {
        return $this->belongsTo(Plano::class);
    }

    public function pagamentos()
    {
        return $this->hasMany(Pagamento::class);
    }

    public function agendamentos()
    {
        return $this->hasMany(Agendamento::class);
    }

    public function vendas()
    {
        return $this->hasMany(Venda::class);
    }
}

