<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Pagamento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PagamentoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pagamentos = Pagamento::with(['aluno', 'plano'])->get();
        return response()->json([
            'status' => 'success',
            'data' => $pagamentos
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'aluno_id' => 'required|exists:alunos,id',
            'plano_id' => 'required|exists:planos,id',
            'valor' => 'required|numeric|min:0',
            'data_vencimento' => 'required|date',
            'data_pagamento' => 'nullable|date',
            'status' => 'required|in:pendente,pago,atrasado,cancelado',
            'metodo_pagamento' => 'nullable|string|max:255',
            'codigo_transacao' => 'nullable|string|max:255',
            'observacoes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $pagamento = Pagamento::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Pagamento criado com sucesso',
            'data' => $pagamento
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $pagamento = Pagamento::with(['aluno', 'plano'])->find($id);

        if (!$pagamento) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pagamento não encontrado'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $pagamento
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $pagamento = Pagamento::find($id);

        if (!$pagamento) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pagamento não encontrado'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'aluno_id' => 'sometimes|required|exists:alunos,id',
            'plano_id' => 'sometimes|required|exists:planos,id',
            'valor' => 'sometimes|required|numeric|min:0',
            'data_vencimento' => 'sometimes|required|date',
            'data_pagamento' => 'nullable|date',
            'status' => 'sometimes|required|in:pendente,pago,atrasado,cancelado',
            'metodo_pagamento' => 'nullable|string|max:255',
            'codigo_transacao' => 'nullable|string|max:255',
            'observacoes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $pagamento->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Pagamento atualizado com sucesso',
            'data' => $pagamento
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $pagamento = Pagamento::find($id);

        if (!$pagamento) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pagamento não encontrado'
            ], 404);
        }

        $pagamento->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Pagamento excluído com sucesso'
        ]);
    }
}

