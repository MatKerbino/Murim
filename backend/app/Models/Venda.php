<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Venda extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'vendas';

    protected $fillable = [
        'aluno_id',
        'valor_total',
        'status',
        'metodo_pagamento',
        'codigo_transacao',
        'observacoes',
    ];

    protected $casts = [
        'valor_total' => 'decimal:2',
    ];

    public function aluno()
    {
        return $this->belongsTo(Aluno::class);
    }

    public function itens()
    {
        return $this->hasMany(ItemVenda::class);
    }
}

