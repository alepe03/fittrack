<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => explode(',', env('CORS_ALLOWED_ORIGINS', 'http://localhost:5173')),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Keep this false for Bearer token auth from Vercel SPA.
    // If you switch to cookie-based Sanctum auth, set to true.
    'supports_credentials' => env('CORS_SUPPORTS_CREDENTIALS', false),
];
