<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CategoriaDicaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'data' => [
                [
                    'id' => 1,
                    'nome' => 'Desempenho',
                    'slug' => 'desempenho',
                    'descricao' => 'Dicas para melhorar seu desempenho nos treinos',
                    'created_at' => '2024-03-01T10:00:00.000000Z'
                ],
                [
                    'id' => 2,
                    'nome' => 'Nutrição',
                    'slug' => 'nutricao',
                    'descricao' => 'Dicas sobre alimentação e suplementação',
                    'created_at' => '2024-03-01T10:05:00.000000Z'
                ],
                [
                    'id' => 3,
                    'nome' => 'Vestuário',
                    'slug' => 'vestuario',
                    'descricao' => 'Dicas sobre roupas e acessórios para treino',
                    'created_at' => '2024-03-01T10:10:00.000000Z'
                ]
            ]
        ]);
    }
} 