<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Aluno;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class UsuarioController extends Controller
{
    /**
     * Listar todos os usuários
     */
    public function index()
    {
        $usuarios = User::select('users.*')
            ->selectRaw('(SELECT COUNT(*) FROM sessions WHERE sessions.user_id = users.id AND last_activity > ?) as is_online', [Carbon::now()->subMinutes(15)->timestamp])
            ->selectRaw('(SELECT EXISTS(SELECT 1 FROM alunos WHERE alunos.user_id = users.id)) as is_aluno')
            ->orderBy('name')
            ->get()
            ->map(function ($user) {
                $user->is_online = (bool) $user->is_online;
                $user->is_aluno = (bool) $user->is_aluno;
                return $user;
            });

        return response()->json([
            'status' => 'success',
            'data' => $usuarios
        ]);
    }

    /**
     * Exibir detalhes de um usuário específico
     */
    public function show($id)
    {
        $usuario = User::findOrFail($id);
        
        // Verificar se o usuário é um aluno
        $aluno = Aluno::where('user_id', $id)->first();
        $usuario->is_aluno = (bool) $aluno;
        
        // Verificar se o usuário está online (ativo nos últimos 15 minutos)
        $usuario->is_online = DB::table('sessions')
            ->where('user_id', $id)
            ->where('last_activity', '>', Carbon::now()->subMinutes(15)->timestamp)
            ->exists();
            
        // Obter último login
        $lastSession = DB::table('sessions')
            ->where('user_id', $id)
            ->orderBy('last_activity', 'desc')
            ->first();
            
        $usuario->last_login = $lastSession ? Carbon::createFromTimestamp($lastSession->last_activity) : null;

        return response()->json([
            'status' => 'success',
            'data' => $usuario
        ]);
    }

    /**
     * Atualizar um usuário
     */
    public function update(Request $request, $id)
    {
        $usuario = User::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $id,
            'password' => 'sometimes|required|string|min:8',
            'foto' => 'nullable|image|max:2048',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }
        
        if ($request->has('name')) {
            $usuario->name = $request->name;
        }
        
        if ($request->has('email')) {
            $usuario->email = $request->email;
        }
        
        if ($request->has('password')) {
            $usuario->password = Hash::make($request->password);
        }
        
        // Processar upload de foto
        if ($request->hasFile('foto')) {
            $file = $request->file('foto');
            $filename = 'user_' . $id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('images/usuarios'), $filename);
            $usuario->foto = '/images/usuarios/' . $filename;
        } else if ($request->has('foto') && is_string($request->foto)) {
            $usuario->foto = $request->foto;
        }
        
        $usuario->save();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Usuário atualizado com sucesso',
            'data' => $usuario
        ]);
    }

    /**
     * Alternar status de administrador
     */
    public function toggleAdmin(Request $request, $id)
    {
        $usuario = User::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'is_admin' => 'required|boolean',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }
        
        $usuario->is_admin = $request->is_admin;
        $usuario->save();
        
        return response()->json([
            'status' => 'success',
            'message' => $request->is_admin ? 'Usuário promovido a administrador' : 'Privilégios de administrador removidos',
            'data' => $usuario
        ]);
    }

    /**
     * Listar usuários online
     */
    public function online()
    {
        $usuarios = User::select('users.*')
            ->join('sessions', 'users.id', '=', 'sessions.user_id')
            ->where('sessions.last_activity', '>', Carbon::now()->subMinutes(15)->timestamp)
            ->distinct()
            ->get();
            
        return response()->json([
            'status' => 'success',
            'data' => $usuarios
        ]);
    }
}

