<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\DiaSemana;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DiaSemanaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $diasSemana = DiaSemana::orderBy('ordem')->get();
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
            'ordem' => 'required|integer|min:1|unique:dias_semana,ordem',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $diaSemana = DiaSemana::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Dia da semana criado com sucesso',
            'data' => $diaSemana
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $diaSemana = DiaSemana::with('aulas')->find($id);

        if (!$diaSemana) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dia da semana não encontrado'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $diaSemana
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $diaSemana = DiaSemana::find($id);

        if (!$diaSemana) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dia da semana não encontrado'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nome' => 'sometimes|required|string|max:255',
            'ordem' => 'sometimes|required|integer|min:1|unique:dias_semana,ordem,' . $id,
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $diaSemana->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Dia da semana atualizado com sucesso',
            'data' => $diaSemana
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $diaSemana = DiaSemana::find($id);

        if (!$diaSemana) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dia da semana não encontrado'
            ], 404);
        }

        // Verificar se existem aulas associadas
        if ($diaSemana->aulas()->count() > 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'Não é possível excluir o dia da semana pois existem aulas associadas'
            ], 400);
        }

        $diaSemana->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Dia da semana excluído com sucesso'
        ]);
    }
}

