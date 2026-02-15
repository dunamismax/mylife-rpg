<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DailyCheckIn extends Model
{
    /** @use HasFactory<\Database\Factories\DailyCheckInFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'check_in_date',
        'daily_intention',
        'if_then_plan',
        'craving_intensity',
        'trigger_notes',
        'reflection',
        'slip_happened',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'check_in_date' => 'date',
            'craving_intensity' => 'integer',
            'slip_happened' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
