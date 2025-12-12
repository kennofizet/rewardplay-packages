<?php

namespace Kennofizet\RewardPlay\Models;

use Kennofizet\RewardPlay\Models\Token\TokenRelations;
use Kennofizet\RewardPlay\Models\Token\TokenScopes;
use Kennofizet\RewardPlay\Models\Token\TokenActions;
use Kennofizet\RewardPlay\Core\Model\BaseModel;

/**
 * Token Model
 */
class Token extends BaseModel
{
    use TokenRelations, TokenActions, TokenScopes;

    /**
     * Get the table name with prefix
     * 
     * @return string
     */
    public function getTable()
    {
        $tablePrefix = config('rewardplay.table_prefix', '');
        return $tablePrefix . 'rewardplay_tokens';
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'token',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
    ];
}

