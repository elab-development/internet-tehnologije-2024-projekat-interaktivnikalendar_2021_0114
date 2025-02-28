<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invitation extends Model
{
    protected $fillable = ['email', 'sprint_id', 'token'];

    public function sprint()
    {
        return $this->belongsTo(Sprint::class);
    }
}
