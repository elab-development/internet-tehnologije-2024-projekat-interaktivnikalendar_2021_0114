<?php

namespace App\Models;

use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Sprint extends Model
{
    /** @use HasFactory<\Database\Factories\SprintFactory> */
    use HasFactory;
    protected $fillable = [
        'name',
        'start',
        'end',
        'color', // Add color attribute
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'teams')->using(Team::class)->withPivot('is_active');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
