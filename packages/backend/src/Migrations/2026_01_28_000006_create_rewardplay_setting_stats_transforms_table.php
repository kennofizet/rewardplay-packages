<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $tableName = 'rewardplay_setting_stats_transforms';
        
        // Get the actual table name with prefix
        $model = new class extends \Kennofizet\RewardPlay\Core\Model\BaseModel {
            public function getTable() {
                return self::getPivotTableName('rewardplay_setting_stats_transforms');
            }
        };
        $tableName = $model->getTable();

        Schema::create($tableName, function (Blueprint $table) {
            $table->id();
            $table->string('target_key'); // The CONVERSION_KEYS_ACCEPT_CONVERT key that receives the conversion
            $table->json('source_keys')->nullable(); // Array of CONVERSION_KEYS that convert to target_key
            $table->decimal('conversion_value', 10, 4)->default(1.0); // The multiplier/rate for conversion
            $table->unsignedBigInteger('zone_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('target_key');
            $table->index('zone_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $model = new class extends \Kennofizet\RewardPlay\Core\Model\BaseModel {
            public function getTable() {
                return self::getPivotTableName('rewardplay_setting_stats_transforms');
            }
        };
        $tableName = $model->getTable();

        Schema::dropIfExists($tableName);
    }
};
