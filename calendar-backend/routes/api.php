<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\SprintController;
use App\Http\Controllers\Auth\NewPasswordController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
//Route::post('reset-password', [AuthController::class, 'resetPassword']);

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login'])->name('login');




Route::group(['middleware' => ['auth:sanctum']], function () {

    // Route::group(['middleware' => ['auth:developer']], function () {
    //     Route::resource('tasks', TaskController::class);
    // });

    Route::group(['middleware' => ['auth:scrum-master']], function () {
        Route::get('sprints', [SprintController::class, 'index'])->name('sprints.index');
        Route::post('sprints', [SprintController::class, 'store'])->name('sprints.store');
        Route::put('sprints/{id}', [SprintController::class, 'update'])->name('sprints.update');
        Route::delete('sprints/{id}', [SprintController::class, 'destroy']);
    });

    Route::group(['middleware' => ['auth:scrum-master,product-owner']], function () {
        Route::get('sprints/{id}', [SprintController::class, 'show'])->name('sprints.show');
    });

    Route::get('tasks', [TaskController::class, 'index'])->name('tasks.index');
    Route::post('tasks', [TaskController::class, 'store'])->name('tasks.store');
    Route::get('tasks/{id}', [TaskController::class, 'show'])->name('tasks.show');
    Route::put('tasks/{id}', [TaskController::class, 'update'])->name('tasks.update');
    Route::delete('tasks/{id}', [TaskController::class, 'destroy'])->name('tasks.destroy');
  
    Route::post('logout', [AuthController::class, 'logout']);
});
