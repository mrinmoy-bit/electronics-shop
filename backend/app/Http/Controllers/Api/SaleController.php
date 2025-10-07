<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    // Create a new sale
    public function store(Request $request)
    {
        $request->validate([
            'served_by' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        try {
            DB::beginTransaction();

            // Generate unique invoice number
            $invoiceNumber = 'INV-' . date('Ymd') . '-' . str_pad(Sale::count() + 1, 4, '0', STR_PAD_LEFT);

            $totalAmount = 0;
            $saleItemsData = [];

            // Validate stock and calculate total
            foreach ($request->items as $item) {
                $product = Product::find($item['product_id']);

                if ($product->stock < $item['quantity']) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => "Insufficient stock for {$product->name}"
                    ], 400);
                }

                $itemTotal = $product->price * $item['quantity'];
                $totalAmount += $itemTotal;

                $saleItemsData[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price,
                    'total_price' => $itemTotal,
                    'product' => $product
                ];

                // Decrease stock
                $product->stock -= $item['quantity'];
                $product->save();
            }

            // Create sale
            $sale = Sale::create([
                'invoice_number' => $invoiceNumber,
                'total_amount' => $totalAmount,
                'served_by' => $request->served_by
            ]);

            // Create sale items
            foreach ($saleItemsData as $itemData) {
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $itemData['product_id'],
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $itemData['unit_price'],
                    'total_price' => $itemData['total_price']
                ]);
            }

            DB::commit();

            // Load relationships for response
            $sale->load('saleItems.product');

            return response()->json([
                'success' => true,
                'message' => 'Sale completed successfully',
                'data' => $sale
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to process sale: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get all sales
    public function index()
    {
        $sales = Sale::with('saleItems.product')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $sales
        ]);
    }

    // Get single sale with details
    public function show($id)
    {
        $sale = Sale::with('saleItems.product')->find($id);

        if (!$sale) {
            return response()->json([
                'success' => false,
                'message' => 'Sale not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $sale
        ]);
    }
}