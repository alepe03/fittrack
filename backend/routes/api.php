<?php

use App\Http\Controllers\Api\EntrenoController;
use App\Http\Controllers\Api\RutinaController;
use Illuminate\Support\Facades\Route;

Route::get('/rutinas', [RutinaController::class, 'index']);
Route::get('/rutinas/{id}', [RutinaController::class, 'show']);
Route::post('/rutinas', [RutinaController::class, 'store']);
Route::put('/rutinas/{id}', [RutinaController::class, 'update']);
Route::delete('/rutinas/{id}', [RutinaController::class, 'destroy']);
Route::post('/rutinas/{id}/duplicar', [RutinaController::class, 'duplicar']);

Route::get('/entrenos', [EntrenoController::class, 'index']);
Route::post('/entrenos', [EntrenoController::class, 'store']);
Route::get('/entrenos/{id}', [EntrenoController::class, 'show']);

