<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Produto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProdutoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $produtos = Produto::with('categoria')->get();
        return response()->json([
            'status' => 'success',
            'data' => $produtos
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
            'preco' => 'required|numeric|min:0',
            'categoria_id' => 'required|exists:categorias_produtos,id',
            'imagem' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'estoque' => 'required|integer|min:0',
            'ativo' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();

        if ($request->hasFile('imagem')) {
            $imagemPath = $request->file('imagem')->store('produtos', 'public');
            $data['imagem'] = $imagemPath;
        }

        $produto = Produto::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Produto criado com sucesso',
            'data' => $produto
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $produto = Produto::with('categoria')->find($id);

        if (!$produto) {
            return response()->json([
                'status' => 'error',
                'message' => 'Produto não encontrado'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $produto
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $produto = Produto::find($id);

        if (!$produto) {
            return response()->json([
                'status' => 'error',
                'message' => 'Produto não encontrado'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nome' => 'sometimes|required|string|max:255',
            'descricao' => 'sometimes|required|string',
            'preco' => 'sometimes|required|numeric|min:0',
            'categoria_id' => 'sometimes|required|exists:categorias_produtos,id',
            'imagem' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'estoque' => 'sometimes|required|integer|min:0',
            'ativo' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->except('imagem');

        if ($request->hasFile('imagem')) {
            // Remover imagem antiga se existir
            if ($produto->imagem) {
                Storage::disk('public')->delete($produto->imagem);
            }
            
            $imagemPath = $request->file('imagem')->store('produtos', 'public');
            $data['imagem'] = $imagemPath;
        }

        $produto->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Produto atualizado com sucesso',
            'data' => $produto
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $produto = Produto::find($id);

        if (!$produto) {
            return response()->json([
                'status' => 'error',
                'message' => 'Produto não encontrado'
            ], 404);
        }

        // Remover imagem se existir
        if ($produto->imagem) {
            Storage::disk('public')->delete($produto->imagem);
        }

        $produto->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Produto excluído com sucesso'
        ]);
    }
}

