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
        $tableName = (new \Kennofizet\RewardPlay\Models\UserProfile())->getTable();

        if (!Schema::hasTable($tableName)) {
            Schema::create($tableName, function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id');
                $table->foreignId('zone_id')->nullable();
                $table->bigInteger('total_exp')->default(0);
                $table->bigInteger('current_exp')->default(0);
                $table->integer('lv')->default(1);
                $table->bigInteger('coin')->default(0);
                $table->bigInteger('ruby')->default(0);
                $table->timestamps();

                $table->index('user_id');
                $table->index('zone_id');
                $table->unique(['user_id', 'zone_id']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tableName = (new \Kennofizet\RewardPlay\Models\UserProfile())->getTable();
        Schema::dropIfExists($tableName);
    }
};
