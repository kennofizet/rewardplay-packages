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
        $tableName = (new \Kennofizet\RewardPlay\Models\UserEventTransaction())->getTable();

        Schema::create($tableName, function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('zone_id')->nullable();
            $table->string('model_type'); // Class name of the model (e.g., SettingDailyReward)
            $table->unsignedBigInteger('model_id'); // ID of the model instance
            $table->json('items')->nullable(); // Items/rewards collected
            $table->timestamps();

            // Indexes with shorter names to avoid MySQL 64 character limit
            $table->index('user_id', 'idx_user_id');
            $table->index('zone_id', 'idx_zone_id');
            $table->index(['model_type', 'model_id'], 'idx_model');
            $table->index(['user_id', 'model_type', 'model_id'], 'idx_user_model');
            
            // Unique constraint: prevent duplicate claims for same user, zone, and model
            $table->unique(['user_id', 'zone_id', 'model_type', 'model_id'], 'uk_user_event');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tableName = (new \Kennofizet\RewardPlay\Models\UserEventTransaction())->getTable();
        Schema::dropIfExists($tableName);
    }
};
