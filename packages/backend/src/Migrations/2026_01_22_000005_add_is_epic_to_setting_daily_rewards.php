<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Kennofizet\RewardPlay\Models\SettingDailyReward;

return new class extends Migration {
    public function up()
    {
        $tableName = (new SettingDailyReward())->getTable();

        Schema::table($tableName, function (Blueprint $table) {
            $table->boolean('is_epic')->default(false)->after('is_active');
        });
    }

    public function down()
    {
        $tableName = (new SettingDailyReward())->getTable();

        Schema::table($tableName, function (Blueprint $table) {
            $table->dropColumn('is_epic');
        });
    }
};
