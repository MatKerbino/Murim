<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Plano;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PlanoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $planos = Plano::all();
        return response()->json([
            'status' => 'success',
            'data' => $planos
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nome' => 'required|string|max:255',
            'descricao' => 'required|string',
            'valor' => 'required|numeric|min:0',
            'duracao' => 'required|integer|min:1',
            'beneficios' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $plano = Plano::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Plano criado com sucesso',
            'data' => $plano
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $plano = Plano::find($id);

        if (!$plano) {
            return response()->json([
                'status' => 'error',
                'message' => 'Plano não encontrado'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $plano
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $plano = Plano::find($id);

        if (!$plano) {
            return response()->json([
                'status' => 'error',
                'message' => 'Plano não encontrado'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nome' => 'sometimes|required|string|max:255',
            'descricao' => 'sometimes|required|string',
            'valor' => 'sometimes|required|numeric|min:0',
            'duracao' => 'sometimes|required|integer|min:1',
            'beneficios' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $plano->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Plano atualizado com sucesso',
            'data' => $plano
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $plano = Plano::find($id);

        if (!$plano) {
            return response()->json([
                'status' => 'error',
                'message' => 'Plano não encontrado'
            ], 404);
        }

        $plano->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Plano excluído com sucesso'
        ]);
    }
}

