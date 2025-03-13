<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Comentario;
use App\Models\Dica;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ComentarioController extends Controller
{
    /**
     * Listar comentários de uma dica
     */
    public function index($dicaId)
    {
        $dica = Dica::findOrFail($dicaId);
        
        $comentarios = $dica->comentarios()
            ->with('user:id,name')
            ->where('aprovado', true)
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json([
            'status' => 'success',
            'data' => $comentarios
        ]);
    }
    
    /**
     * Criar um novo comentário
     */
    public function store(Request $request, $dicaId)
    {
        $validator = Validator::make($request->all(), [
            'conteudo' => 'required|string|min:3|max:1000',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }
        
        $dica = Dica::findOrFail($dicaId);
        
        $comentario = new Comentario([
            'dica_id' => $dica->id,
            'user_id' => Auth::id(),
            'conteudo' => $request->conteudo,
            'aprovado' => true, // Por padrão, comentários são aprovados automaticamente
        ]);
        
        $comentario->save();
        
        // Carregar o usuário relacionado
        $comentario->load('user:id,name');
        
        return response()->json([
            'status' => 'success',
            'message' => 'Comentário adicionado com sucesso',
            'data' => $comentario
        ], 201);
    }
    
    /**
     * Excluir um comentário (apenas o próprio usuário ou admin)
     */
    public function destroy($id)
    {
        $comentario = Comentario::findOrFail($id);
        
        // Verificar se o usuário é o autor do comentário ou é admin
        if (Auth::id() !== $comentario->user_id && !Auth::user()->is_admin) {
            return response()->json([
                'status' => 'error',
                'message' => 'Você não tem permissão para excluir este comentário'
            ], 403);
        }
        
        $comentario->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Comentário excluído com sucesso'
        ]);
    }
    
    /**
     * Aprovar ou reprovar um comentário (apenas admin)
     */
    public function aprovar(Request $request, $id)
    {
        $comentario = Comentario::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'aprovado' => 'required|boolean',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }
        
        $comentario->aprovado = $request->aprovado;
        $comentario->save();
        
        return response()->json([
            'status' => 'success',
            'message' => $request->aprovado ? 'Comentário aprovado com sucesso' : 'Comentário reprovado com sucesso',
            'data' => $comentario
        ]);
    }
    
    /**
     * Listar todos os comentários para admin
     */
    public function listarTodos()
    {
        $comentarios = Comentario::with(['user:id,name', 'dica:id,titulo'])
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json([
            'status' => 'success',
            'data' => $comentarios
        ]);
    }
}

