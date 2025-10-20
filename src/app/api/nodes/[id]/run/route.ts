// src/app/api/nodes/[id]/run/route.ts

import { NextResponse } from 'next/server';
import { mockStartNode } from '@/lib/mockNodeManager';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const updatedNode = mockStartNode((await params).id);
  if (updatedNode) {
    return NextResponse.json(updatedNode);
  }
  return NextResponse.json({ message: 'Node not found' }, { status: 404 });
}

// import { NextResponse } from 'next/server';
// import { startNode } from '@/lib/nodeManager';

// export async function POST(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const updatedNode = await startNode((await params).id);  
//     return NextResponse.json(updatedNode);
//   } catch (error) {
//     return NextResponse.json({ message: 'Node not found or failed to start' }, { status: 404 });
//   }
// }