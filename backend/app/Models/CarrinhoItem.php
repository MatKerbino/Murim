<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CarrinhoItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'produto_id',
        'quantidade',
    ];

    /**
     * Relacionamento com o usuário
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relacionamento com o produto
     */
    public function produto(): BelongsTo
    {
        return $this->belongsTo(Produto::class);
    }
}

