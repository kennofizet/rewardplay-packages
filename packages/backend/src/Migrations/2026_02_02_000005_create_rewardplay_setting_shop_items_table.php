<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $tableName = config('rewardplay.table_prefix', '') . 'rewardplay_setting_shop_items';

        Schema::create($tableName, function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('zone_id')->nullable()->index();
            $table->unsignedBigInteger('setting_item_id')->index();
            $table->unsignedBigInteger('event_id')->nullable()->index();
            $table->string('category', 64)->default('gear')->index();
            $table->json('prices')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->dateTime('time_start')->nullable();
            $table->dateTime('time_end')->nullable();
            $table->json('options')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['zone_id', 'category']);
        });
    }

    public function down(): void
    {
        $tableName = config('rewardplay.table_prefix', '') . 'rewardplay_setting_shop_items';
        Schema::dropIfExists($tableName);
    }
};
