<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DicaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Since we don't have actual database models yet, return mock data
        return response()->json([
            'data' => [
                [
                    'id' => 1,
                    'titulo' => 'Dica de Treino',
                    'descricao' => 'Como melhorar seu desempenho',
                    'conteudo' => 'Mantenha a consistência nos treinos para ver resultados.',
                    'autor' => 'Treinador Silva',
                    'categoria' => [
                        'id' => 1,
                        'nome' => 'Desempenho',
                        'slug' => 'desempenho'
                    ],
                    'created_at' => '2024-03-01T12:00:00.000000Z'
                ],
                [
                    'id' => 2,
                    'titulo' => 'Alimentação Pré-treino',
                    'descricao' => 'O que comer antes do treino',
                    'conteudo' => 'Consuma carboidratos de digestão rápida 30 minutos antes do treino.',
                    'autor' => 'Nutricionista Oliveira',
                    'categoria' => [
                        'id' => 2,
                        'nome' => 'Nutrição',
                        'slug' => 'nutricao'
                    ],
                    'created_at' => '2024-03-02T14:30:00.000000Z'
                ],
                [
                    'id' => 3,
                    'titulo' => 'Escolha do calçado',
                    'descricao' => 'Como escolher o tênis ideal',
                    'conteudo' => 'Escolha tênis específicos para o tipo de treino que você realiza.',
                    'autor' => 'Especialista em Vestuário',
                    'categoria' => [
                        'id' => 3,
                        'nome' => 'Vestuário',
                        'slug' => 'vestuario'
                    ],
                    'created_at' => '2024-03-03T09:15:00.000000Z'
                ],
            ]
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Mock data for a single dica
        $dicas = [
            1 => [
                'id' => 1,
                'titulo' => 'Dica de Treino',
                'descricao' => 'Como melhorar seu desempenho',
                'conteudo' => 'Mantenha a consistência nos treinos para ver resultados.',
                'autor' => 'Treinador Silva',
                'categoria' => [
                    'id' => 1,
                    'nome' => 'Desempenho',
                    'slug' => 'desempenho'
                ],
                'created_at' => '2024-03-01T12:00:00.000000Z'
            ],
            2 => [
                'id' => 2,
                'titulo' => 'Alimentação Pré-treino',
                'descricao' => 'O que comer antes do treino',
                'conteudo' => 'Consuma carboidratos de digestão rápida 30 minutos antes do treino.',
                'autor' => 'Nutricionista Oliveira',
                'categoria' => [
                    'id' => 2,
                    'nome' => 'Nutrição',
                    'slug' => 'nutricao'
                ],
                'created_at' => '2024-03-02T14:30:00.000000Z'
            ],
            3 => [
                'id' => 3,
                'titulo' => 'Escolha do calçado',
                'descricao' => 'Como escolher o tênis ideal',
                'conteudo' => 'Escolha tênis específicos para o tipo de treino que você realiza.',
                'autor' => 'Especialista em Vestuário',
                'categoria' => [
                    'id' => 3,
                    'nome' => 'Vestuário',
                    'slug' => 'vestuario'
                ],
                'created_at' => '2024-03-03T09:15:00.000000Z'
            ],
        ];

        if (!isset($dicas[$id])) {
            return response()->json(['message' => 'Dica não encontrada'], 404);
        }

        return response()->json(['data' => $dicas[$id]]);
    }
} 