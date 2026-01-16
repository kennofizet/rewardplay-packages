<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Kennofizet\RewardPlay\Models\SettingOption;
use Kennofizet\RewardPlay\Models\Zone;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        $settingOptionsTableName = (new SettingOption())->getTable();
        $zonesTableName = (new Zone())->getTable();

        Schema::table($settingOptionsTableName, function (Blueprint $table) use ($zonesTableName) {
            $table->unsignedBigInteger('zone_id')->nullable()->after('name');
            $table->index('zone_id');
            
            // Foreign key
            $table->foreign('zone_id')->references('id')->on($zonesTableName)->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        $settingOptionsTableName = (new SettingOption())->getTable();

        Schema::table($settingOptionsTableName, function (Blueprint $table) {
            $table->dropForeign(['zone_id']);
            $table->dropIndex(['zone_id']);
            $table->dropColumn('zone_id');
        });
    }
};
