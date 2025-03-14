<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Assinatura extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'plano_id',
        'data_inicio',
        'data_fim',
        'ativa',
        'valor_pago',
        'status_pagamento',
    ];

    protected $casts = [
        'data_inicio' => 'date',
        'data_fim' => 'date',
        'ativa' => 'boolean',
        'valor_pago' => 'decimal:2',
    ];

    /**
     * Relacionamento com o usuário
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relacionamento com o plano
     */
    public function plano(): BelongsTo
    {
        return $this->belongsTo(Plano::class);
    }
}

