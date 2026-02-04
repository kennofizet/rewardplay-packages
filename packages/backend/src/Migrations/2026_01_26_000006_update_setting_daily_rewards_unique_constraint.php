<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $tableName = (new \Kennofizet\RewardPlay\Models\SettingDailyReward())->getTable();

        if (Schema::hasTable($tableName)) {
            // First, find all unique constraints on the date column
            $constraints = DB::select("
                SELECT CONSTRAINT_NAME 
                FROM information_schema.TABLE_CONSTRAINTS 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME = ? 
                AND CONSTRAINT_TYPE = 'UNIQUE'
                AND CONSTRAINT_NAME LIKE '%date%'
            ", [$tableName]);
            
            // Drop each found constraint
            foreach ($constraints as $constraint) {
                $constraintName = $constraint->CONSTRAINT_NAME;
                try {
                    // Try dropping as INDEX first (MySQL unique constraints are often indexes)
                    DB::statement("ALTER TABLE `{$tableName}` DROP INDEX `{$constraintName}`");
                } catch (\Exception $e) {
                    // If that fails, try dropping as constraint
                    try {
                        DB::statement("ALTER TABLE `{$tableName}` DROP CONSTRAINT `{$constraintName}`");
                    } catch (\Exception $e2) {
                        // Constraint might not exist, continue
                    }
                }
            }
            
            // Also check STATISTICS for unique indexes that might not be in TABLE_CONSTRAINTS
            $indexes = DB::select("
                SELECT DISTINCT INDEX_NAME 
                FROM information_schema.STATISTICS 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME = ? 
                AND NON_UNIQUE = 0
                AND INDEX_NAME LIKE '%date%'
                AND INDEX_NAME NOT IN (
                    SELECT CONSTRAINT_NAME 
                    FROM information_schema.TABLE_CONSTRAINTS 
                    WHERE TABLE_SCHEMA = DATABASE() 
                    AND TABLE_NAME = ? 
                    AND CONSTRAINT_TYPE = 'UNIQUE'
                )
            ", [$tableName, $tableName]);
            
            foreach ($indexes as $index) {
                try {
                    DB::statement("ALTER TABLE `{$tableName}` DROP INDEX `{$index->INDEX_NAME}`");
                } catch (\Exception $e) {
                    // Index might not exist, continue
                }
            }
            
            // Now add the composite unique constraint
            Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                // Check if composite constraint already exists before adding
                $compositeExists = DB::select("
                    SELECT CONSTRAINT_NAME 
                    FROM information_schema.TABLE_CONSTRAINTS 
                    WHERE TABLE_SCHEMA = DATABASE() 
                    AND TABLE_NAME = ? 
                    AND CONSTRAINT_TYPE = 'UNIQUE'
                    AND CONSTRAINT_NAME = 'uk_date_zone'
                ", [$tableName]);
                
                if (empty($compositeExists)) {
                    // Add composite unique constraint on date and zone_id
                    $table->unique(['date', 'zone_id'], 'uk_date_zone');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tableName = (new \Kennofizet\RewardPlay\Models\SettingDailyReward())->getTable();

        if (Schema::hasTable($tableName)) {
            Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                // Drop composite unique constraint
                try {
                    $table->dropUnique('uk_date_zone');
                } catch (\Exception $e) {
                    // Constraint might not exist
                }
                
                // Restore original date unique constraint
                try {
                    $table->unique('date');
                } catch (\Exception $e) {
                    // Constraint might already exist
                }
            });
        }
    }
};
