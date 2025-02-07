<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        return $this->hasMany(User::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
