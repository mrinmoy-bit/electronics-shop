<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Product::create([
            'name' => 'iPhone 15 Pro',
            'category' => 'Phones',
            'price' => 999.99,
            'stock' => 25
        ]);

        Product::create([
            'name' => 'Samsung Galaxy S24',
            'category' => 'Phones',
            'price' => 849.99,
            'stock' => 30
        ]);

        Product::create([
            'name' => 'Google Pixel 8',
            'category' => 'Phones',
            'price' => 699.99,
            'stock' => 20
        ]);

        Product::create([
            'name' => 'Gaming PC RTX 4080',
            'category' => 'PCs',
            'price' => 2499.99,
            'stock' => 8
        ]);

        Product::create([
            'name' => 'MacBook Air M3',
            'category' => 'PCs',
            'price' => 1299.99,
            'stock' => 15
        ]);

        Product::create([
            'name' => 'Dell XPS 15',
            'category' => 'PCs',
            'price' => 1599.99,
            'stock' => 12
        ]);
    }
}