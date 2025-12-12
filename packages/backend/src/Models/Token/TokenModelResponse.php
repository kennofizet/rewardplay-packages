<?php

namespace Kennofizet\RewardPlay\Models\Token;

use Kennofizet\RewardPlay\Core\Model\BaseModelResponse;
use Kennofizet\RewardPlay\Models\Token\TokenConstant;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class TokenModelResponse extends BaseModelResponse
{
    /**
     * Get the default mode
     */
    public static function getAvailableModeDefault(): string
    {
        return TokenConstant::API_TOKEN_LIST_PAGE;
    }

    /**
     * Format token data for API response
     */
    public static function formatToken($token, $mode = ''): array
    {
        if (!$token) {
            return [];
        }

        if(in_array($mode, [
            self::getAvailableModeDefault()
        ])){
            $default_reponse = [
                'id' => $token->id,
                'user_id' => $token->user_id,
                'is_active' => $token->is_active
            ];

            return $default_reponse;
        }elseif(in_array($mode, [
            HelperConstant::REPONSE_MODE_SELECTER_API,
        ])){
            return [
                'id' => $token->id,
                'user_id' => $token->user_id,
                'is_active' => $token->is_active
            ];
        }

        return [
            'id' => $token->id,
            'user_id' => $token->user_id,
            'is_active' => $token->is_active
        ];
    }

    /**
     * Format tokens collection for API response with pagination
     */
    public static function formatTokens($tokens, ?string $mode = null): array
    {
        $mode = $mode ?? self::getAvailableModeDefault();

        if ($tokens instanceof LengthAwarePaginator) {
            return [
                'data' => $tokens->map(function ($token) use ($mode) {
                    return self::formatToken($token, $mode);
                }),
                'current_page' => $tokens->currentPage(),
                'total' => $tokens->total(),
                'last_page' => $tokens->lastPage()
            ];
        }

        if ($tokens instanceof Collection) {
            return $tokens->map(function ($token) use ($mode) {
                return self::formatToken($token, $mode);
            })->toArray();
        }

        return [];
    }
}

