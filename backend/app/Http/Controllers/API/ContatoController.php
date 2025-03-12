<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Contato;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContatoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $contatos = Contato::orderBy('created_at', 'desc')->get();
        return response()->json([
            'status' => 'success',
            'data' => $contatos
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nome' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'telefone' => 'nullable|string|max:20',
            'assunto' => 'required|string|max:255',
            'mensagem' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $contato = Contato::create([
            'nome' => $request->nome,
            'email' => $request->email,
            'telefone' => $request->telefone,
            'assunto' => $request->assunto,
            'mensagem' => $request->mensagem,
            'status' => 'novo',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Mensagem enviada com sucesso',
            'data' => $contato
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $contato = Contato::find($id);

        if (!$contato) {
            return response()->json([
                'status' => 'error',
                'message' => 'Contato não encontrado'
            ], 404);
        }

        // Atualizar status para lido se estiver como novo
        if ($contato->status === 'novo') {
            $contato->update(['status' => 'lido']);
        }

        return response()->json([
            'status' => 'success',
            'data' => $contato
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $contato = Contato::find($id);

        if (!$contato) {
            return response()->json([
                'status' => 'error',
                'message' => 'Contato não encontrado'
            ], 404);
        }

        $contato->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Contato excluído com sucesso'
        ]);
    }

    /**
     * Responder a mensagem de contato
     */
    public function responder(Request $request, string $id)
    {
        $contato = Contato::find($id);

        if (!$contato) {
            return response()->json([
                'status' => 'error',
                'message' => 'Contato não encontrado'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'resposta' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $contato->update([
            'resposta' => $request->resposta,
            'status' => 'respondido',
            'data_resposta' => now(),
        ]);

        // Aqui poderia ser implementado o envio de e-mail com a resposta

        return response()->json([
            'status' => 'success',
            'message' => 'Resposta enviada com sucesso',
            'data' => $contato
        ]);
    }
}

