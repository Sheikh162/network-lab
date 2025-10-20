// src/app/api/nodes/[id]/stop/route.ts

import { NextResponse } from 'next/server';
import { mockStopNode } from '@/lib/mockNodeManager';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const updatedNode = mockStopNode((await params).id);
  if (updatedNode) {
    return NextResponse.json(updatedNode);
  }
  return NextResponse.json({ message: 'Node not found' }, { status: 404 });
}


// import { NextResponse } from 'next/server';
// import { stopNode } from '@/lib/nodeManager';

// export async function POST(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const updatedNode = await stopNode((await params).id);
//     return NextResponse.json(updatedNode);
//   } catch (error) {
//     return NextResponse.json({ message: 'Node not found or failed to stop' }, { status: 404 });
//   }
// }