<?php

namespace Kennofizet\RewardPlay\Services\SettingRewardPlay;

use Kennofizet\RewardPlay\Repositories\Model\ServerManagerRepository;
use Kennofizet\RewardPlay\Services\SettingRewardPlay\Validation\ServerManagerValidationService;
use Kennofizet\RewardPlay\Models\ServerManager;
use Kennofizet\RewardPlay\Core\Model\BaseModelActions;
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
     * Permission checks handled by middleware.
     */
    public function getServerManagers($filters = [])
    {
        $query = ServerManager::query();

        // Filter by the server the current user can manage
        $managedServerId = BaseModelActions::currentUserManagedServerId();
        if (empty($managedServerId)) {
            // If user can't manage any server, return empty collection
            return collect([]);
        }

        if (!empty($filters['server_id'])) {
            // Middleware already validated server_id permission
            $query->byServer($filters['server_id']);
        } else {
            // Default to user's managed server
            $query->byServer($managedServerId);
        }

        if (!empty($filters['user_id'])) {
            $query->byUser($filters['user_id']);
        }

        return $query->get();
    }

    /**
     * Get managers by server.
     * Permission checks handled by middleware.
     */
    public function getByServer(int $serverId)
    {
        // Middleware already validated server_id permission
        return ServerManager::findByServerId($serverId);
    }

    /**
     * Assign manager to server.
     * Permission checks handled by middleware.
     *
     * @throws ValidationException
     */
    public function assignManager(array $data): ServerManager
    {
        // Middleware already validated server_id permission
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
     * Permission checks handled by middleware.
     *
     * @throws ValidationException
     */
    public function removeManager(array $data): bool
    {
        // Middleware already validated server_id permission
        $this->validation->validateAssign($data);
        
        return $this->repository->remove($data['server_id'], $data['user_id']);
    }
}
