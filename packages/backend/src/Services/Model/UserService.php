<?php

namespace Kennofizet\RewardPlay\Services\Model;

use Kennofizet\RewardPlay\Models\User;
use Kennofizet\RewardPlay\Models\User\UserRelationshipSetting;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;

class UserService
{
    protected $userRepository;

    public function __construct(\Kennofizet\RewardPlay\Repositories\Model\UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Get users with pagination and filters
     */
    public function getUsers(array $filters = [], ?string $modeView = null)
    {
        $perPage = $filters['perPage'] ?? HelperConstant::PER_PAGE_DEFAULT;
        $page = $filters['currentPage'] ?? 1;

        $query = User::query();

        // Load relationships based on mode - always eager load to prevent N+1
        $withRelationships = UserRelationshipSetting::buildWithArray($modeView);
        if (!empty($withRelationships)) {
            $query->with($withRelationships);
        }

        // Apply search scope
        $key_search = '';
        if (!empty($filters['keySearch'])) {
            $key_search = $filters['keySearch'];
        }
        if (empty($key_search)) {
            $key_search = $filters['q'] ?? '';
        }

        // Apply other filters using scopes
        if (!empty($key_search)) {
            $query->search($key_search);
        }

        $query->orderBy('id', 'DESC');

        return $query->paginate($perPage, ['*'], 'page', $page);
    }
}

