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
        $zoneUsersTableName = $tablePrefix . 'rewardplay_zone_users';
        $userTable = config('rewardplay.table_user', 'users');
        $zonesTableName = $tablePrefix . 'rewardplay_zones';

        Schema::create($zoneUsersTableName, function (Blueprint $table) use ($userTable, $zonesTableName) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('zone_id');
            $table->timestamps();

            // Foreign keys
            $table->foreign('user_id')->references('id')->on($userTable)->onDelete('cascade');
            $table->foreign('zone_id')->references('id')->on($zonesTableName)->onDelete('cascade');

            // Unique constraint: each user can only be in a zone once
            $table->unique(['user_id', 'zone_id']);

            // Indexes
            $table->index('user_id');
            $table->index('zone_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        $tablePrefix = config('rewardplay.table_prefix', '');
        $zoneUsersTableName = $tablePrefix . 'rewardplay_zone_users';

        Schema::dropIfExists($zoneUsersTableName);
    }
};
