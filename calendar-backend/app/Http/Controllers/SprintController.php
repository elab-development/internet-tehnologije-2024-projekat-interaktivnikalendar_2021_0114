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
        $sprint = Sprint::create([
            'name' => $request->name,
            'start' => $request->start,
            'end' => $request->end
        ]);

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
    public function update(Request $request, Sprint $sprint)
    {
        $sprint->update($request->all());
        return response()->json($sprint);
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
}
