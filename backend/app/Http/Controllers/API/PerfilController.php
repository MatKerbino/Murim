<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class PerfilController extends Controller
{
    /**
     * Exibir perfil do usuário logado
     */
    public function show()
    {
        $user = Auth::user();
        
        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }
    
    /**
     * Atualizar perfil do usuário logado
     */
    public function update(Request $request)
    {
        $user = Auth::user();
        
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|max:255|unique:users,email,' . $user->id,
            'current_password' => 'required_with:password|string',
            'password' => 'sometimes|required|string|min:8|confirmed',
            'foto' => 'nullable|image|max:2048',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }
        
        // Se estiver alterando a senha, verificar a senha atual
        if ($request->has('password')) {
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'A senha atual está incorreta',
                    'errors' => [
                        'current_password' => ['A senha atual está incorreta']
                    ]
                ], 422);
            }
            
            $user->password = Hash::make($request->password);
        }
        
        if ($request->has('name')) {
            $user->name = $request->name;
        }
        
        if ($request->has('email')) {
            $user->email = $request->email;
        }
        
        // Processar upload de foto
        if ($request->hasFile('foto')) {
            $file = $request->file('foto');
            $filename = 'user_' . $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('images/usuarios'), $filename);
            $user->foto = '/images/usuarios/' . $filename;
        } else if ($request->has('foto') && is_string($request->foto)) {
            $user->foto = $request->foto;
        }
        
        $user->save();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Perfil atualizado com sucesso',
            'data' => $user
        ]);
    }
}

