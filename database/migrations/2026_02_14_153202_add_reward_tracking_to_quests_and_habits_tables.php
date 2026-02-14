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
        Schema::table('quests', function (Blueprint $table) {
            $table->timestamp('xp_rewarded_at')->nullable()->after('completed_at');
        });

        Schema::table('habits', function (Blueprint $table) {
            $table->date('xp_rewarded_on')->nullable()->after('last_completed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('habits', function (Blueprint $table) {
            $table->dropColumn('xp_rewarded_on');
        });

        Schema::table('quests', function (Blueprint $table) {
            $table->dropColumn('xp_rewarded_at');
        });
    }
};
