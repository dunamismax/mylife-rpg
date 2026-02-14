<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Habit extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'type',
        'xp_reward',
        'stats_affected',
        'hp_affected',
        'streak',
        'last_completed_at',
        'xp_rewarded_on',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'xp_reward' => 'integer',
            'hp_affected' => 'integer',
            'streak' => 'integer',
            'last_completed_at' => 'date',
            'xp_rewarded_on' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
