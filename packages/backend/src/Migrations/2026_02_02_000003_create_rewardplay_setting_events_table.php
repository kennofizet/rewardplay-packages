<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Kennofizet\RewardPlay\Models\SettingEvent;

return new class extends Migration
{
    public function up(): void
    {
        $tableName = (new SettingEvent())->getTable();

        Schema::create($tableName, function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('zone_id')->nullable()->index();
            $table->string('name');
            $table->string('slug')->index();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->dateTime('time_start')->nullable();
            $table->dateTime('time_end')->nullable();
            $table->json('bonus')->nullable();
            $table->json('daily_reward_bonus')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['zone_id', 'slug'], 'uk_setting_events_zone_slug');
        });
    }

    public function down(): void
    {
        $tableName = (new SettingEvent())->getTable();
        Schema::dropIfExists($tableName);
    }
};
