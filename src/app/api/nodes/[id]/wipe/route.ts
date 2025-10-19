import { NextResponse } from 'next/server';
import { wipeNode } from '@/lib/nodeManager';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const updatedNode = await wipeNode((await params).id);
    return NextResponse.json(updatedNode);
  } catch (error) {
    return NextResponse.json({ message: 'Node not found or failed to wipe' }, { status: 404 });
  }
}