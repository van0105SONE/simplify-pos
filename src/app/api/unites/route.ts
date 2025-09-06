// app/api/products/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Category, ProductEntity, UnitType } from '@/types/pos';


// GET: Fetch all categories
export async function GET() {
    try {
        const categories = await prisma.unitType.findMany(); // your DB logic
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
    }
}

// POST: Create a new product
export async function POST(request: Request) {
    try {
        const body: UnitType = await request.json();

        const newProduct = await prisma.unitType.create({
            data: {
                name: body.name
            }
        });
        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
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
        const newProduct = await prisma.unitType.delete({
            where: { id: id }
        });
        return NextResponse.json(newProduct, { status: 200 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ message: 'Failed to create product' }, { status: 500 });
    }
}
