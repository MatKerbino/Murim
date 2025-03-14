<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Personal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class PersonalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $personais = Personal::all(); // Obtém todos os registros de personal
        return response()->json($personais);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'especialidade' => 'required|string|max:255',
            'email' => 'required|email|unique:personais,email',
            'telefone' => 'nullable|string|max:20',
            'foto' => 'nullable|string',
            'biografia' => 'nullable|string',
            'ativo' => 'required|boolean',
        ]);

        $personal = Personal::create($request->all());
        return response()->json($personal, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $personal = Personal::findOrFail($id);
        return response()->json($personal);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'nome' => 'sometimes|required|string|max:255',
            'especialidade' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:personais,email,' . $id,
            'telefone' => 'nullable|string|max:20',
            'foto' => 'nullable|string',
            'biografia' => 'nullable|string',
            'ativo' => 'sometimes|required|boolean',
        ]);

        $personal = Personal::findOrFail($id);
        $personal->update($request->all());
        return response()->json($personal);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $personal = Personal::findOrFail($id);
        $personal->delete();
        return response()->json(null, 204);
    }

    // Implement other methods as needed
}