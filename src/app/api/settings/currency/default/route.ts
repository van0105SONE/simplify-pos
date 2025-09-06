import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    req: NextRequest // use string, not "123"
) {
    try {


        const currency = await prisma.currency.findFirst({
            where: {
                is_main: true
            }
        });

        return NextResponse.json(currency);
    } catch (error) {
        console.error("error", error);
        return NextResponse.json(
            { message: "Failed to fetch product" },
            { status: 500 }
        );
    }
}
