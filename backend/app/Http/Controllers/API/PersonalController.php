<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Personal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class PersonalController extends Controller 
{
    public function index()
    {
        try {
            // For testing purposes, let's create a mock response
            $personais = [
                [
                    'id' => 1,
                    'nome' => 'João Silva',
                    'especialidade' => 'Musculação',
                    'email' => 'joao@example.com',
                    'telefone' => '(11) 99999-1111',
                    'foto' => null,
                    'biografia' => 'Especialista em musculação com 10 anos de experiência.',
                    'ativo' => true,
                    'created_at' => '2024-01-01T10:00:00.000000Z',
                    'updated_at' => '2024-01-01T10:00:00.000000Z'
                ],
                [
                    'id' => 2,
                    'nome' => 'Maria Souza',
                    'especialidade' => 'Pilates',
                    'email' => 'maria@example.com',
                    'telefone' => '(11) 99999-2222',
                    'foto' => null,
                    'biografia' => 'Instrutora de pilates certificada com formação internacional.',
                    'ativo' => true,
                    'created_at' => '2024-01-02T10:00:00.000000Z',
                    'updated_at' => '2024-01-02T10:00:00.000000Z'
                ]
            ];

            // Log the response for debugging
            \Log::info('Returning personais data:', ['data' => $personais]);
            
            return response()->json([
                'status' => 'success',
                'data' => $personais
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in PersonalController@index: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Erro ao buscar personais: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show(string $id)
    {
        try {
            // Mock data for testing
            $personais = [
                1 => [
                    'id' => 1,
                    'nome' => 'João Silva',
                    'especialidade' => 'Musculação',
                    'email' => 'joao@example.com',
                    'telefone' => '(11) 99999-1111',
                    'foto' => null,
                    'biografia' => 'Especialista em musculação com 10 anos de experiência.',
                    'ativo' => true,
                    'created_at' => '2024-01-01T10:00:00.000000Z',
                    'updated_at' => '2024-01-01T10:00:00.000000Z'
                ],
                2 => [
                    'id' => 2,
                    'nome' => 'Maria Souza',
                    'especialidade' => 'Pilates',
                    'email' => 'maria@example.com',
                    'telefone' => '(11) 99999-2222',
                    'foto' => null,
                    'biografia' => 'Instrutora de pilates certificada com formação internacional.',
                    'ativo' => true,
                    'created_at' => '2024-01-02T10:00:00.000000Z',
                    'updated_at' => '2024-01-02T10:00:00.000000Z'
                ]
            ];

            if (!isset($personais[$id])) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Personal não encontrado'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $personais[$id]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in PersonalController@show: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Erro ao buscar personal: ' . $e->getMessage()
            ], 500);
        }
    }

    // Implement other methods as needed
}