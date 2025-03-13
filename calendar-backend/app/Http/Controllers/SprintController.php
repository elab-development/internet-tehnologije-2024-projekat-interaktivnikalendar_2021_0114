<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Sprint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SprintController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sprints = Sprint::with('users.role')->get(); // Include user roles
        return response()->json($sprints);
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
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'start' => 'required|date',
            'end' => 'required|date|after_or_equal:start',
            'color' => 'required|string', // Validate color
        ]);

        $sprint = Sprint::create($validatedData);

        // Assign the sprint to the logged-in user
        $user = $request->user();
        $sprint->users()->attach($user->id);

        return response()->json(['Sprint created successfully.', $sprint]);
    }

    /**
     * Display the specified resource.
     */
    public function show($sprint_id)
    {
        $sprint = Sprint::find($sprint_id);
        if (is_null($sprint)) {
            return response()->json('Data not found', 404);
        }
        return response()->json($sprint);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Sprint $sprint)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $sprint_id)
    {

        $sprint = Sprint::find($sprint_id);
        if (is_null($sprint)) {
            return response()->json(['message' => 'Data not found'], 404);
        }


        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'start' => 'required|date',
            'end' => 'required|date|after_or_equal:start',
            'color' => 'required|string', // Validate color
        ]);


        $sprint->update([
            'name' => $validatedData['name'],
            'start' => $validatedData['start'],
            'end' => $validatedData['end'],
            'color' => $validatedData['color'], // Update color
        ]);


        return response()->json(['message' => 'Sprint updated successfully.', 'sprint' => $sprint], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($sprint_id)
    {
        $sprint = Sprint::find($sprint_id);
        $sprint->delete();
        return response()->json('Sprint is deleted successfully.');
    }

    /**
     * Get the sprints associated with the logged-in user.
     */
    public function userSprints(Request $request)
    {
        $user = $request->user();
        $sprints = $user->sprints()->with('users.role')->get(); // Include user roles
        return response()->json($sprints);
    }
 
    //Ovo smo koristi pre nego sto smo kreirali invitationForm
    public function assignUserToSprint($sprint_id, $user_id)
    {
        $sprint = Sprint::find($sprint_id);
        if (!$sprint) {
            return response()->json(['error' => 'Sprint not found.'], 404);
        }

        // Check if user exists before attaching
        $user = User::find($user_id);
        if (!$user) {
            return response()->json(['error' => 'User not found.'], 404);
        }

        // Attach user to sprint if not already attached
        if (!$sprint->users()->where('user_id', $user_id)->exists()) {
            $sprint->users()->attach($user_id);
            return response()->json(['message' => 'User assigned to sprint successfully.']);
        }

        return response()->json(['message' => 'User is already assigned to this sprint.'], 200);
    }

    public function removeUserFromSprint($sprint_id, $user_id)
    {
        $sprint = Sprint::find($sprint_id);
        if (!$sprint) {
            return response()->json(['error' => 'Sprint not found.'], 404);
        }

        $user = User::find($user_id);
        if (!$user) {
            return response()->json(['error' => 'User not found.'], 404);
        }

        if ($sprint->users()->where('user_id', $user_id)->exists()) {
            $sprint->users()->detach($user_id);
            return response()->json(['message' => 'User removed from sprint successfully.']);
        }

        return response()->json(['message' => 'User is not in this sprint.'], 200);
    }
}
