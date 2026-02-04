<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $tableName = config('rewardplay.table_prefix', '') . 'rewardplay_setting_event_items';

        Schema::create($tableName, function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('event_id')->index();
            $table->unsignedBigInteger('setting_item_id')->index();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['event_id', 'setting_item_id'], 'uk_event_item');
        });
    }

    public function down(): void
    {
        $tableName = config('rewardplay.table_prefix', '') . 'rewardplay_setting_event_items';
        Schema::dropIfExists($tableName);
    }
};
