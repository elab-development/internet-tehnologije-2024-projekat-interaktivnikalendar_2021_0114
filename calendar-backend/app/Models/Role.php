<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    const SCRUM_MASTER = 'Scrum Master';
    const PRODUCT_OWNER = 'Product Owner';
    const DEVELOPER = 'Developer';

    protected $fillable = ['name'];

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
