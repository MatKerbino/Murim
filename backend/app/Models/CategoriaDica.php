<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoriaDica extends Model
{
    use HasFactory;

    protected $table = 'categorias_dicas';

    protected $fillable = [
        'nome',
        'slug',
        'descricao',
    ];

    public function dicas()
    {
        return $this->hasMany(Dica::class, 'categoria_id');
    }
}

