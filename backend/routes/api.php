<?php

use App\Http\Controllers\API\AlunoController;
use App\Http\Controllers\API\PagamentoController;
use App\Http\Controllers\API\PlanoController;
use App\Http\Controllers\API\ProdutoController;
use App\Http\Controllers\API\CategoriaProdutoController;
use App\Http\Controllers\API\VendaController;
use App\Http\Controllers\API\PersonalController;
use App\Http\Controllers\API\AgendamentoController;
use App\Http\Controllers\API\AulaController;
use App\Http\Controllers\API\DiaSemanaController;
use App\Http\Controllers\API\DicaController;
use App\Http\Controllers\API\CategoriaDicaController;
use App\Http\Controllers\API\ContatoController;
use App\Http\Controllers\API\AuthController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Basic test route to verify API functionality
Route::get('/test', function() {
    return response()->json([
        'message' => 'API is working properly',
        'status' => 'success',
        'time' => now()->toDateTimeString()
    ]);
});

// User auth route
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Rotas públicas
Route::post('/login', [AuthController::class, 'login']);
Route::post('/contatos', [ContatoController::class, 'store']);

// Rotas para consulta de dados públicos
Route::get('/planos', [PlanoController::class, 'index']);
Route::get('/planos/{id}', [PlanoController::class, 'show']);

Route::get('/produtos', [ProdutoController::class, 'index']);
Route::get('/produtos/{id}', [ProdutoController::class, 'show']);
Route::get('/categorias-produtos', [CategoriaProdutoController::class, 'index']);
Route::get('/categorias-produtos/{id}', [CategoriaProdutoController::class, 'show']);

Route::get('/personais', [PersonalController::class, 'index']);
Route::get('/personais/{id}', [PersonalController::class, 'show']);

Route::get('/aulas', [AulaController::class, 'index']);
Route::get('/dias-semana', [DiaSemanaController::class, 'index']);

Route::get('/dicas', [DicaController::class, 'index']);
Route::get('/dicas/{id}', [DicaController::class, 'show']);
Route::get('/categorias-dicas', [CategoriaDicaController::class, 'index']);

// Rotas protegidas por autenticação
Route::middleware('auth:api')->group(function () {
    // Rota para logout
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Rotas para alunos
    Route::post('/agendamentos', [AgendamentoController::class, 'store']);
    Route::get('/meus-agendamentos', [AgendamentoController::class, 'meusAgendamentos']);
    Route::get('/meus-pagamentos', [PagamentoController::class, 'meusPagamentos']);
    
    // Rotas para vendas
    Route::post('/vendas', [VendaController::class, 'store']);
    Route::get('/minhas-compras', [VendaController::class, 'minhasCompras']);
    
    // Rotas para administradores
    Route::middleware('admin')->group(function () {
        // CRUD Alunos
        Route::apiResource('alunos', AlunoController::class);
        
        // CRUD Planos
        Route::apiResource('planos', PlanoController::class)->except(['index', 'show']);
        
        // CRUD Pagamentos
        Route::apiResource('pagamentos', PagamentoController::class);
        
        // CRUD Produtos e Categorias
        Route::apiResource('produtos', ProdutoController::class)->except(['index', 'show']);
        Route::apiResource('categorias-produtos', CategoriaProdutoController::class)->except(['index', 'show']);
        
        // CRUD Vendas
        Route::apiResource('vendas', VendaController::class)->except(['store']);
        
        // CRUD Personais
        Route::apiResource('personais', PersonalController::class)->except(['index', 'show']);
        
        // CRUD Agendamentos
        Route::apiResource('agendamentos', AgendamentoController::class)->except(['store']);
        
        // CRUD Aulas e Dias da Semana
        Route::apiResource('aulas', AulaController::class)->except(['index']);
        Route::apiResource('dias-semana', DiaSemanaController::class)->except(['index']);
        
        // CRUD Dicas e Categorias
        Route::apiResource('dicas', DicaController::class)->except(['index', 'show']);
        Route::apiResource('categorias-dicas', CategoriaDicaController::class)->except(['index']);
        
        // Gerenciamento de Contatos
        Route::apiResource('contatos', ContatoController::class)->except(['store']);
        Route::post('/contatos/{id}/responder', [ContatoController::class, 'responder']);
    });
});

// Example resource routes for demonstration
Route::prefix('v1')->group(function () {
    // Dicas routes
    Route::get('/dicas', function() {
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
    });
});

