<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Aluno;
use App\Models\User;
use App\Models\Pagamento;
use App\Models\Venda;
use App\Models\Agendamento;
use App\Models\Contato;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    public function index()
    {
        // Total de alunos (usuários com plano)
        $totalAlunos = Aluno::count();
        
        // Total de usuários registrados
        $totalUsuarios = User::count();
        
        // Alunos novos no último mês
        $alunosNovosMes = Aluno::where('created_at', '>=', Carbon::now()->subMonth())->count();
        
        // Receita mensal (pagamentos do mês atual)
        $receitaMensal = Pagamento::where('data_pagamento', '>=', Carbon::now()->startOfMonth())
            ->where('data_pagamento', '<=', Carbon::now()->endOfMonth())
            ->sum('valor');
        
        // Receita de planos ativos
        $receitaPlanosAtivos = Aluno::whereHas('plano')
            ->with('plano')
            ->get()
            ->sum(function ($aluno) {
                return $aluno->plano ? $aluno->plano->valor : 0;
            });
        
        // Receita bruta (planos ativos + vendas + agendamentos)
        $receitaVendas = Pagamento::where('tipo', 'loja')
            ->where('data_pagamento', '>=', Carbon::now()->startOfMonth())
            ->where('data_pagamento', '<=', Carbon::now()->endOfMonth())
            ->sum('valor');
            
        $receitaAgendamentos = Pagamento::where('tipo', 'agendamento')
            ->where('data_pagamento', '>=', Carbon::now()->startOfMonth())
            ->where('data_pagamento', '<=', Carbon::now()->endOfMonth())
            ->sum('valor');
            
        $receitaBruta = $receitaPlanosAtivos + $receitaVendas + $receitaAgendamentos;
        
        // Receita do mês anterior para cálculo de crescimento
        $receitaMesAnterior = Pagamento::where('data_pagamento', '>=', Carbon::now()->subMonth()->startOfMonth())
            ->where('data_pagamento', '<=', Carbon::now()->subMonth()->endOfMonth())
            ->sum('valor');
        
        // Cálculo do crescimento da receita
        $crescimentoReceita = 0;
        if ($receitaMesAnterior > 0) {
            $crescimentoReceita = round((($receitaMensal - $receitaMesAnterior) / $receitaMesAnterior) * 100);
        }
        
        // Total de vendas na loja
        $vendasLoja = Pagamento::where('tipo', 'loja')->count();
        
        // Total de vendas de planos
        $vendasPlanos = Pagamento::where('tipo', 'plano')
            ->where('data_pagamento', '>=', Carbon::now()->startOfMonth())
            ->where('data_pagamento', '<=', Carbon::now()->endOfMonth())
            ->count();
            
        // Total de vendas de agendamentos
        $vendasAgendamentos = Pagamento::where('tipo', 'agendamento')
            ->where('data_pagamento', '>=', Carbon::now()->startOfMonth())
            ->where('data_pagamento', '<=', Carbon::now()->endOfMonth())
            ->count();
        
        // Vendas na última semana
        $vendasSemana = Pagamento::where('tipo', 'loja')
            ->where('created_at', '>=', Carbon::now()->subWeek())
            ->count();
        
        // Agendamentos para os próximos 7 dias
        $agendamentos = Agendamento::where('data', '>=', Carbon::now())
            ->where('data', '<=', Carbon::now()->addDays(7))
            ->count();
        
        // Atividades recentes
        $atividadesRecentes = [];
        
        // Últimos alunos cadastrados
        $ultimosAlunos = Aluno::orderBy('created_at', 'desc')->take(1)->get();
        foreach ($ultimosAlunos as $aluno) {
            $atividadesRecentes[] = [
                'tipo' => 'aluno',
                'descricao' => 'Novo aluno cadastrado',
                'tempo' => Carbon::parse($aluno->created_at)->diffForHumans(),
                'icone' => 'blue'
            ];
        }
        
        // Últimos pagamentos
        $ultimosPagamentos = Pagamento::orderBy('created_at', 'desc')->take(1)->get();
        foreach ($ultimosPagamentos as $pagamento) {
            $atividadesRecentes[] = [
                'tipo' => 'pagamento',
                'descricao' => 'Pagamento registrado',
                'tempo' => Carbon::parse($pagamento->created_at)->diffForHumans(),
                'icone' => 'pink'
            ];
        }
        
        // Últimas vendas
        $ultimasVendas = Venda::orderBy('created_at', 'desc')->take(1)->get();
        foreach ($ultimasVendas as $venda) {
            $atividadesRecentes[] = [
                'tipo' => 'venda',
                'descricao' => 'Produto vendido',
                'tempo' => Carbon::parse($venda->created_at)->diffForHumans(),
                'icone' => 'purple'
            ];
        }
        
        // Últimos agendamentos
        $ultimosAgendamentos = Agendamento::orderBy('created_at', 'desc')->take(1)->get();
        foreach ($ultimosAgendamentos as $agendamento) {
            $atividadesRecentes[] = [
                'tipo' => 'agendamento',
                'descricao' => 'Agendamento confirmado',
                'tempo' => Carbon::parse($agendamento->created_at)->diffForHumans(),
                'icone' => 'cyan'
            ];
        }
        
        // Ordenar atividades por data (mais recentes primeiro)
        usort($atividadesRecentes, function ($a, $b) {
            return strtotime(str_replace(' atrás', '', $b['tempo'])) - strtotime(str_replace(' atrás', '', $a['tempo']));
        });
        
        // Limitar a 4 atividades
        $atividadesRecentes = array_slice($atividadesRecentes, 0, 4);
        
        // Mensagens recentes
        $mensagensRecentes = Contato::orderBy('created_at', 'desc')
            ->take(3)
            ->get()
            ->map(function ($contato) {
                return [
                    'id' => $contato->id,
                    'nome' => $contato->nome,
                    'email' => $contato->email,
                    'assunto' => $contato->assunto,
                    'mensagem' => $contato->mensagem,
                    'data' => Carbon::parse($contato->created_at)->diffForHumans()
                ];
            });
            
        // Usuários logados (usando cache para simular usuários online)
        $usuariosLogados = Cache::remember('usuarios_online', 60, function () {
            // Em um sistema real, você teria uma tabela de sessões ou usaria
            // um sistema de presença para rastrear usuários online
            // Aqui estamos simulando com os últimos usuários que fizeram login
            return User::orderBy('updated_at', 'desc')
                ->take(5)
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'nome' => $user->name,
                        'email' => $user->email,
                        'tempo' => Carbon::parse($user->updated_at)->diffForHumans()
                    ];
                });
        });
        
        return response()->json([
            'status' => 'success',
            'data' => [
                'totalAlunos' => $totalAlunos,
                'totalUsuarios' => $totalUsuarios,
                'alunosNovosMes' => $alunosNovosMes,
                'receitaMensal' => $receitaMensal,
                'receitaPlanosAtivos' => $receitaPlanosAtivos,
                'receitaBruta' => $receitaBruta,
                'crescimentoReceita' => $crescimentoReceita,
                'vendasLoja' => $vendasLoja,
                'vendasPlanos' => $vendasPlanos,
                'vendasAgendamentos' => $vendasAgendamentos,
                'vendasSemana' => $vendasSemana,
                'agendamentos' => $agendamentos,
                'atividadesRecentes' => $atividadesRecentes,
                'mensagensRecentes' => $mensagensRecentes,
                'usuariosLogados' => $usuariosLogados
            ]
        ]);
    }
}

