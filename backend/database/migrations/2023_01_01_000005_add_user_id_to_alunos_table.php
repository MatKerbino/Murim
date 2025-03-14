<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('alunos', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained('users')->after('id'); // Adiciona a coluna user_id
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('alunos', function (Blueprint $table) {
            $table->dropForeign(['user_id']); // Remove a chave estrangeira
            $table->dropColumn('user_id'); // Remove a coluna user_id
        });
    }
}; 