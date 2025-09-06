// app/api/products/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { SupplierEntity } from '@/types/pos';

// GET: Fetch all products
export async function GET() {
    try {
        const supplier = await prisma.supplier.findMany(); // your DB logic

        const result = supplier.map((item) => {
            return {
                id: item.id,
                name: item.name,
                stock: Number(item.stock),
                import_price: Number(item.import_price),
                status: item.status,
                createdAt: item.createdAt,
            } as SupplierEntity;

        });
        return NextResponse.json(result);
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
        if (!id) {
            return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
        }

        const supplierExist = await prisma.supplier.findUnique({
            where: { id: id }
        });

        if (!supplierExist) {
            return NextResponse.json({ message: 'Product is not founded.' }, { status: 400 });
        }
        await prisma.supplier.delete({
            where: { id: supplierExist.id }
        });

        return NextResponse.json({ message: 'Delete successful' }, { status: 200 });
    } catch (error: any) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// POST: Create a new product
export async function POST(request: Request) {
    try {
        const body: SupplierEntity = await request.json();
        const newSupply = await prisma.supplier.create({
            data: {
                name: body.name,
                stock: body.stock,
                import_price: body.import_price,
                status: body.status
            }
        });
        return NextResponse.json({
            id: newSupply.id,
            name: newSupply.name,
            stock: Number(newSupply.stock),
            import_price: Number(newSupply.import_price),
            status: newSupply.status,
            createdAt: newSupply.createdAt,
        } as SupplierEntity, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ message: 'Failed to create product' }, { status: 500 });
    }
}

// POST: Create a new product
export async function PUT(request: Request) {
    try {
        const body: SupplierEntity = await request.json();
        const newSupply = await prisma.supplier.update({
            where: {
                id: body.id
            },
            data: {
                name: body.name,
                stock: body.stock,
                import_price: body.import_price,
                status: body.status
            }
        });
        return NextResponse.json({
            id: newSupply.id,
            name: newSupply.name,
            stock: Number(newSupply.stock),
            import_price: Number(newSupply.import_price),
            status: newSupply.status,
            createdAt: newSupply.createdAt,
        } as SupplierEntity, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ message: 'Failed to create product' }, { status: 500 });
    }
}
