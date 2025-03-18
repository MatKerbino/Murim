<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Dica;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DicaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $dicas = Dica::with(['categoria', 'comentarios', 'curtidas'])->get(); // Carrega dicas com categorias, comentários e curtidas
        return response()->json(['data' => $dicas], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request['publicado'] = filter_var($request['publicado'], FILTER_VALIDATE_BOOLEAN);
        $request['destaque'] = filter_var($request['destaque'], FILTER_VALIDATE_BOOLEAN);
        $validator = Validator::make($request->all(), [
            'titulo' => 'required|string|max:255',
            'descricao' => 'required|string',
            'conteudo' => 'required|string',
            'autor_id' => 'required|string|max:255',
            'categoria_id' => 'required|exists:categorias_dicas,id', // Verifica se a categoria existe
            'imagem' => 'nullable|string', // Adiciona validação para imagem, se necessário
            'publicado' => 'boolean', // Adiciona validação para o campo publicado
            'destaque' => 'boolean', // Adiciona validação para o campo destaque
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $dica = Dica::create($request->all()); // Cria uma nova dica no banco de dados
        return response()->json(['data' => $dica], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $dica = Dica::with(['categoria', 'comentarios', 'curtidas'])->find($id); // Carrega a dica com dados relacionados

        if (!$dica) {
            return response()->json(['message' => 'Dica não encontrada'], 404);
        }

        return response()->json(['data' => $dica], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $dica = Dica::find($id);

        if (!$dica) {
            return response()->json(['message' => 'Dica não encontrada'], 404);
        }

        $validator = Validator::make($request->all(), [
            'titulo' => 'sometimes|required|string|max:255',
            'descricao' => 'sometimes|required|string',
            'conteudo' => 'sometimes|required|string',
            'autor' => 'sometimes|required|string|max:255',
            'categoria_id' => 'sometimes|required|exists:categorias_dicas,id',
            'imagem' => 'nullable|string',
            'publicado' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $dica->update($request->all()); // Atualiza a dica no banco de dados
        return response()->json(['data' => $dica], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $dica = Dica::find($id);

        if (!$dica) {
            return response()->json(['message' => 'Dica não encontrada'], 404);
        }

        $dica->delete(); // Remove a dica do banco de dados
        return response()->json(['message' => 'Dica deletada com sucesso'], 200);
    }
} 