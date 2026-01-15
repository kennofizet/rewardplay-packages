<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        $tablePrefix = config('rewardplay.table_prefix', '');
        $settingsItemsTableName = $tablePrefix . 'rewardplay_settings_items';

        Schema::table($settingsItemsTableName, function (Blueprint $table) use ($settingsItemsTableName) {
            if (Schema::hasColumn($settingsItemsTableName, 'zone_manager_id')) {
                $table->dropIndex(['zone_manager_id']);
                $table->dropColumn('zone_manager_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        $tablePrefix = config('rewardplay.table_prefix', '');
        $settingsItemsTableName = $tablePrefix . 'rewardplay_settings_items';
        $zoneManagerTableName = $tablePrefix . 'rewardplay_zone_manager';

        Schema::table($settingsItemsTableName, function (Blueprint $table) use ($settingsItemsTableName, $zoneManagerTableName) {
            if (!Schema::hasColumn($settingsItemsTableName, 'zone_manager_id')) {
                $table->unsignedBigInteger('zone_manager_id')->nullable()->after('zone_id');
                $table->index('zone_manager_id');
                
                // Note: Foreign key removed since zone_manager table will be dropped
            }
        });
    }
};
