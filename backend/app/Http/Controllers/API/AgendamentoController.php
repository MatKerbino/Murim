<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Agendamento;
use App\Models\Personal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AgendamentoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $agendamentos = Agendamento::with(['aluno', 'personal'])
            ->orderBy('data', 'desc')
            ->get();
            
        return response()->json([
            'status' => 'success',
            'data' => $agendamentos
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'personal_id' => 'required|exists:personais,id',
            'data' => 'required|date|after_or_equal:today',
            'horario' => 'required|string',
            'observacoes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        // Verificar se o personal está disponível neste horário
        $existeAgendamento = Agendamento::where('personal_id', $request->personal_id)
            ->where('data', $request->data)
            ->where('horario', $request->horario)
            ->where('status', '!=', 'cancelado')
            ->exists();
            
        if ($existeAgendamento) {
            return response()->json([
                'status' => 'error',
                'message' => 'Este horário já está agendado para o personal selecionado'
            ], 422);
        }

        $agendamento = new Agendamento([
            'aluno_id' => Auth::id(),
            'personal_id' => $request->personal_id,
            'data' => $request->data,
            'horario' => $request->horario,
            'status' => 'pendente', // Todos os agendamentos começam como pendentes
            'observacoes' => $request->observacoes,
        ]);

        $agendamento->save();
        
        // Carregar relacionamentos
        $agendamento->load(['aluno', 'personal']);

        return response()->json([
            'status' => 'success',
            'message' => 'Agendamento criado com sucesso e aguardando aprovação',
            'data' => $agendamento
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $agendamento = Agendamento::with(['aluno', 'personal'])->find($id);

        if (!$agendamento) {
            return response()->json([
                'status' => 'error',
                'message' => 'Agendamento não encontrado'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $agendamento
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $agendamento = Agendamento::find($id);

        if (!$agendamento) {
            return response()->json([
                'status' => 'error',
                'message' => 'Agendamento não encontrado'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'personal_id' => 'sometimes|required|exists:personais,id',
            'data' => 'sometimes|required|date|after_or_equal:today',
            'horario' => 'sometimes|required|string',
            'status' => 'sometimes|required|in:pendente,confirmado,cancelado',
            'observacoes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        // Se estiver alterando data, horário ou personal, verificar disponibilidade
        if (($request->has('data') || $request->has('horario') || $request->has('personal_id')) &&
            $request->status !== 'cancelado') {
            
            $data = $request->data ?? $agendamento->data;
            $horario = $request->horario ?? $agendamento->horario;
            $personalId = $request->personal_id ?? $agendamento->personal_id;
            
            $existeAgendamento = Agendamento::where('personal_id', $personalId)
                ->where('data', $data)
                ->where('horario', $horario)
                ->where('status', '!=', 'cancelado')
                ->where('id', '!=', $agendamento->id)
                ->exists();
                
            if ($existeAgendamento) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Este horário já está agendado para o personal selecionado'
                ], 422);
            }
        }

        $agendamento->update($request->all());
        
        // Carregar relacionamentos
        $agendamento->load(['aluno', 'personal']);

        return response()->json([
            'status' => 'success',
            'message' => 'Agendamento atualizado com sucesso',
            'data' => $agendamento
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $agendamento = Agendamento::find($id);

        if (!$agendamento) {
            return response()->json([
                'status' => 'error',
                'message' => 'Agendamento não encontrado'
            ], 404);
        }

        $agendamento->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Agendamento excluído com sucesso'
        ]);
    }
    
    /**
     * Listar agendamentos do usuário logado
     */
    public function meusAgendamentos()
    {
        $agendamentos = Agendamento::with('personal')
            ->where('aluno_id', Auth::id())
            ->orderBy('data', 'desc')
            ->get();
            
        return response()->json([
            'status' => 'success',
            'data' => $agendamentos
        ]);
    }
    
    /**
     * Aprovar ou rejeitar um agendamento (apenas admin)
     */
    public function aprovar(Request $request, $id)
    {
        $agendamento = Agendamento::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:confirmado,cancelado',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }
        
        $agendamento->status = $request->status;
        $agendamento->save();
        
        return response()->json([
            'status' => 'success',
            'message' => $request->status === 'confirmado' 
                ? 'Agendamento confirmado com sucesso' 
                : 'Agendamento cancelado com sucesso',
            'data' => $agendamento
        ]);
    }
}

