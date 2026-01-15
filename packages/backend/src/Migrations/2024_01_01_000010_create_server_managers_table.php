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
        $serverManagersTableName = $tablePrefix . 'rewardplay_server_managers';
        $userTable = config('rewardplay.table_user', 'users');

        Schema::create($serverManagersTableName, function (Blueprint $table) use ($userTable) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('server_id');
            $table->timestamps();

            // Foreign keys
            $table->foreign('user_id')->references('id')->on($userTable)->onDelete('cascade');

            // Unique constraint: each user can only manage a server once
            $table->unique(['user_id', 'server_id']);

            // Indexes
            $table->index('user_id');
            $table->index('server_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        $tablePrefix = config('rewardplay.table_prefix', '');
        $serverManagersTableName = $tablePrefix . 'rewardplay_server_managers';

        Schema::dropIfExists($serverManagersTableName);
    }
};
