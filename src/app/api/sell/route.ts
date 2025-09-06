// app/api/products/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { OrderEntity } from '@/types/pos';
// GET: Fetch all products
export async function GET() {
    try {
        const products = await prisma.menues.findMany(); // your DB logic
        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
    }
}



// POST: Create a new product
export async function POST(request: Request) {
    try {
        const body: OrderEntity = await request.json();
        //check wheter if order is null or not
        //if it is null then create a new order
        if (body && body.id) {
            body.items.forEach(async (item) => {
                if (item.id) {
                    await prisma.orderItems.update({
                        where: {
                            id: 1
                        },
                        data: {
                            product_id: item.menuItem.id,
                            quantity: item.quantity,
                            price: item.menuItem.price * item.quantity,
                        }
                    });
                } else {
                    await prisma.orderItems.create({
                        data: {
                            order_id: body.id,
                            product_id: item.menuItem.id,
                            menu_name: item.menuItem.name,
                            quantity: item.quantity,
                            price: item.menuItem.price * item.quantity,
                        }
                    })

                }
            })

            await prisma.order.update({
                where: {
                    id: body.id
                },
                data: {
                    total: body.total,
                    tax: body.tax,
                    subtotal: body.subtotal,
                    status: body.status,
                    is_checkout: body.is_checkout,
                    table: {
                        connect: { id: body.table_id }, // Assuming tableNumber is a string
                    }
                }
            })

            if (body.is_checkout) {
                await prisma.table.update({
                    where: { id: Number(body.table_id) },
                    data: {
                        status: body.is_checkout, // Mark table as available
                    }
                });
            }
            return NextResponse.json({ status: 201 });
        } else {
            console.log('Creating new order with items:', body.table_id);
            const newProduct = await prisma.order.create({
                data: {
                    total: body.total,
                    tax: body.tax,
                    subtotal: body.subtotal,
                    status: body.status,
                    is_checkout: body.is_checkout,
                    table: {
                        connect: { id: Number(body.table_id) }, // Assuming tableNumber is a string
                    },
                    orderItems: {
                        create: body.items.map(item => ({
                            product_id: item.menuItem.id,
                            quantity: item.quantity,
                            price: item.menuItem.price,
                            menu_name: item.menuItem.name,
                        })),
                    },
                }
            });

            console.log('table id:   ', body.table_id);
            const table = await prisma.table.update({
                where: { id: Number(body.table_id) },
                data: {
                    status: body.is_checkout, // Mark table as occupied 
                }
            })
            console.log('table updated:', table);
            console.log('New order created:', newProduct);
            return NextResponse.json(newProduct, { status: 201 });
        }


    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ message: 'Failed to create product' }, { status: 500 });
    }
}
