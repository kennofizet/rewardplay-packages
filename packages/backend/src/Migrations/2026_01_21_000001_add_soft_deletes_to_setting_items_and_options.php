<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Kennofizet\RewardPlay\Models\SettingItem;
use Kennofizet\RewardPlay\Models\SettingOption;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $settingItemsTable = (new SettingItem())->getTable();
        $settingOptionsTable = (new SettingOption())->getTable();

        if (Schema::hasTable($settingItemsTable)) {
            Schema::table($settingItemsTable, function (Blueprint $table) {
                // Adds nullable deleted_at timestamp
                $table->softDeletes();
            });
        }

        if (Schema::hasTable($settingOptionsTable)) {
            Schema::table($settingOptionsTable, function (Blueprint $table) {
                $table->softDeletes();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $settingItemsTable = (new SettingItem())->getTable();
        $settingOptionsTable = (new SettingOption())->getTable();

        if (Schema::hasTable($settingItemsTable)) {
            Schema::table($settingItemsTable, function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }

        if (Schema::hasTable($settingOptionsTable)) {
            Schema::table($settingOptionsTable, function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }
    }
};
