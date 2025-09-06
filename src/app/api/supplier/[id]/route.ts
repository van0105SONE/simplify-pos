import prisma from '@/lib/prisma';
import { SupplierEntity } from '@/types/pos';
import { NextRequest, NextResponse } from 'next/server';

// GET: Fetch all products
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const supply = await prisma.supplier.findFirst(
            {
                where: {
                    id: id
                }
            }
        ); // your DB logic
        
        if(!supply){
           return NextResponse.json({status: 400})
        }
        return NextResponse.json({
            id: supply.id,
            name: supply.name,
            import_price: Number(supply.import_price),
            stock: Number(supply.stock),
            status: supply.status,
        } as unknown as SupplierEntity);
    } catch (error) {
        console.log('error: ', error)
        return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
    }
}