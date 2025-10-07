<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SaleItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'sale_id',
        'product_id',
        'quantity',
        'unit_price',
        'total_price'
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2'
    ];

    // Relationship: A sale item belongs to a sale
    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }

    // Relationship: A sale item belongs to a product
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}