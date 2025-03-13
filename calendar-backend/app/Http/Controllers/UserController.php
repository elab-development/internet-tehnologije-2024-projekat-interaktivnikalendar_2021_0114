<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Ramsey\Uuid\Type\Integer;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with('role')->get();
        return response()->json($users);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($user_id)
    {
        $user = User::with('role')->find($user_id);
        if (is_null($user)) {
            return response()->json('Data not found', 404);
        }
        return response()->json($user);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($user_id)
    {
        $user = User::find($user_id);
        if (is_null($user)) {
            return response()->json('Data not found', 404);
        }

        $user->delete();
        return response()->json('User deleted successfully', 204);
    }
    
    public function getUserWithRole(Request $request)
    {
        $user = $request->user()->load('role');
        return response()->json($user);
    }

    public function activeTeams(Request $request)
    {
        $user = $request->user();
        $activeTeams = $user->sprints()->with('users.role')->wherePivot('is_active', true)->get();
        return response()->json($activeTeams);
    }

    public function archivedTeams(Request $request)
    {
        $user = $request->user();
        $activeTeams = $user->sprints()->with('users.role')->wherePivot('is_active', false)->get();
        return response()->json($activeTeams);
    }

    public function updateTeamStatus(Request $request, $sprint_id, $status)
    {
        $user = $request->user();
        // Convert the status to a boolean value
        $status = filter_var($status, FILTER_VALIDATE_BOOLEAN);
        $user->sprints()->updateExistingPivot($sprint_id, ['is_active' =>  $status]);
        return response()->json(['message' => 'Status updated successfully']);
    }

    
}
