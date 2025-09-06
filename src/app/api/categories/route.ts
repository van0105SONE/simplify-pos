
// app/api/products/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Category } from '@/types/pos';


// GET: Fetch all categories
export async function GET() {
    try {
        const categories = await prisma.category.findMany(); // your DB logic
        return NextResponse.json(categories);
    } catch (error) {
        console.log('error', error)
        return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
    }
}

// POST: Create a new product
export async function POST(request: Request) {
    try {
        const body: Category = await request.json();
        const newProduct = await prisma.category.create({
            data: {
                ...body
            }
        });
        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.log('error', error)
        return NextResponse.json({ message: 'Failed to create product' }, { status: 500 });
    }
}


// POST: Create a new product
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        console.log('Deleting product with ID:', id);
        if (!id) {
            return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
        }
        const newProduct = await prisma.category.delete({
            where: { id: id }
        });
        return NextResponse.json(newProduct, { status: 200 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ message: 'Failed to create product' }, { status: 500 });
    }
}