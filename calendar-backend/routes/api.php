<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SprintController;
use App\Http\Controllers\InvitationController;

// Get the authenticated user
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Get the authenticated user with role
Route::get('/user-with-role', [UserController::class, 'getUserWithRole'])->middleware('auth:sanctum');

// Authentication routes
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login'])->name('login');


Route::get('/invitations/accept/{token}', [InvitationController::class, 'acceptInvitation']);

// Protected routes
Route::group(['middleware' => ['auth:sanctum']], function () {

    // Task routes
    Route::resource('tasks', TaskController::class);

    // Tasks associated with the logged-in user 
    Route::get('/user/tasks', [TaskController::class, 'userTasks'])->name('user.tasks');

    // Assign a task to a sprint
    Route::get('tasks/assign-sprint', [TaskController::class, 'assignTaskToSprint'])->name('task.assignSprint');

    // Update task status and order
    Route::put('tasks/{id}/status-order', [TaskController::class, 'updateStatusAndOrder'])->name('tasks.updateStatusAndOrder');

    // Sprints  associated with the logged-in user with all tasks in that sprint
    Route::get('/user/sprints/tasks', [TaskController::class, 'tasksInUserSprint'])->name('user.sprint.tasks');

    //Routes for kanban board
    Route::get('/sprints/{sprint_id}/tasks', [TaskController::class, 'tasksInSprint'])->name('sprint.tasks');
    Route::get('/sprints/{sprint_id}/user/tasks', [TaskController::class, 'personalTasksInSprint'])->name('personal.sprint.tasks');


    // Sprints associated with the logged-in user
    Route::get('user/sprints', [SprintController::class, 'userSprints'])->name('user.sprints');
    Route::get('/user/active-teams', [UserController::class, 'activeTeams']);
    Route::get('/user/archived-teams', [UserController::class, 'archivedTeams']);
    Route::put('/user/teams/{sprint_id}/status/{status}', [UserController::class, 'updateTeamStatus']);


    // Scrum master routes
    Route::group(['middleware' => ['auth:scrum-master']], function () {
        Route::get('sprints', [SprintController::class, 'index'])->name('sprints.index');
        Route::post('sprints', [SprintController::class, 'store'])->name('sprints.store');
        Route::put('sprints/{id}', [SprintController::class, 'update'])->name('sprints.update');
        Route::delete('sprints/{id}', [SprintController::class, 'destroy']);
    });

    // Scrum master and product owner routes
    Route::group(['middleware' => ['auth:scrum-master,product-owner']], function () {
        Route::get('sprints/{id}', [SprintController::class, 'show'])->name('sprints.show');
        Route::post('/assign/{sprint_id}/{user_id}', [SprintController::class, 'assignUserToSprint'])->name('sprint.assignUser');
        Route::delete('/assign/{sprint_id}/{user_id}', [SprintController::class, 'removeUserFromSprint'])->name('sprint.removeUser');
    });

    Route::post('/invitations', [InvitationController::class, 'sendInvitation']);


    // Logout route
    Route::post('logout', [AuthController::class, 'logout']);
});
