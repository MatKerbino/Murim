<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\CategoriaDica;
use Illuminate\Http\Request;

class CategoriaDicaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categoriasDicas = CategoriaDica::with('dicas')->get();

        return response()->json($categoriasDicas);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:categorias_dicas',
            'descricao' => 'nullable|string',
        ]);

        $categoriaDica = CategoriaDica::create($request->all());

        return response()->json($categoriaDica, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $categoriaDica = CategoriaDica::findOrFail($id);
        return response()->json($categoriaDica);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'nome' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:categorias_dicas,slug,' . $id,
            'descricao' => 'nullable|string',
        ]);

        $categoriaDica = CategoriaDica::findOrFail($id);
        $categoriaDica->update($request->all());

        return response()->json($categoriaDica);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $categoriaDica = CategoriaDica::findOrFail($id);
        $categoriaDica->delete();

        return response()->json(null, 204);
    }
} 