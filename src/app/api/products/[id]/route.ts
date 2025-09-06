import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // use string, not "123"
) {
  try {
    const { id } = await params; // no need to await

    if (!id) {
      return NextResponse.json({ status: 400 });
    }

    const product = await prisma.menues.findFirst({
      where: { id },
      include: { category: true },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("error", error);
    return NextResponse.json(
      { message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
