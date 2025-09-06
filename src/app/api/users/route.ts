
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma';
import { UserEntity } from '@/types/pos';
// GET: Fetch all products
export async function GET() {
    try {
        console.log("Fetching users");
        const products = await prisma.user.findMany(); // your DB logic
        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
    }
}



// POST: Create a new product
export async function POST(request: Request) {
    try {
        const body: UserEntity = await request.json();
      const user =  await  prisma.user.create({
            data: {
                name: body.name,
                username: body.username,
                password: body.password,
                role: body.role,
                phone: body.phone,
            }
        });

        return NextResponse.json(user, { status: 201 });

    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ message: 'Failed to create product' }, { status: 500 });
    }
}
