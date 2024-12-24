<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\SprintController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::resource('tasks', TaskController::class);

Route::get('sprints', [SprintController::class, 'index'])->name('sprints.index');
Route::post('sprints', [SprintController::class, 'store'])->name('sprints.store');
Route::get('sprints/{id}', [SprintController::class, 'show'])->name('sprints.show');
Route::delete('sprints/{id}', [SprintController::class, 'destroy']);
