<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Kennofizet\RewardPlay\Models\SettingItem;
use Kennofizet\RewardPlay\Models\ZoneManager;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        $settingsItemsTableName = (new SettingItem())->getTable();

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
        $settingsItemsTableName = (new SettingItem())->getTable();
        $zoneManagerTableName = (new ZoneManager())->getTable();

        Schema::table($settingsItemsTableName, function (Blueprint $table) use ($settingsItemsTableName, $zoneManagerTableName) {
            if (!Schema::hasColumn($settingsItemsTableName, 'zone_manager_id')) {
                $table->unsignedBigInteger('zone_manager_id')->nullable()->after('zone_id');
                $table->index('zone_manager_id');
                
                // Note: Foreign key removed since zone_manager table will be dropped
            }
        });
    }
};
