<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Kennofizet\RewardPlay\Models\ServerManager;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Make server_managers.server_id nullable (e.g. for "no server" / global managers).
     */
    public function up(): void
    {
        $tableName = (new ServerManager())->getTable();

        if (Schema::hasTable($tableName)) {
            Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                $table->unsignedBigInteger('server_id')->nullable()->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tableName = (new ServerManager())->getTable();

        if (Schema::hasTable($tableName)) {
            Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                $table->unsignedBigInteger('server_id')->nullable(false)->change();
            });
        }
    }
};
