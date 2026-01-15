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

        Schema::table($settingsItemsTableName, function (Blueprint $table) {
            // Drop old columns
            $table->dropUnique(['key']);
            $table->dropColumn(['key', 'value']);
            
            // Add new columns
            $table->string('name')->after('id');
            $table->string('slug')->unique()->after('name');
            $table->json('default_property')->nullable()->after('description');
            $table->string('image')->nullable()->after('default_property');
            $table->unsignedBigInteger('zone_id')->nullable()->after('image');
            $table->unsignedBigInteger('zone_manager_id')->nullable()->after('zone_id');
            
            // Add indexes
            $table->index('slug');
            $table->index('zone_id');
            $table->index('zone_manager_id');
            $table->index(['zone_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        $tablePrefix = config('rewardplay.table_prefix', '');
        $settingsItemsTableName = $tablePrefix . 'rewardplay_settings_items';

        Schema::table($settingsItemsTableName, function (Blueprint $table) {
            // Drop new columns
            $table->dropIndex(['zone_id', 'type']);
            $table->dropIndex(['zone_manager_id']);
            $table->dropIndex(['zone_id']);
            $table->dropIndex(['slug']);
            $table->dropColumn(['name', 'slug', 'default_property', 'image', 'zone_id', 'zone_manager_id']);
            
            // Restore old columns
            $table->string('key')->unique()->after('id');
            $table->text('value')->nullable()->after('key');
        });
    }
};

