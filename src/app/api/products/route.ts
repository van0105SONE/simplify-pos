// app/api/products/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ProductEntity } from '@/types/pos';

// GET: Fetch all products
export async function GET() {
    try {
        const products = await prisma.menues.findMany(
            {
                include: {
                    category: true, // Include category details if needed
                },
            }
        ); // your DB logic
        return NextResponse.json(products);
    } catch (error) {
        console.log('error', error)
        return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        // Assuming the request body contains the product ID to delete
        const { id } = await request.json();

        console.log('Deleting product with ID:', id);


        return NextResponse.json({ message: 'Delete successful' }, { status: 200 });
    } catch (error: any) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// POST: Create a new product
export async function POST(request: Request) {
    try {
        const body: ProductEntity = await request.json();
        const newProduct = await prisma.menues.create({
            data: {
                image: '',
                name: body.name,
                price: body.price,
                description: 'N/A',
                stock: body.stock,
                unitType: body.unitType,
                category: {
                    connect: {
                        id: body.category_id
                    }
                }
            }
        });

        console.log('product: ', newProduct)
        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.log('error: ', error)
        return NextResponse.json({ message: 'Failed to create product' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body: ProductEntity = await request.json();
        const exist = await prisma.menues.findFirst({
            where: {
                id: body.id
            }
        })

        if (!exist) {
            return NextResponse.json({ message: "Product isn't found" }, { status: 400 });
        }

        const newProduct = await prisma.menues.update({
            where: {
                id: body.id
            },
            data: {
                image: '',
                name: body.name,
                price: body.price,
                description: 'N/A',
                stock: body.stock,
                unitType: body.unitType,
                category: {
                    connect: {
                        id: body.category_id
                    }
                }
            }
        });
        return NextResponse.json(newProduct, { status: 200 });
    } catch (error) {
        console.log('error: ', error)
        return NextResponse.json({ message: 'Failed to create product' }, { status: 500 });
    }
}
