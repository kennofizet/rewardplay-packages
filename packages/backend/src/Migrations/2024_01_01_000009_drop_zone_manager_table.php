<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Kennofizet\RewardPlay\Models\ZoneManager;
use Kennofizet\RewardPlay\Models\Zone;
use Kennofizet\RewardPlay\Models\User;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        $zoneManagerTableName = (new ZoneManager())->getTable();

        Schema::dropIfExists($zoneManagerTableName);
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        $zoneManagerTableName = (new ZoneManager())->getTable();
        $userTable = (new User())->getTable();
        $zonesTableName = (new Zone())->getTable();

        Schema::create($zoneManagerTableName, function (Blueprint $table) use ($userTable, $zonesTableName) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('zone_id');
            $table->timestamps();

            // Foreign keys
            $table->foreign('user_id')->references('id')->on($userTable)->onDelete('cascade');
            $table->foreign('zone_id')->references('id')->on($zonesTableName)->onDelete('cascade');

            // Unique constraint: each zone can have only one manager
            $table->unique('zone_id');

            // Indexes
            $table->index('user_id');
            $table->index('zone_id');
        });
    }
};
