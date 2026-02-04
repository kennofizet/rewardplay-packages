<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Kennofizet\RewardPlay\Models\SettingOption;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        $settingOptionsTableName = (new SettingOption())->getTable();

        Schema::create($settingOptionsTableName, function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->json('rates')->nullable(); // JSON data: {power: 1.5, cv: 2.0, crit: 0.8, ...}
            $table->timestamps();

            $table->index('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        $settingOptionsTableName = (new SettingOption())->getTable();

        Schema::dropIfExists($settingOptionsTableName);
    }
};
