<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     * Stores one snapshot per user per (zone, period_type, period_key) for ranking by day/week/month/year.
     */
    public function up(): void
    {
        $tableName = (new \Kennofizet\RewardPlay\Models\UserRankingSnapshot())->getTable();

        Schema::create($tableName, function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('zone_id')->nullable();
            $table->string('period_type', 10); // day, week, month, year
            $table->string('period_key', 20); // Y-m-d, Y-Ww, Y-m, Y
            $table->unsignedBigInteger('coin')->default(0);
            $table->unsignedInteger('level')->default(1);
            $table->unsignedBigInteger('power')->default(0);
            $table->timestamps();

            $table->index(['zone_id', 'period_type', 'period_key'], 'idx_rank_zone_period');
            $table->unique(['user_id', 'zone_id', 'period_type', 'period_key'], 'uk_user_ranking_snapshot');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tableName = (new \Kennofizet\RewardPlay\Models\UserRankingSnapshot())->getTable();
        Schema::dropIfExists($tableName);
    }
};
