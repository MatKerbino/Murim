<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Curtida;
use App\Models\Dica;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CurtidaController extends Controller
{
    /**
     * Curtir ou descurtir uma dica
     */
    public function toggle($dicaId)
    {
        $dica = Dica::findOrFail($dicaId);
        
        $curtida = Curtida::where('dica_id', $dica->id)
            ->where('user_id', Auth::id())
            ->first();
            
        if ($curtida) {
            // Se já curtiu, remove a curtida
            $curtida->delete();
            $message = 'Curtida removida com sucesso';
            $status = false;
        } else {
            // Se não curtiu, adiciona a curtida
            $curtida = new Curtida([
                'dica_id' => $dica->id,
                'user_id' => Auth::id(),
            ]);
            $curtida->save();
            $message = 'Dica curtida com sucesso';
            $status = true;
        }
        
        // Retorna o número atualizado de curtidas
        $totalCurtidas = $dica->curtidas()->count();
        
        return response()->json([
            'status' => 'success',
            'message' => $message,
            'data' => [
                'curtido' => $status,
                'total_curtidas' => $totalCurtidas
            ]
        ]);
    }
    
    /**
     * Verificar se o usuário curtiu uma dica
     */
    public function verificar($dicaId)
    {
        $dica = Dica::findOrFail($dicaId);
        
        $curtido = Curtida::where('dica_id', $dica->id)
            ->where('user_id', Auth::id())
            ->exists();
            
        $totalCurtidas = $dica->curtidas()->count();
        
        return response()->json([
            'status' => 'success',
            'data' => [
                'curtido' => $curtido,
                'total_curtidas' => $totalCurtidas
            ]
        ]);
    }
}

