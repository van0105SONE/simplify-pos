// app/api/products/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CurrencyEntity } from '@/types/pos';

// GET: Fetch all products
export async function GET() {
    try {
        const currency = await prisma.currency.findMany(); // your DB logic
        return NextResponse.json(currency);
    } catch (error) {
        console.log('error', error)
        return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
    }
}


// POST: Create a new product
export async function POST(request: Request) {
    try {
        console.log("incoming request: ", request.body)
        const body: CurrencyEntity = await request.json();
        const isExist = await prisma.currency.findFirst({
            where: {
                symbol: body.symbol
            }
        });
        if (isExist) {
            return NextResponse.json({ message: "Currency is exist already" }, { status: 409 })
        }
        const newCurrencys = await prisma.currency.create({
            data: {
                symbol: body.symbol,
                code: body.code,
                currency_name: body.currency_name,
                is_main: body.is_main
            }
        });
        return NextResponse.json(newCurrencys as CurrencyEntity, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ message: 'Failed to create product' }, { status: 500 });
    }
}

