<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Kennofizet\RewardPlay\Models\Zone;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        $zonesTableName = (new Zone())->getTable();

        Schema::create($zonesTableName, function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();

            $table->index('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        $zonesTableName = (new Zone())->getTable();

        Schema::dropIfExists($zonesTableName);
    }
};

