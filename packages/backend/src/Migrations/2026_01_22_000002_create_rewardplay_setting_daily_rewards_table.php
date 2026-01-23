<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $tableName = (new \Kennofizet\RewardPlay\Models\SettingDailyReward())->getTable();

        if (!Schema::hasTable($tableName)) {
            Schema::create($tableName, function (Blueprint $table) {
                $table->id();
                $table->date('date')->unique(); // Date based (2021-2031)
                $table->json('items')->nullable(); // Array of item IDs
                $table->json('stack_bonuses')->nullable(); // Array of StackBonus IDs
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tableName = (new \Kennofizet\RewardPlay\Models\SettingDailyReward())->getTable();
        Schema::dropIfExists($tableName);
    }
};
