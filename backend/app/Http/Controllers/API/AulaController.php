<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Aula;
use App\Models\DiaSemana;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AulaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $diasSemana = DiaSemana::with(['aulas' => function ($query) {
            $query->where('ativa', true)->orderBy('horario_inicio');
        }])->orderBy('ordem')->get();

        return response()->json([
            'status' => 'success',
            'data' => $diasSemana
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nome' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'dia_semana_id' => 'required|exists:dias_semana,id',
            'horario_inicio' => 'required|string|max:5',
            'horario_fim' => 'required|string|max:5',
            'instrutor' => 'required|string|max:255',
            'capacidade_maxima' => 'required|integer|min:1',
            'ativa' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $aula = Aula::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Aula criada com sucesso',
            'data' => $aula
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $aula = Aula::with('diaSemana')->find($id);

        if (!$aula) {
            return response()->json([
                'status' => 'error',
                'message' => 'Aula não encontrada'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $aula
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $aula = Aula::find($id);

        if (!$aula) {
            return response()->json([
                'status' => 'error',
                'message' => 'Aula não encontrada'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nome' => 'sometimes|required|string|max:255',
            'descricao' => 'nullable|string',
            'dia_semana_id' => 'sometimes|required|exists:dias_semana,id',
            'horario_inicio' => 'sometimes|required|string|max:5',
            'horario_fim' => 'sometimes|required|string|max:5',
            'instrutor' => 'sometimes|required|string|max:255',
            'capacidade_maxima' => 'sometimes|required|integer|min:1',
            'ativa' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $aula->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Aula atualizada com sucesso',
            'data' => $aula
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $aula = Aula::find($id);

        if (!$aula) {
            return response()->json([
                'status' => 'error',
                'message' => 'Aula não encontrada'
            ], 404);
        }

        $aula->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Aula excluída com sucesso'
        ]);
    }
}

