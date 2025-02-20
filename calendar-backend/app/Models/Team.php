<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class Team extends Pivot
{
    protected $table = 'teams';

    protected $fillable = [
        'sprint_id',
        'user_id',
        'is_active',
    ];
}
