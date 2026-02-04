<?php

namespace Kennofizet\RewardPlay\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class FileController extends Controller
{
    /**
     * Allowed folder keys (must match config keys used for route registration).
     */
    protected function getAllowedFolders(): array
    {
        return [
            config('rewardplay.images_folder', 'rewardplay-images'),
            config('rewardplay.constants_folder', 'rewardplay-constants'),
        ];
    }

    /**
     * Serve a file from one of the allowed folders (images_folder, constants_folder).
     * Adds CORS headers when config rewardplay.allow_cors_for_files is true.
     */
    public function serve(Request $request, string $path = ''): Response|BinaryFileResponse
    {
        $folder = $request->route('folder');
        $allowed = $this->getAllowedFolders();
        if (!in_array($folder, $allowed, true)) {
            abort(404);
        }

        $basePath = public_path($folder);
        $resolved = $basePath . '/' . str_replace(['../', '..\\'], '', $path);
        $resolved = realpath($resolved);

        if ($resolved === false || !str_starts_with($resolved, realpath($basePath) . DIRECTORY_SEPARATOR)) {
            abort(404);
        }

        if (!is_file($resolved)) {
            abort(404);
        }

        $response = response()->file($resolved);

        if (config('rewardplay.allow_cors_for_files', false)) {
            $response->headers->set('Access-Control-Allow-Origin', '*');
            $response->headers->set('Access-Control-Allow-Methods', 'GET, OPTIONS');
            $response->headers->set('Access-Control-Allow-Headers', 'Content-Type');
        }

        return $response;
    }
}
