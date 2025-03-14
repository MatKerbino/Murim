<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\CarrinhoItem;
use App\Models\Produto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CarrinhoController extends Controller
{
    /**
     * Obter itens do carrinho do usuário atual
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $carrinhoItems = CarrinhoItem::with('produto')
            ->where('user_id', $user->id)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $carrinhoItems
        ]);
    }

    /**
     * Adicionar item ao carrinho
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'produto_id' => 'required|exists:produtos,id',
            'quantidade' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $produto = Produto::findOrFail($request->produto_id);

        // Verificar se o produto já está no carrinho
        $carrinhoItem = CarrinhoItem::where('user_id', $user->id)
            ->where('produto_id', $produto->id)
            ->first();

        if ($carrinhoItem) {
            // Atualizar quantidade se já existir
            $carrinhoItem->quantidade += $request->quantidade;
            $carrinhoItem->save();
        } else {
            // Criar novo item no carrinho
            $carrinhoItem = CarrinhoItem::create([
                'user_id' => $user->id,
                'produto_id' => $produto->id,
                'quantidade' => $request->quantidade,
            ]);
        }

        // Carregar o relacionamento com o produto
        $carrinhoItem->load('produto');

        return response()->json([
            'status' => 'success',
            'message' => 'Produto adicionado ao carrinho',
            'data' => $carrinhoItem
        ], 201);
    }

    /**
     * Atualizar quantidade de um item no carrinho
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'quantidade' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $carrinhoItem = CarrinhoItem::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $carrinhoItem->quantidade = $request->quantidade;
        $carrinhoItem->save();

        // Carregar o relacionamento com o produto
        $carrinhoItem->load('produto');

        return response()->json([
            'status' => 'success',
            'message' => 'Quantidade atualizada',
            'data' => $carrinhoItem
        ]);
    }

    /**
     * Remover item do carrinho
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $carrinhoItem = CarrinhoItem::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $carrinhoItem->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Item removido do carrinho'
        ]);
    }

    /**
     * Limpar todo o carrinho do usuário
     */
    public function clear(Request $request)
    {
        $user = $request->user();
        CarrinhoItem::where('user_id', $user->id)->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Carrinho limpo com sucesso'
        ]);
    }
}

