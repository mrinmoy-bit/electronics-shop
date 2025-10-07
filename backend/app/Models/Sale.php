<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_number',
        'total_amount',
        'served_by'
    ];

    protected $casts = [
        'total_amount' => 'decimal:2'
    ];

    // Relationship: A sale has many sale items
    public function saleItems()
    {
        return $this->hasMany(SaleItem::class);
    }
}