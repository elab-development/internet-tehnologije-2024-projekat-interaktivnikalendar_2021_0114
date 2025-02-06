<?php

namespace App\Http\Controllers;

use App\Models\Sprint;
use Illuminate\Http\Request;

class SprintController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sprints = Sprint::all();
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
        ]);

        $sprint = Sprint::create($validatedData);

        // Assign the sprint to the logged-in user
        $user = $request->user();
        $user->sprint_id = $sprint->id;
        $user->save();

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
        ]);


        $sprint->update([
            'name' => $validatedData['name'],
            'start' => $validatedData['start'],
            'end' => $validatedData['end'],
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
        $sprints = Sprint::find($request->user()->sprint_id);
        return response()->json($sprints);
    }
}
