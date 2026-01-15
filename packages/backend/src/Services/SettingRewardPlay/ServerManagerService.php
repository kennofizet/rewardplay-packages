<?php

namespace Kennofizet\RewardPlay\Services\SettingRewardPlay;

use Kennofizet\RewardPlay\Repositories\Model\ServerManagerRepository;
use Kennofizet\RewardPlay\Services\SettingRewardPlay\Validation\ServerManagerValidationService;
use Kennofizet\RewardPlay\Models\ServerManager;
use Illuminate\Validation\ValidationException;

class ServerManagerService
{
    protected ServerManagerRepository $repository;
    protected ServerManagerValidationService $validation;

    public function __construct(
        ServerManagerRepository $repository,
        ServerManagerValidationService $validation
    ) {
        $this->repository = $repository;
        $this->validation = $validation;
    }

    /**
     * Get server managers list.
     */
    public function getServerManagers($filters = [])
    {
        $query = ServerManager::query();

        if (!empty($filters['server_id'])) {
            $query->byServer($filters['server_id']);
        }

        if (!empty($filters['user_id'])) {
            $query->byUser($filters['user_id']);
        }

        return $query->get();
    }

    /**
     * Get managers by server.
     */
    public function getByServer(int $serverId)
    {
        return ServerManager::findByServerId($serverId);
    }

    /**
     * Assign manager to server.
     *
     * @throws ValidationException
     */
    public function assignManager(array $data): ServerManager
    {
        $this->validation->validateAssign($data);
        
        // Check if manager already exists for this server
        $existingManager = ServerManager::byUser($data['user_id'])
            ->byServer($data['server_id'])
            ->first();
            
        if ($existingManager) {
            return $existingManager; // Already exists, return existing
        }

        return $this->repository->create($data);
    }

    /**
     * Remove manager from server.
     *
     * @throws ValidationException
     */
    public function removeManager(array $data): bool
    {
        $this->validation->validateAssign($data);
        return $this->repository->remove($data['server_id'], $data['user_id']);
    }
}
