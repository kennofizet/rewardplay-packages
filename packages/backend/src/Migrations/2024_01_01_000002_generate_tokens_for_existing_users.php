<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Get tokens table name
     */
    protected function getTokensTableName()
    {
        $tablePrefix = config('rewardplay.table_prefix', '');
        return $tablePrefix . 'rewardplay_tokens';
    }

    /**
     * Get user table name from config
     */
    protected function getUserTableName()
    {
        return config('rewardplay.table_user', 'users');
    }

    /**
     * Generate a unique token
     */
    protected function generateUniqueToken($tokensTableName)
    {
        do {
            $token = bin2hex(random_bytes(32)); // 64 character hex string
            $exists = DB::table($tokensTableName)
                ->where('token', $token)
                ->exists();
        } while ($exists);

        return $token;
    }

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $tokensTableName = $this->getTokensTableName();
        $userTableName = $this->getUserTableName();

        // Check if tokens table exists
        if (!DB::getSchemaBuilder()->hasTable($tokensTableName)) {
            throw new \Exception("Table '{$tokensTableName}' does not exist. Please run the create_rewardplay_tokens_table migration first.");
        }

        // Get all users
        $users = DB::table($userTableName)->get();

        if ($users->isEmpty()) {
            return; // No users to process
        }

        // Generate tokens for all users
        $tokensToInsert = [];
        $chunkSize = 100;

        foreach ($users as $user) {
            // Check if user already has an active token
            $existingToken = DB::table($tokensTableName)
                ->where('user_id', $user->id)
                ->where('is_active', true)
                ->first();

            if (!$existingToken) {
                $token = $this->generateUniqueToken($tokensTableName);
                
                $tokensToInsert[] = [
                    'user_id' => $user->id,
                    'token' => $token,
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                // Insert in chunks to avoid memory issues
                if (count($tokensToInsert) >= $chunkSize) {
                    DB::table($tokensTableName)->insert($tokensToInsert);
                    $tokensToInsert = [];
                }
            }
        }

        // Insert remaining tokens
        if (!empty($tokensToInsert)) {
            DB::table($tokensTableName)->insert($tokensToInsert);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Optionally, you can remove all tokens here
        // $tokensTableName = $this->getTokensTableName();
        // DB::table($tokensTableName)->truncate();
        
        // Or do nothing to preserve tokens
    }
};
