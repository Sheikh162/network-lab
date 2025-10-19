import { NextResponse } from 'next/server';
import { startNode } from '@/lib/nodeManager';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const updatedNode = await startNode((await params).id);  
    return NextResponse.json(updatedNode);
  } catch (error) {
    return NextResponse.json({ message: 'Node not found or failed to start' }, { status: 404 });
  }
}