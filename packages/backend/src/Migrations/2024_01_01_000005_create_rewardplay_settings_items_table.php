<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Kennofizet\RewardPlay\Models\SettingItem;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        $settingsItemsTableName = (new SettingItem())->getTable();

        Schema::create($settingsItemsTableName, function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->text('description')->nullable();
            $table->string('type')->default('string'); // string, integer, boolean, json, etc.
            $table->timestamps();

            $table->index('key');
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        $settingsItemsTableName = (new SettingItem())->getTable();

        Schema::dropIfExists($settingsItemsTableName);
    }
};

