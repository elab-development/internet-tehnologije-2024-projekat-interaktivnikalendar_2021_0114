<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\SprintController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login'])->name('login');


Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::group(['middleware' => ['auth:developer']], function () {
        Route::resource('tasks', TaskController::class);
    });

    Route::group(['middleware' => ['auth:scrum-master']], function () {
        Route::post('sprints', [SprintController::class, 'store'])->name('sprints.store');
        Route::delete('sprints/{id}', [SprintController::class, 'destroy']);
    });

    Route::group(['middleware' => ['auth:scrum-master', 'auth:product-owner']], function () {
        Route::get('sprints', [SprintController::class, 'index'])->name('sprints.index');
        Route::get('sprints/{id}', [SprintController::class, 'show'])->name('sprints.show');
    });

    Route::post('logout', [AuthController::class, 'logout']);
});
