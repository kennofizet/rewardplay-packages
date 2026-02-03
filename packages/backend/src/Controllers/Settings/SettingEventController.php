<?php

namespace Kennofizet\RewardPlay\Controllers\Settings;

use Kennofizet\RewardPlay\Controllers\Controller;
use Kennofizet\RewardPlay\Services\Model\SettingEventService;
use Kennofizet\RewardPlay\Models\SettingEvent\SettingEventModelResponse;
use Kennofizet\RewardPlay\Requests\StoreSettingEventRequest;
use Kennofizet\RewardPlay\Requests\UpdateSettingEventRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SettingEventController extends Controller
{
    public function __construct(
        protected SettingEventService $settingEventService
    ) {
    }

    /**
     * Get all setting events (paginated).
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['perPage', 'currentPage', 'keySearch', 'q', 'is_active']);
        $mode = SettingEventModelResponse::getAvailableModeDefault();
        $events = $this->settingEventService->getSettingEvents($filters, $mode);
        $formatted = SettingEventModelResponse::formatSettingEvents($events, $mode);

        return $this->apiResponseWithContext([
            'events' => $formatted,
        ]);
    }

    /**
     * Get a single setting event.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $mode = SettingEventModelResponse::getAvailableModeDefault();
        $event = $this->settingEventService->getSettingEvent($id, $mode);
        if (!$event) {
            return $this->apiErrorResponse('Setting event not found', 404);
        }

        return $this->apiResponseWithContext([
            'event' => SettingEventModelResponse::formatSettingEvent($event, $mode),
        ]);
    }

    /**
     * Create a new setting event.
     *
     * @param StoreSettingEventRequest $request
     * @return JsonResponse
     */
    public function store(StoreSettingEventRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            if ($request->hasFile('image')) {
                $data['image'] = $this->settingEventService->storeEventImage($request->file('image'));
            }
            $event = $this->settingEventService->createSettingEvent($data);
            return $this->apiResponseWithContext([
                'event' => SettingEventModelResponse::formatSettingEvent($event),
            ], 201);
        } catch (\Exception $e) {
            return $this->handleException($e, 400);
        }
    }

    /**
     * Update a setting event.
     *
     * @param UpdateSettingEventRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(UpdateSettingEventRequest $request, int $id): JsonResponse
    {
        try {
            $data = $request->validated();
            if ($request->hasFile('image')) {
                $data['image'] = $this->settingEventService->storeEventImage($request->file('image'));
            }
            $event = $this->settingEventService->updateSettingEvent($id, $data);
            return $this->apiResponseWithContext([
                'event' => SettingEventModelResponse::formatSettingEvent($event),
            ]);
        } catch (\Exception $e) {
            return $this->handleException($e, 400);
        }
    }

    /**
     * Delete a setting event.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $deleted = $this->settingEventService->deleteSettingEvent($id);
            if (!$deleted) {
                return $this->apiErrorResponse('Setting event not found', 404);
            }
            return $this->apiResponseWithContext(['message' => 'Deleted']);
        } catch (\Exception $e) {
            return $this->handleException($e, 400);
        }
    }
}
