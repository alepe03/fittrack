<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EntrenoController;
use App\Http\Controllers\Api\RutinaController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/register', [AuthController::class, 'register'])->middleware('throttle:5,1');
Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/rutinas', [RutinaController::class, 'index']);
    Route::get('/rutinas/{id}', [RutinaController::class, 'show']);
    Route::post('/rutinas', [RutinaController::class, 'store']);
    Route::put('/rutinas/{id}', [RutinaController::class, 'update']);
    Route::delete('/rutinas/{id}', [RutinaController::class, 'destroy']);
    Route::post('/rutinas/{id}/duplicar', [RutinaController::class, 'duplicar']);

    Route::get('/entrenos', [EntrenoController::class, 'index']);
    Route::post('/entrenos', [EntrenoController::class, 'store']);
    Route::get('/entrenos/{id}', [EntrenoController::class, 'show']);
    Route::put('/entrenos/{id}', [EntrenoController::class, 'update']);
    Route::delete('/entrenos/{id}', [EntrenoController::class, 'destroy']);
});
