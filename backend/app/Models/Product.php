<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'price',
        'stock'
    ];

    protected $casts = [
        'price' => 'decimal:2'
    ];

    // Relationship: A product can be in many sale items
    public function saleItems()
    {
        return $this->hasMany(SaleItem::class);
    }
}