<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\CategoriaProduto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoriaProdutoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categorias = CategoriaProduto::all();
        return response()->json([
            'status' => 'success',
            'data' => $categorias
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
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $categoria = CategoriaProduto::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Categoria criada com sucesso',
            'data' => $categoria
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $categoria = CategoriaProduto::with('produtos')->find($id);

        if (!$categoria) {
            return response()->json([
                'status' => 'error',
                'message' => 'Categoria não encontrada'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $categoria
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $categoria = CategoriaProduto::find($id);

        if (!$categoria) {
            return response()->json([
                'status' => 'error',
                'message' => 'Categoria não encontrada'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nome' => 'sometimes|required|string|max:255',
            'descricao' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $categoria->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Categoria atualizada com sucesso',
            'data' => $categoria
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $categoria = CategoriaProduto::find($id);

        if (!$categoria) {
            return response()->json([
                'status' => 'error',
                'message' => 'Categoria não encontrada'
            ], 404);
        }

        // Verificar se existem produtos associados
        if ($categoria->produtos()->count() > 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'Não é possível excluir a categoria pois existem produtos associados'
            ], 400);
        }

        $categoria->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Categoria excluída com sucesso'
        ]);
    }
}

