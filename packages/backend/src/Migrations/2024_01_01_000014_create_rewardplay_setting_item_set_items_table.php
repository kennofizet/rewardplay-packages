<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Kennofizet\RewardPlay\Models\SettingItemSetItem;
use Kennofizet\RewardPlay\Models\SettingItemSet;
use Kennofizet\RewardPlay\Models\SettingItem;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        $pivotTableName = (new SettingItemSetItem())->getTable();
        $setsTableName = (new SettingItemSet())->getTable();
        $itemsTableName = (new SettingItem())->getTable();

        Schema::create($pivotTableName, function (Blueprint $table) use ($setsTableName, $itemsTableName) {
            $table->id();
            $table->unsignedBigInteger('set_id');
            $table->unsignedBigInteger('item_id');
            $table->timestamps();

            // Foreign keys
            $table->foreign('set_id')->references('id')->on($setsTableName)->onDelete('cascade');
            $table->foreign('item_id')->references('id')->on($itemsTableName)->onDelete('cascade');

            // Unique constraint: each item can only be in a set once
            $table->unique(['set_id', 'item_id']);

            // Indexes
            $table->index('set_id');
            $table->index('item_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        $pivotTableName = (new SettingItemSetItem())->getTable();

        Schema::dropIfExists($pivotTableName);
    }
};
