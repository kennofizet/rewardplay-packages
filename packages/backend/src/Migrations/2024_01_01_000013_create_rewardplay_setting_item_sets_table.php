<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Kennofizet\RewardPlay\Models\SettingItemSet;
use Kennofizet\RewardPlay\Models\Zone;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        $settingItemSetsTableName = (new SettingItemSet())->getTable();
        $zonesTableName = (new Zone())->getTable();

        Schema::create($settingItemSetsTableName, function (Blueprint $table) use ($zonesTableName) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->json('set_bonuses')->nullable(); // JSON: {2: {power: 10, cv: 5}, 3: {power: 20, cv: 10}, full: {power: 50, cv: 25}}
            $table->unsignedBigInteger('zone_id')->nullable();
            $table->timestamps();

            // Foreign key
            $table->foreign('zone_id')->references('id')->on($zonesTableName)->onDelete('cascade');

            // Indexes
            $table->index('name');
            $table->index('zone_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        $settingItemSetsTableName = (new SettingItemSet())->getTable();

        Schema::dropIfExists($settingItemSetsTableName);
    }
};
