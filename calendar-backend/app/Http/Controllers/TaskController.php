<?php

namespace App\Http\Controllers;

use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tasks = Task::all();
        return response()->json($tasks);
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
            'description' => 'nullable|string|max:1000',
            'start' => 'required|date',
            'end' => 'required|date|after_or_equal:start',
            'status' => 'required|string',
            'user_id' => 'required|exists:users,id',
            'sprint_id' => 'required|exists:sprints,id',
        ]);

        $task = Task::create($validatedData);

        return response()->json(['Task created successfully.', $task]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $task = Task::find($id);
        if (is_null($task)) {
            return response()->json('Data not found', 404);
        }
        return response()->json($task);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $task_id)
    {
        $task = Task::find($task_id);
        if (is_null($task)) {
            return response()->json(['message' => 'Data not found'], 404);
        }


        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'start' => 'required|date',
            'end' => 'required|date|after_or_equal:start',
            'status' => 'required|string',
            'user_id' => 'required|exists:users,id',
            'sprint_id' => 'required|exists:sprints,id',

        ]);


        $task->update([
            'name' => $validatedData['name'],
            'description' => $validatedData['description'] ?? null,
            'start' => $validatedData['start'] ?? null,
            'end' => $validatedData['end'] ?? null,
            'status' => $validatedData['status'],
            'user_id' => $validatedData['user_id'],
            'sprint_id' => $validatedData['sprint_id'],
        ]);


        return response()->json(['message' => 'Task updated successfully.', 'task' => $task], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($task_id)
    {
        $task = Task::find($task_id);
        $task->delete();
        return response()->json('Task deleted successfully.');
    }
}
