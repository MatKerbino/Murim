<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Horario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class HorarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $horarios = Horario::with('diaSemana')->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $horarios
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'dia_semana_id' => 'required|exists:dias_semana,id',
            'hora_inicio' => 'required|date_format:H:i',
            'hora_fim' => 'required|date_format:H:i|after:hora_inicio',
            'tipo_aula' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $horario = Horario::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Horário criado com sucesso',
            'data' => $horario
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $horario = Horario::with('diaSemana')->find($id);

        if (!$horario) {
            return response()->json([
                'status' => 'error',
                'message' => 'Horário não encontrado'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $horario
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $horario = Horario::find($id);

        if (!$horario) {
            return response()->json([
                'status' => 'error',
                'message' => 'Horário não encontrado'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'dia_semana_id' => 'sometimes|required|exists:dias_semana,id',
            'hora_inicio' => 'sometimes|required|date_format:H:i',
            'hora_fim' => 'sometimes|required|date_format:H:i|after:hora_inicio',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $horario->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Horário atualizado com sucesso',
            'data' => $horario
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $horario = Horario::find($id);

        if (!$horario) {
            return response()->json([
                'status' => 'error',
                'message' => 'Horário não encontrado'
            ], 404);
        }

        $horario->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Horário excluído com sucesso'
        ]);
    }
}

