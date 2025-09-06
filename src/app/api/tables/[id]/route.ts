// app/api/product/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // adjust the import if needed
import { TableEntity } from '@/types/pos';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: number }> }) {
    const { id } = await params;
    try {
        const table = await prisma.table.findFirst({
            where: {
                id: Number(id)
            }
        });
        if (!table) {
            return NextResponse.json(null, { status: 200 });
        }

        return NextResponse.json(table, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: number }> }) {
    const { id } = await params;

    const body: TableEntity = await req.json();
    try {
        const table = await prisma.table.findFirst({
            where: {
                id: Number(id)
            }
        });

        if (!table) {
            return NextResponse.json({
                message: "Table isn't founded"
            }, { status: 400 });
        }

        await prisma.table.update({
            where: {
                id: table.id
            },
            data: {
                name: body.name,
                seat: body.seat,
                status: body.status
            }
        })


        return NextResponse.json(table, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

