<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Aluno;
use App\Models\User;
use App\Models\Pagamento;
use App\Models\Venda;
use App\Models\Agendamento;
use App\Models\Contato;
use App\Models\Assinatura;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;


class DashboardController extends Controller
{
    public function index()
    {
        Log::info('Iniciando a requisição para o dashboard.');

        try {
            // Total de alunos (usuários com plano)
            $totalAlunos = Aluno::count();
            Log::info('Total de alunos: ' . $totalAlunos);
            
            // Total de usuários registrados
            $totalUsuarios = User::count();
            Log::info('Total de usuários: ' . $totalUsuarios);
            
            // Alunos novos no último mês
            $alunosNovosMes = Aluno::where('created_at', '>=', Carbon::now()->subMonth())->count();
            Log::info('Alunos novos no último mês: ' . $alunosNovosMes);
            
            // Receita mensal (pagamentos do mês atual)
            $receitaMensal = Pagamento::where('data_pagamento', '>=', Carbon::now()->startOfMonth())
                ->where('data_pagamento', '<=', Carbon::now()->endOfMonth())
                ->sum('valor');
            Log::info('Receita mensal: R$ ' . $receitaMensal);
            
            // Receita de planos ativos
            $receitaPlanosAtivos = Assinatura::where('ativa', true)
                ->whereHas('plano')
                ->with('plano')
                ->get()
                ->sum(function ($assinatura) {
                    return $assinatura->plano ? $assinatura->plano->valor : 0;
                });
            Log::info('Receita de planos ativos: R$ ' . $receitaPlanosAtivos);
            
            // Receita bruta (planos ativos + vendas + agendamentos)
            $receitaVendas = Pagamento::where('tipo', 'loja')
                ->where('data_pagamento', '>=', Carbon::now()->startOfMonth())
                ->where('data_pagamento', '<=', Carbon::now()->endOfMonth())
                ->sum('valor');
            Log::info('Receita de vendas: R$ ' . $receitaVendas);
                
            $receitaAgendamentos = Pagamento::where('tipo', 'agendamento')
                ->where('data_pagamento', '>=', Carbon::now()->startOfMonth())
                ->where('data_pagamento', '<=', Carbon::now()->endOfMonth())
                ->sum('valor');
            Log::info('Receita de agendamentos: R$ ' . $receitaAgendamentos);
                
            $receitaBruta = $receitaPlanosAtivos + $receitaVendas + $receitaAgendamentos;
            Log::info('Receita bruta: R$ ' . $receitaBruta);
            
            // Receita do mês anterior para cálculo de crescimento
            $receitaMesAnterior = Pagamento::where('data_pagamento', '>=', Carbon::now()->subMonth()->startOfMonth())
                ->where('data_pagamento', '<=', Carbon::now()->subMonth()->endOfMonth())
                ->sum('valor');
            Log::info('Receita do mês anterior: R$ ' . $receitaMesAnterior);
            
            // Cálculo do crescimento da receita
            $crescimentoReceita = 0;
            if ($receitaMesAnterior > 0) {
                $crescimentoReceita = round((($receitaMensal - $receitaMesAnterior) / $receitaMesAnterior) * 100);
            }
            Log::info('Crescimento da receita: ' . $crescimentoReceita . '%');
            
            // Total de vendas na loja
            $vendasLoja = Pagamento::where('tipo', 'loja')->count();
            Log::info('Total de vendas na loja: ' . $vendasLoja);
            
            // Total de vendas de planos
            $vendasPlanos = Pagamento::where('tipo', 'plano')
                ->where('data_pagamento', '>=', Carbon::now()->startOfMonth())
                ->where('data_pagamento', '<=', Carbon::now()->endOfMonth())
                ->count();
            Log::info('Total de vendas de planos: ' . $vendasPlanos);
                
            // Total de vendas de agendamentos
            $vendasAgendamentos = Pagamento::where('tipo', 'agendamento')
                ->where('data_pagamento', '>=', Carbon::now()->startOfMonth())
                ->where('data_pagamento', '<=', Carbon::now()->endOfMonth())
                ->count();
            Log::info('Total de vendas de agendamentos: ' . $vendasAgendamentos);
            
            // Vendas na última semana
            $vendasSemana = Pagamento::where('tipo', 'loja')
                ->where('created_at', '>=', Carbon::now()->subWeek())
                ->count();
            Log::info('Vendas na última semana: ' . $vendasSemana);
            
            // Agendamentos para os próximos 7 dias
            $agendamentos = Agendamento::where('data', '>=', Carbon::now())
                ->where('data', '<=', Carbon::now()->addDays(7))
                ->count();
            Log::info('Agendamentos para os próximos 7 dias: ' . $agendamentos);
            
            // Atividades recentes
            $atividadesRecentes = [];
            
            // Últimos alunos cadastrados
            $ultimosAlunos = Aluno::with('user')->orderBy('created_at', 'desc')->take(1)->get();
            foreach ($ultimosAlunos as $aluno) {
                $atividadesRecentes[] = [
                    'tipo' => 'aluno',
                    'descricao' => 'Novo aluno cadastrado: ' . ($aluno->user ? $aluno->user->name : 'Usuário'),
                    'tempo' => Carbon::parse($aluno->created_at)->diffForHumans(),
                    'icone' => 'blue'
                ];
                Log::info('Atividade recente: Novo aluno cadastrado: ' . ($aluno->user ? $aluno->user->name : 'Usuário'));
            }
            
            // Últimos pagamentos
            $ultimosPagamentos = Pagamento::orderBy('created_at', 'desc')->take(1)->get();
            foreach ($ultimosPagamentos as $pagamento) {
                $atividadesRecentes[] = [
                    'tipo' => 'pagamento',
                    'descricao' => 'Pagamento registrado: R$ ' . number_format($pagamento->valor, 2, ',', '.'),
                    'tempo' => Carbon::parse($pagamento->created_at)->diffForHumans(),
                    'icone' => 'pink'
                ];
                Log::info('Atividade recente: Pagamento registrado: R$ ' . number_format($pagamento->valor, 2, ',', '.'));
            }
            
            // Últimas vendas
            $ultimasVendas = Venda::orderBy('created_at', 'desc')->take(1)->get();
            foreach ($ultimasVendas as $venda) {
                $atividadesRecentes[] = [
                    'tipo' => 'venda',
                    'descricao' => 'Venda realizada: R$ ' . number_format($venda->valor_total, 2, ',', '.'),
                    'tempo' => Carbon::parse($venda->created_at)->diffForHumans(),
                    'icone' => 'purple'
                ];
                Log::info('Atividade recente: Venda realizada: R$ ' . number_format($venda->valor_total, 2, ',', '.'));
            }
            
            // Últimos agendamentos
            $ultimosAgendamentos = Agendamento::with(['aluno.user', 'personal'])->orderBy('created_at', 'desc')->take(1)->get();
            foreach ($ultimosAgendamentos as $agendamento) {
                $nomeAluno = $agendamento->aluno && $agendamento->aluno->user ? $agendamento->aluno->user->name : 'Aluno';
                $nomePersonal = $agendamento->personal ? $agendamento->personal->nome : 'Personal';
                
                $atividadesRecentes[] = [
                    'tipo' => 'agendamento',
                    'descricao' => "Agendamento: {$nomeAluno} com {$nomePersonal}",
                    'tempo' => Carbon::parse($agendamento->created_at)->diffForHumans(),
                    'icone' => 'cyan'
                ];
                Log::info('Atividade recente: Agendamento: ' . $nomeAluno . ' com ' . $nomePersonal);
            }
            
            // Ordenar atividades por data (mais recentes primeiro)
            usort($atividadesRecentes, function ($a, $b) {
                return strtotime(str_replace(' atrás', '', $b['tempo'])) - strtotime(str_replace(' atrás', '', $a['tempo']));
            });
            
            // Limitar a 4 atividades
            $atividadesRecentes = array_slice($atividadesRecentes, 0, 4);
            Log::info('Atividades recentes limitadas a 4.');

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
            Log::info('Mensagens recentes carregadas.');

            // Usuários logados (últimos usuários ativos)
            $usuariosLogados = User::orderBy('updated_at', 'desc')
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
            Log::info('Usuários logados carregados.');

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
        } catch (\Exception $e) {
            Log::error('Erro ao buscar dados do dashboard: ' . $e->getMessage());
            return response()->json(['error' => 'Erro ao buscar dados do dashboard'], 500);
        }
    }
}

