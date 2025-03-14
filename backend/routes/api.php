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
use App\Http\Controllers\API\ComentarioController;
use App\Http\Controllers\API\CurtidaController;
use App\Http\Controllers\API\PerfilController;
use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\API\HorarioController;
use App\Http\Controllers\API\CarrinhoController;
use App\Http\Controllers\API\AssinaturaController;
use App\Http\Controllers\API\UsuarioController;
use Illuminate\Support\Facades\Route;

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

// Rotas públicas
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
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

// Comentários públicos
Route::get('/dicas/{dicaId}/comentarios', [ComentarioController::class, 'index']);

// Rotas protegidas por autenticação
Route::middleware('auth:api')->group(function () {
  // Rota para logout
  Route::post('/logout', [AuthController::class, 'logout']);
  
  // Perfil do usuário
  Route::get('/perfil', [PerfilController::class, 'show']);
  Route::put('/perfil', [PerfilController::class, 'update']);
  
  // Rotas para alunos
  Route::post('/agendamentos', [AgendamentoController::class, 'store']);
  Route::get('/meus-agendamentos', [AgendamentoController::class, 'meusAgendamentos']);
  Route::get('/meus-pagamentos', [PagamentoController::class, 'meusPagamentos']);

  // Assinaturas de planos
  Route::get('/minhas-assinaturas', [AssinaturaController::class, 'minhasAssinaturas']);
  Route::get('/minhas-assinaturas/ativas', [AssinaturaController::class, 'minhasAssinaturasAtivas']);
  Route::post('/planos/{id}/assinar', [AssinaturaController::class, 'assinar']);
  Route::post('/assinaturas/{id}/cancelar', [AssinaturaController::class, 'cancelar']);
  
  // Comentários e curtidas
  Route::post('/dicas/{dicaId}/comentarios', [ComentarioController::class, 'store']);
  Route::delete('/comentarios/{id}', [ComentarioController::class, 'destroy']);
  Route::post('/dicas/{dicaId}/curtir', [CurtidaController::class, 'toggle']);
  Route::get('/dicas/{dicaId}/curtida', [CurtidaController::class, 'verificar']);
  
  // Rotas para vendas
  Route::post('/vendas', [VendaController::class, 'store']);
  Route::get('/minhas-compras', [VendaController::class, 'minhasCompras']);

  // Carrinho de compras
  Route::get('/carrinho', [CarrinhoController::class, 'index']);
  Route::post('/carrinho', [CarrinhoController::class, 'store']);
  Route::put('/carrinho/{id}', [CarrinhoController::class, 'update']);
  Route::delete('/carrinho/{id}', [CarrinhoController::class, 'destroy']);
  Route::delete('/carrinho', [CarrinhoController::class, 'clear']);
  
  // Rotas para administradores
  Route::middleware('admin')->group(function () {
      // Dashboard
      Route::get('/admin/dashboard', [DashboardController::class, 'index']);
      
      // CRUD Alunos
      Route::apiResource('alunos', AlunoController::class);
      
      // CRUD Planos
      Route::apiResource('planos', PlanoController::class)->except(['index', 'show']);
      
      // CRUD Pagamentos
      Route::apiResource('pagamentos', PagamentoController::class);
      Route::get('/alunos/{alunoId}/pagamentos', [PagamentoController::class, 'pagamentosPorAluno']);
      
      // CRUD Produtos e Categorias
      Route::apiResource('produtos', ProdutoController::class)->except(['index', 'show']);
      Route::apiResource('categorias-produtos', CategoriaProdutoController::class)->except(['index', 'show']);
      
      // CRUD Vendas
      Route::apiResource('vendas', VendaController::class)->except(['store']);
      
      // CRUD Personais
      Route::apiResource('personais', PersonalController::class)->except(['index', 'show']);
      
      // CRUD Agendamentos
      Route::apiResource('agendamentos', AgendamentoController::class)->except(['store']);
      Route::post('/agendamentos/{id}/aprovar', [AgendamentoController::class, 'aprovar']);
      
      // CRUD Aulas e Dias da Semana
      Route::apiResource('aulas', AulaController::class)->except(['index']);
      Route::apiResource('dias-semana', DiaSemanaController::class)->except(['index']);
      
      // CRUD Horários
      Route::apiResource('horarios', HorarioController::class);
      
      // CRUD Dicas e Categorias
      Route::apiResource('dicas', DicaController::class)->except(['index', 'show']);
      Route::apiResource('categorias-dicas', CategoriaDicaController::class)->except(['index']);
      
      // Gerenciamento de Comentários
      Route::get('/admin/comentarios', [ComentarioController::class, 'listarTodos']);
      Route::post('/comentarios/{id}/aprovar', [ComentarioController::class, 'aprovar']);
      
      // Gerenciamento de Contatos
      Route::apiResource('contatos', ContatoController::class)->except(['store']);
      Route::post('/contatos/{id}/responder', [ContatoController::class, 'responder']);

      // Assinaturas
      Route::apiResource('assinaturas', AssinaturaController::class)->except(['store', 'destroy']);

      // Gerenciamento de Usuários
      Route::get('/admin/usuarios', [UsuarioController::class, 'index']);
      Route::get('/admin/usuarios/online', [UsuarioController::class, 'online']);
      Route::get('/admin/usuarios/{id}', [UsuarioController::class, 'show']);
      Route::put('/admin/usuarios/{id}', [UsuarioController::class, 'update']);
      Route::put('/admin/usuarios/{id}/admin', [UsuarioController::class, 'toggleAdmin']);
  });
});

