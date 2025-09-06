// app/api/product/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // adjust the import if needed

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: number }> }) {
    const { id } = await params;
    try {

        const currentOrder = await prisma.order.findFirst({
            where: {
                table_id: Number(id),
                is_checkout: false,

            },
            include: {
                orderItems: {
                    include: {
                        products: true
                    }
                }
            }
        });
        if (!currentOrder) {
            return NextResponse.json(null, { status: 200 });
        }

        return NextResponse.json(currentOrder, { status: 200 });
    } catch (error) {
        console.log('error', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
