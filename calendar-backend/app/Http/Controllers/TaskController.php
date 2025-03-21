<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Sprint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\TaskResource;
use Carbon\Carbon;

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
            'color' => 'required|string',
            'priority' => 'nullable|string',
        ]);

        $sprint = Sprint::find($validatedData['sprint_id']);
        if (!$sprint) {
            return response()->json(['message' => 'Sprint not found'], 404);
        }

        // Normalize dates for comparison
        $taskStart = Carbon::parse($validatedData['start'])->startOfMinute();
        $taskEnd = Carbon::parse($validatedData['end'])->endOfMinute();
        $sprintStart = Carbon::parse($sprint->start)->startOfMinute();
        $sprintEnd = Carbon::parse($sprint->end)->endOfMinute();

        // Check if the task's start and end dates are within the sprint's start and end dates
        if ($taskStart->lt($sprintStart) || $taskEnd->gt($sprintEnd)) {
            return response()->json(['message' => 'Task dates must be within the sprint dates'], 422);
        }

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
            'color' => 'required|string',
            'priority' => 'nullable|string',
        ]);

        $sprint = Sprint::find($validatedData['sprint_id']);
        if (!$sprint) {
            return response()->json(['message' => 'Sprint not found'], 404);
        }

        // Normalize dates for comparison
        $taskStart = Carbon::parse($validatedData['start'])->startOfMinute();
        $taskEnd = Carbon::parse($validatedData['end'])->endOfMinute();
        $sprintStart = Carbon::parse($sprint->start)->startOfMinute();
        $sprintEnd = Carbon::parse($sprint->end)->endOfMinute();

        // Check if the task's start and end dates are within the sprint's start and end dates
        if ($taskStart->lt($sprintStart) || $taskEnd->gt($sprintEnd)) {
            return response()->json(['message' => 'Task dates must be within the sprint dates'], 422);
        }

        $task->update($validatedData);

        return response()->json(['message' => 'Task updated successfully.', 'task' => $task], 200);
    }

    /**
     * Update the status and order of the specified task.
     */
    public function updateStatusAndOrder(Request $request, $task_id)
    {
        $task = Task::find($task_id);
        if (is_null($task)) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        $validatedData = $request->validate([
            'status' => 'required|string',
            'newIndex' => 'required|integer',
        ]);

        $newIndex = $validatedData['newIndex'];
        $oldIndex = $task->order;
        $newStatus = $validatedData['status'];
        $oldStatus = $task->status;
        $sprint_id = $task->sprint_id;

        // Update the order of other tasks in the old column and sprint
        if ($oldStatus === $newStatus) {
            if ($newIndex > $oldIndex) {
                Task::where('status', $oldStatus)
                    ->where('sprint_id', $sprint_id)
                    ->where('order', '>', $oldIndex)
                    ->where('order', '<=', $newIndex)
                    ->decrement('order', 1);
            } else {
                Task::where('status', $oldStatus)
                    ->where('sprint_id', $sprint_id)
                    ->where('order', '<', $oldIndex)
                    ->where('order', '>=', $newIndex)
                    ->increment('order', 1);
            }
        } else {
            Task::where('status', $oldStatus)
                ->where('sprint_id', $sprint_id)
                ->where('order', '>', $oldIndex)
                ->decrement('order', 1);

            Task::where('status', $newStatus)
                ->where('sprint_id', $sprint_id)
                ->where('order', '>=', $newIndex)
                ->increment('order', 1);
        }

        $task->update([
            'status' => $newStatus,
            'order' => $newIndex,
        ]);

        return response()->json(['message' => 'Task status and order updated successfully.', 'task' => $task], 200);
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

    //Get all tasks associated with the logged-in user
    public function userTasks(Request $request)
    {
        $user = $request->user();

        $tasks = Task::where('user_id', $user->id)->get();

        return response()->json($tasks);
    }

    //Assign a task to a sprint
    public function assignTaskToSprint(Request $request)
    {
        $user = $request->user();
        $sprints = $user->sprints()->with('users')->get();
        return response()->json($sprints);
    }


    //Sprints  associated with the logged-in user with all tasks in that sprint
    public function tasksInUserSprint(Request $request)
    {
        $user = $request->user();
        $sprints = $user->sprints()->with('tasks')->get();

        $tasks = [];
        foreach ($sprints as $sprint) {
            foreach ($sprint->tasks as $task) {
                $tasks[] = $task;
            }
        }

        return response()->json(['sprints' => $sprints]);
    }

    //Get all tasks in one sprint - Kanban board shared tasks 
    public function tasksInSprint(Request $request, $sprint_id)
    {
        $sprint = Sprint::find($sprint_id);
        if (!$sprint) {
            return response()->json(['message' => 'Sprint not found'], 404);
        }

        $tasks = $sprint->tasks()->with('user')->get();
        return response()->json(['tasks' => $tasks]);
    }

    //Get all tasks assigned to logged in user in one sprint - Kanban board - personal tasks
    public function personalTasksInSprint(Request $request, $sprint_id)
    {
        $user = $request->user();
        $sprint = Sprint::find($sprint_id);
        if (!$sprint) {
            return response()->json(['message' => 'Sprint not found'], 404);
        }

        $tasks = $sprint->tasks()->with('user')->where('user_id', $user->id)->get();
        return response()->json(['tasks' => $tasks]);
    }
}
