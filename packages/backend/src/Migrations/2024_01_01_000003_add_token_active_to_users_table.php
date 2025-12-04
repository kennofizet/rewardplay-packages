<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Get table name from config
     */
    protected function getTableName()
    {
        return config('rewardplay.table_user', 'users');
    }

    /**
     * Get token active column name from config
     */
    protected function getTokenActiveColumnName()
    {
        return config('rewardplay.token_active_name', 'token_active');
    }

    /**
     * Run the migrations.
     */
    public function up()
    {
        $tableName = $this->getTableName();
        $tokenActiveColumnName = $this->getTokenActiveColumnName();

        // Check if column already exists
        if (Schema::hasColumn($tableName, $tokenActiveColumnName)) {
            throw new \Exception(
                "Column '{$tokenActiveColumnName}' already exists in table '{$tableName}'. " .
                "Migration cannot proceed. Please check your configuration."
            );
        }

        // Get token column name
        $tokenColumnName = config('rewardplay.token_name', 'rewardpay_token');

        // Add token_active column after token column
        Schema::table($tableName, function (Blueprint $table) use ($tokenActiveColumnName, $tokenColumnName) {
            if (Schema::hasColumn($table->getTable(), $tokenColumnName)) {
                $table->tinyInteger($tokenActiveColumnName)
                    ->default(1)
                    ->after($tokenColumnName)
                    ->comment('Token active status: 1 = active, 0 = inactive');
            } else {
                $table->tinyInteger($tokenActiveColumnName)
                    ->default(1)
                    ->comment('Token active status: 1 = active, 0 = inactive');
            }
        });

        // Set all existing tokens as active
        DB::table($tableName)
            ->whereNotNull($tokenColumnName)
            ->update([$tokenActiveColumnName => 1]);
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        $tableName = $this->getTableName();
        $tokenActiveColumnName = $this->getTokenActiveColumnName();

        if (Schema::hasColumn($tableName, $tokenActiveColumnName)) {
            Schema::table($tableName, function (Blueprint $table) use ($tokenActiveColumnName) {
                $table->dropColumn($tokenActiveColumnName);
            });
        }
    }
};

