<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\SprintController;
use App\Http\Controllers\Auth\NewPasswordController;

// Get the authenticated user
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Authentication routes
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login'])->name('login');

// Protected routes
Route::group(['middleware' => ['auth:sanctum']], function () {

    // Task routes
    Route::resource('tasks', TaskController::class);

    // Sprints associated with the logged-in user
    Route::get('user/sprints', [SprintController::class, 'userSprints'])->name('user.sprints');

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
    });

    // Logout route
    Route::post('logout', [AuthController::class, 'logout']);
});
