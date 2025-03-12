<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Dica extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'dicas';

    protected $fillable = [
        'titulo',
        'slug',
        'descricao',
        'conteudo',
        'categoria_id',
        'autor',
        'imagem',
        'publicado',
    ];

    protected $casts = [
        'publicado' => 'boolean',
    ];

    public function categoria()
    {
        return $this->belongsTo(CategoriaDica::class, 'categoria_id');
    }
}

