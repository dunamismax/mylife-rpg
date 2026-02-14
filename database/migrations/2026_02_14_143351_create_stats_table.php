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
        Schema::create('stats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->unsignedInteger('level')->default(1);
            $table->unsignedInteger('xp')->default(0);
            $table->unsignedInteger('hp')->default(100);
            $table->unsignedInteger('strength')->default(10);
            $table->unsignedInteger('endurance')->default(10);
            $table->unsignedInteger('intelligence')->default(10);
            $table->unsignedInteger('wisdom')->default(10);
            $table->unsignedInteger('charisma')->default(10);
            $table->unsignedInteger('willpower')->default(10);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stats');
    }
};
