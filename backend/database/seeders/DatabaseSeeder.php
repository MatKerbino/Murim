<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\DiaSemana;
use App\Models\CategoriaDica;
use App\Models\CategoriaProduto;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Criar usuário administrador
        User::create([
            'name' => 'Administrador',
            'email' => 'admin@academiamurim.com',
            'password' => Hash::make('password'),
            'is_admin' => true,
        ]);

        // Criar dias da semana
        $diasSemana = [
            ['nome' => 'Segunda-feira', 'ordem' => 1],
            ['nome' => 'Terça-feira', 'ordem' => 2],
            ['nome' => 'Quarta-feira', 'ordem' => 3],
            ['nome' => 'Quinta-feira', 'ordem' => 4],
            ['nome' => 'Sexta-feira', 'ordem' => 5],
            ['nome' => 'Sábado', 'ordem' => 6],
            ['nome' => 'Domingo', 'ordem' => 7],
        ];

        foreach ($diasSemana as $dia) {
            DiaSemana::create($dia);
        }

        // Criar categorias de dicas
        $categoriasDicas = [
            ['nome' => 'Desempenho', 'slug' => 'desempenho', 'descricao' => 'Dicas para melhorar seu desempenho nos treinos'],
            ['nome' => 'Nutrição', 'slug' => 'nutricao', 'descricao' => 'Dicas de alimentação para complementar seus treinos'],
            ['nome' => 'Vestuário', 'slug' => 'vestuario', 'descricao' => 'Dicas sobre roupas e acessórios para treinos'],
        ];

        foreach ($categoriasDicas as $categoria) {
            CategoriaDica::create($categoria);
        }

        // Criar categorias de produtos
        $categoriasProdutos = [
            ['nome' => 'Vestuário', 'descricao' => 'Roupas para treino'],
            ['nome' => 'Suplementos', 'descricao' => 'Suplementos alimentares'],
            ['nome' => 'Acessórios', 'descricao' => 'Acessórios para treino'],
            ['nome' => 'Calçados', 'descricao' => 'Calçados esportivos'],
        ];

        foreach ($categoriasProdutos as $categoria) {
            CategoriaProduto::create($categoria);
        }
    }
}

