<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\JsonResponse;

class TeamController extends Controller
{
    /**
     * Display a listing of all teams.
     */
    public function index(): JsonResponse
    {
        $teams = Team::all();

        return response()->json([
            'success' => true,
            'data' => $teams,
        ]);
    }
}
