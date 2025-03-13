<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Comentario extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'comentarios';

    protected $fillable = [
        'dica_id',
        'user_id',
        'conteudo',
        'aprovado',
    ];

    protected $casts = [
        'aprovado' => 'boolean',
    ];

    public function dica()
    {
        return $this->belongsTo(Dica::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

