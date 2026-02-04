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
        $tableName = (new \Kennofizet\RewardPlay\Models\SettingLevelExp())->getTable();

        if (!Schema::hasTable($tableName)) {
            Schema::create($tableName, function (Blueprint $table) {
                $table->id();
                $table->integer('lv');
                $table->bigInteger('exp_needed');
                $table->foreignId('zone_id')->nullable();
                $table->timestamps();

                $table->index('zone_id');
                $table->index('lv');
                $table->unique(['lv', 'zone_id']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tableName = (new \Kennofizet\RewardPlay\Models\SettingLevelExp())->getTable();
        Schema::dropIfExists($tableName);
    }
};
