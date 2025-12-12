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
        $zonesTableName = $tablePrefix . 'rewardplay_zones';

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
        $tablePrefix = config('rewardplay.table_prefix', '');
        $zonesTableName = $tablePrefix . 'rewardplay_zones';

        Schema::dropIfExists($zonesTableName);
    }
};

