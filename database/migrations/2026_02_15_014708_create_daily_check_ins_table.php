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
        Schema::create('daily_check_ins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('check_in_date');
            $table->string('daily_intention')->nullable();
            $table->string('if_then_plan')->nullable();
            $table->unsignedTinyInteger('craving_intensity')->nullable();
            $table->text('trigger_notes')->nullable();
            $table->text('reflection')->nullable();
            $table->boolean('slip_happened')->default(false);
            $table->timestamps();

            $table->unique(['user_id', 'check_in_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_check_ins');
    }
};
