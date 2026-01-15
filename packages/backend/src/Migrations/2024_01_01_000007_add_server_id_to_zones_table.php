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

        Schema::table($zonesTableName, function (Blueprint $table) use ($zonesTableName) {
            if (!Schema::hasColumn($zonesTableName, 'server_id')) {
                $table->unsignedBigInteger('server_id')->nullable()->after('name');
                $table->index('server_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        $tablePrefix = config('rewardplay.table_prefix', '');
        $zonesTableName = $tablePrefix . 'rewardplay_zones';

        Schema::table($zonesTableName, function (Blueprint $table) use ($zonesTableName) {
            if (Schema::hasColumn($zonesTableName, 'server_id')) {
                $table->dropIndex(['server_id']);
                $table->dropColumn('server_id');
            }
        });
    }
};
