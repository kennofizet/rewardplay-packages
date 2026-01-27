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

        if (Schema::hasTable($tableName)) {
            Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                if (!Schema::hasColumn($tableName, 'item_type')) {
                    $table->string('item_type', 50)->nullable()->after('item_id');
                    $table->index('item_type', 'idx_item_type');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tableName = (new \Kennofizet\RewardPlay\Models\UserBagItem())->getTable();

        if (Schema::hasTable($tableName)) {
            Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                if (Schema::hasColumn($tableName, 'item_type')) {
                    $table->dropIndex('idx_item_type');
                    $table->dropColumn('item_type');
                }
            });
        }
    }
};
