<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Stat extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'level',
        'xp',
        'hp',
        'strength',
        'endurance',
        'intelligence',
        'wisdom',
        'charisma',
        'willpower',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'level' => 'integer',
            'xp' => 'integer',
            'hp' => 'integer',
            'strength' => 'integer',
            'endurance' => 'integer',
            'intelligence' => 'integer',
            'wisdom' => 'integer',
            'charisma' => 'integer',
            'willpower' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
