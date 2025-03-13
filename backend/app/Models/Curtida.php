<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Curtida extends Model
{
    use HasFactory;

    protected $table = 'curtidas';

    protected $fillable = [
        'dica_id',
        'user_id',
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

