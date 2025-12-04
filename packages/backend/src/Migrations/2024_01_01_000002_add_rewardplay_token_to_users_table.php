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
     * Get token column name from config
     */
    protected function getTokenColumnName()
    {
        return config('rewardplay.token_name', 'rewardpay_token');
    }

    /**
     * Run the migrations.
     */
    public function up()
    {
        $tableName = $this->getTableName();
        $tokenColumnName = $this->getTokenColumnName();

        // Check if column already exists
        if (Schema::hasColumn($tableName, $tokenColumnName)) {
            throw new \Exception(
                "Column '{$tokenColumnName}' already exists in table '{$tableName}'. " .
                "Migration cannot proceed. Please check your configuration."
            );
        }

        // Add token column after id
        Schema::table($tableName, function (Blueprint $table) use ($tokenColumnName) {
            $table->string($tokenColumnName, 64)
                ->nullable()
                ->after('id')
                ->index();
        });

        $this->generateTokensForExistingUsers();
    }

    /**
     * Generate tokens for all existing users
     */
    protected function generateTokensForExistingUsers()
    {
        $tableName = $this->getTableName();
        $tokenColumn = $this->getTokenColumnName();
        $chunkSize = 100;

        DB::table($tableName)
            ->whereNull($tokenColumn)
            ->orderBy('id')
            ->chunk($chunkSize, function ($users) use ($tableName, $tokenColumn) {
                foreach ($users as $user) {
                    $token = $this->generateToken();
                    DB::table($tableName)
                        ->where('id', $user->id)
                        ->update([$tokenColumn => $token]);
                }
            });
    }

    /**
     * Generate a unique token
     */
    protected function generateToken()
    {
        $tableName = $this->getTableName();
        $tokenColumn = $this->getTokenColumnName();

        do {
            $token = bin2hex(random_bytes(32)); // 64 character hex string
            $exists = DB::table($tableName)
                ->where($tokenColumn, $token)
                ->exists();
        } while ($exists);

        return $token;
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        $tableName = $this->getTableName();
        $tokenColumnName = $this->getTokenColumnName();

        if (Schema::hasColumn($tableName, $tokenColumnName)) {
            Schema::table($tableName, function (Blueprint $table) use ($tokenColumnName) {
                $table->dropColumn($tokenColumnName);
            });
        }
    }
};

