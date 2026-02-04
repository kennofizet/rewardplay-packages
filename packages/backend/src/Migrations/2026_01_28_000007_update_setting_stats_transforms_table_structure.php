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
        $model = new class extends \Kennofizet\RewardPlay\Core\Model\BaseModel {
            public function getTable() {
                return self::getPivotTableName('rewardplay_setting_stats_transforms');
            }
        };
        $tableName = $model->getTable();

        if (Schema::hasTable($tableName)) {
            Schema::table($tableName, function (Blueprint $table) {
                // Drop old columns
                $table->dropColumn(['source_keys', 'conversion_value']);
                
                // Add new column for conversions (array of {source_key, conversion_value})
                $table->json('conversions')->nullable()->after('target_key');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $model = new class extends \Kennofizet\RewardPlay\Core\Model\BaseModel {
            public function getTable() {
                return self::getPivotTableName('rewardplay_setting_stats_transforms');
            }
        };
        $tableName = $model->getTable();

        if (Schema::hasTable($tableName)) {
            Schema::table($tableName, function (Blueprint $table) {
                // Drop new column
                $table->dropColumn('conversions');
                
                // Restore old columns
                $table->json('source_keys')->nullable()->after('target_key');
                $table->decimal('conversion_value', 10, 4)->default(1.0)->after('source_keys');
            });
        }
    }
};
