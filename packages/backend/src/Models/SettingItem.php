<?php

namespace Kennofizet\RewardPlay\Models;

use Kennofizet\RewardPlay\Models\SettingItem\SettingItemRelations;
use Kennofizet\RewardPlay\Models\SettingItem\SettingItemScopes;
use Kennofizet\RewardPlay\Models\SettingItem\SettingItemActions;
use Kennofizet\RewardPlay\Core\Model\BaseModel;
use Illuminate\Support\Str;

/**
 * SettingItem Model
 */
class SettingItem extends BaseModel
{
    use SettingItemRelations, SettingItemActions, SettingItemScopes;

    /**
     * Get the table name with prefix
     * 
     * @return string
     */
    public function getTable()
    {
        $tablePrefix = config('rewardplay.table_prefix', '');
        return $tablePrefix . 'rewardplay_settings_items';
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
        'type',
        'default_property',
        'image',
        'zone_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'default_property' => 'array',
    ];

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        // Generate slug automatically on creation
        static::creating(function ($settingItem) {
            if (empty($settingItem->slug) && !empty($settingItem->name)) {
                $baseSlug = Str::slug($settingItem->name);
                $slug = $baseSlug;
                $counter = 1;
                
                // Ensure unique slug
                while (static::bySlug($slug)->exists()) {
                    $slug = $baseSlug . '-' . $counter;
                    $counter++;
                }
                
                $settingItem->slug = $slug;
            }

        });

        // Regenerate slug on update if name changed
        static::updating(function ($settingItem) {
            if ($settingItem->isDirty('name') && !empty($settingItem->name)) {
                $baseSlug = Str::slug($settingItem->name);
                $slug = $baseSlug;
                $counter = 1;
                
                // Ensure unique slug (excluding current record)
                while (static::bySlug($slug)->where('id', '!=', $settingItem->id)->exists()) {
                    $slug = $baseSlug . '-' . $counter;
                    $counter++;
                }
                
                $settingItem->slug = $slug;
            }

        });
    }
}

