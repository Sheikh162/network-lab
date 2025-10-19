import { NextResponse } from 'next/server';
import { createNode, getAllNodes } from '@/lib/nodeManager';

export async function GET() {
    try {
        const nodes = await getAllNodes();
        return NextResponse.json(nodes);
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST() {
  try {
    const newNode = await createNode();
    return NextResponse.json(newNode, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}