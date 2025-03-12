<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Aluno;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AlunoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $alunos = Aluno::with('plano')->get();
        return response()->json([
            'status' => 'success',
            'data' => $alunos
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nome' => 'required|string|max:255',
            'email' => 'required|email|unique:alunos,email',
            'telefone' => 'required|string|max:20',
            'data_nascimento' => 'required|date',
            'matricula' => 'required|string|max:20|unique:alunos,matricula',
            'plano_id' => 'required|exists:planos,id',
            'data_inicio' => 'required|date',
            'data_fim' => 'nullable|date|after:data_inicio',
            'status' => 'required|in:ativo,inativo,pendente',
            'observacoes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $aluno = Aluno::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Aluno criado com sucesso',
            'data' => $aluno
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $aluno = Aluno::with(['plano', 'pagamentos', 'agendamentos'])->find($id);

        if (!$aluno) {
            return response()->json([
                'status' => 'error',
                'message' => 'Aluno não encontrado'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $aluno
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $aluno = Aluno::find($id);

        if (!$aluno) {
            return response()->json([
                'status' => 'error',
                'message' => 'Aluno não encontrado'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nome' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:alunos,email,' . $id,
            'telefone' => 'sometimes|required|string|max:20',
            'data_nascimento' => 'sometimes|required|date',
            'matricula' => 'sometimes|required|string|max:20|unique:alunos,matricula,' . $id,
            'plano_id' => 'sometimes|required|exists:planos,id',
            'data_inicio' => 'sometimes|required|date',
            'data_fim' => 'nullable|date|after:data_inicio',
            'status' => 'sometimes|required|in:ativo,inativo,pendente',
            'observacoes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $aluno->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Aluno atualizado com sucesso',
            'data' => $aluno
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $aluno = Aluno::find($id);

        if (!$aluno) {
            return response()->json([
                'status' => 'error',
                'message' => 'Aluno não encontrado'
            ], 404);
        }

        $aluno->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Aluno excluído com sucesso'
        ]);
    }
}

