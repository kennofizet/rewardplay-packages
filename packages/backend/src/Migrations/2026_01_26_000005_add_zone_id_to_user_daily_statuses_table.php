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
        $tableName = (new \Kennofizet\RewardPlay\Models\UserDailyStatus())->getTable();

        if (Schema::hasTable($tableName)) {
            Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                if (!Schema::hasColumn($tableName, 'zone_id')) {
                    $table->unsignedBigInteger('zone_id')->nullable()->after('user_id');
                    $table->index('zone_id', 'idx_zone_id');
                    // Update unique constraint to include zone_id
                    $table->dropUnique(['user_id']);
                    $table->unique(['user_id', 'zone_id'], 'uk_user_zone');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tableName = (new \Kennofizet\RewardPlay\Models\UserDailyStatus())->getTable();

        if (Schema::hasTable($tableName)) {
            Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                if (Schema::hasColumn($tableName, 'zone_id')) {
                    $table->dropUnique('uk_user_zone');
                    $table->unique('user_id');
                    $table->dropIndex('idx_zone_id');
                    $table->dropColumn('zone_id');
                }
            });
        }
    }
};
