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
        $tableName = (new \Kennofizet\RewardPlay\Models\UserBagItem())->getTable();

        if (!Schema::hasTable($tableName)) {
            Schema::create($tableName, function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id'); // Relation to rewardplay_users (or main user table depending on architecture)
                $table->foreignId('item_id'); // Relation to setting_items
                $table->integer('quantity')->default(1);
                $table->json('properties')->nullable(); // Unique properties for this instance (e.g. durability)
                $table->timestamp('acquired_at')->useCurrent();
                $table->timestamps();

                $table->index('user_id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tableName = (new \Kennofizet\RewardPlay\Models\UserBagItem())->getTable();
        Schema::dropIfExists($tableName);
    }
};
