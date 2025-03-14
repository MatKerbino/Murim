<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Assinatura;
use App\Models\Plano;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AssinaturaController extends Controller
{
    /**
     * Obter assinaturas do usuário atual
     */
    public function minhasAssinaturas(Request $request)
    {
        $user = $request->user();
        $assinaturas = Assinatura::with('plano')
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $assinaturas
        ]);
    }

    /**
     * Obter assinaturas ativas do usuário atual
     */
    public function minhasAssinaturasAtivas(Request $request)
    {
        $user = $request->user();
        $assinaturas = Assinatura::with('plano')
            ->where('user_id', $user->id)
            ->where('ativa', true)
            ->where('data_fim', '>=', Carbon::now())
            ->orderBy('data_fim', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $assinaturas
        ]);
    }

    /**
     * Assinar um plano
     */
    public function assinar(Request $request, $planoId)
    {
        $validator = Validator::make(['plano_id' => $planoId], [
            'plano_id' => 'required|exists:planos,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Plano não encontrado',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $plano = Plano::findOrFail($planoId);

        // Calcular datas de início e fim
        $dataInicio = Carbon::now();
        $dataFim = Carbon::now()->addMonths($plano->duracao);

        // Criar assinatura
        $assinatura = Assinatura::create([
            'user_id' => $user->id,
            'plano_id' => $plano->id,
            'data_inicio' => $dataInicio,
            'data_fim' => $dataFim,
            'ativa' => true,
            'valor_pago' => $plano->valor,
            'status_pagamento' => 'aprovado', // Simulando pagamento aprovado
        ]);

        // Carregar o relacionamento com o plano
        $assinatura->load('plano');

        return response()->json([
            'status' => 'success',
            'message' => 'Plano assinado com sucesso',
            'data' => $assinatura
        ], 201);
    }

    /**
     * Cancelar uma assinatura
     */
    public function cancelar(Request $request, $id)
    {
        $user = $request->user();
        $assinatura = Assinatura::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $assinatura->ativa = false;
        $assinatura->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Assinatura cancelada com sucesso',
            'data' => $assinatura
        ]);
    }

    /**
     * Listar todas as assinaturas (admin)
     */
    public function index()
    {
        $assinaturas = Assinatura::with(['user', 'plano'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $assinaturas
        ]);
    }

    /**
     * Obter detalhes de uma assinatura (admin)
     */
    public function show($id)
    {
        $assinatura = Assinatura::with(['user', 'plano'])
            ->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $assinatura
        ]);
    }

    /**
     * Atualizar uma assinatura (admin)
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'data_inicio' => 'sometimes|date',
            'data_fim' => 'sometimes|date',
            'ativa' => 'sometimes|boolean',
            'status_pagamento' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $assinatura = Assinatura::findOrFail($id);
        $assinatura->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Assinatura atualizada com sucesso',
            'data' => $assinatura
        ]);
    }
}

