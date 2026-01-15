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
        $tablePrefix = config('rewardplay.table_prefix', '');
        $settingsItemsTableName = $tablePrefix . 'rewardplay_settings_items';

        Schema::dropIfExists($settingsItemsTableName);
    }
};

