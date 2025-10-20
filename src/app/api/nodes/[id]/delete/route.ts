import { NextResponse } from 'next/server';
import { deleteNode } from '@/lib/nodeManager';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await deleteNode((await params).id);
    return NextResponse.json({msg:"deleted"});
  } catch (error) {
    return NextResponse.json({ message: 'Node not found or failed to wipe' }, { status: 404 });
  }
}