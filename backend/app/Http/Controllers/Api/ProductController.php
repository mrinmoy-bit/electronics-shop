<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Exception; // Import the Exception class

class ProductController extends Controller
{
    // Get all products
    public function index()
    {
        $products = Product::all();
        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    // Get a single product
    public function show($id)
    {
        $product = Product::find($id);
        
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $product
        ]);
    }

    // Create a new product
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:Phones,PCs', // Assuming category validation from previous prompt
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0'
        ]);

        $product = Product::create([
            'name' => $request->name,
            'category' => $request->category,
            'price' => $request->price,
            'stock' => $request->stock
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully',
            'data' => $product
        ], 201);
    }

    // Update an existing product
    public function update(Request $request, $id)
    {
        try {
            // Find the product or throw an exception (404 Not Found)
            $product = Product::findOrFail($id); 
            
            // Validate the incoming request data
            $request->validate([
                'name' => 'required|string|max:255',
                // NOTE: Using a broader validation here compared to 'store' for flexibility
                'category' => 'required|string|max:100', 
                'price' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0'
            ]);

            // Update the product attributes
            $product->update([
                'name' => $request->name,
                'category' => $request->category,
                'price' => $request->price,
                'stock' => $request->stock,
            ]);

            // Return a success response with the updated product
            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'data' => $product // Note: changed 'product' key to 'data' for consistency
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // Handle case where Product::findOrFail($id) does not find a product
            return response()->json(['success' => false, 'message' => 'Product not found'], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Laravel's automatic validation handling is generally sufficient, 
            // but catching it explicitly allows custom error formatting if needed.
            throw $e; 
        } catch (Exception $e) {
            // General catch-all for other errors
            return response()->json(['success' => false, 'message' => 'Failed to update product'], 500);
        }
    }

    // Delete a product
    public function destroy($id)
    {
        try {
            // Find the product or throw an exception (404 Not Found)
            $product = Product::findOrFail($id); 
            
            // Delete the product
            $product->delete();

            // Return a success response (200 OK or 204 No Content is also common)
            return response()->json([
                'success' => true,
                'message' => 'Product deleted successfully'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
             // Handle case where Product::findOrFail($id) does not find a product
            return response()->json(['success' => false, 'message' => 'Product not found'], 404);
        } catch (Exception $e) {
            // General catch-all for other errors
            return response()->json(['success' => false, 'message' => 'Failed to delete product'], 500);
        }
    }
}