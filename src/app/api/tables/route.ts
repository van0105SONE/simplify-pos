// app/api/products/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { TableEntity } from '@/types/pos';

// GET: Fetch all products
export async function GET() {
    try {
        const tables = await prisma.table.findMany(); // your DB logic
        return NextResponse.json(tables);
    } catch (error) {
        console.log('error', error)
        return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
    }
}

// POST: Create a new product
export async function POST(request: Request) {
    try {
        const body: TableEntity = await request.json();
        const newProduct = await prisma.table.create({
            data: {
                name: body.name,
                seat: body.seat,
                status: false
            }
        });
        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.log('error', error)
        return NextResponse.json({ message: 'Failed to create product' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        await prisma.table.delete({
            where: {
                id: id
            }
        });
        return NextResponse.json({ message: 'delete succesful' }, { status: 200 });
    } catch (error) {
        console.log('error', error)
        return NextResponse.json({ message: 'Failed to create product' }, { status: 500 });
    }
}
