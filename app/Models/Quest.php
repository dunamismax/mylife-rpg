<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Quest extends Model
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
        'difficulty',
        'stats_affected',
        'hp_affected',
        'completed',
        'due_date',
        'is_recurring',
        'recurrence_pattern',
        'completed_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'xp_reward' => 'integer',
            'hp_affected' => 'integer',
            'completed' => 'boolean',
            'is_recurring' => 'boolean',
            'due_date' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
