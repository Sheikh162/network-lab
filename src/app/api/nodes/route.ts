// src/app/api/nodes/route.ts

import { NextResponse } from 'next/server';
import { mockGetAllNodes, mockCreateNode } from '@/lib/mockNodeManager';

export async function GET() {
  const nodes = mockGetAllNodes();
  // Add a small delay to simulate network latency
  await new Promise(resolve => setTimeout(resolve, 300));
  return NextResponse.json(nodes);
}

export async function POST(req: Request) {
  const { baseImage } = await req.json();
  if (!baseImage) {
    return NextResponse.json({ message: "Missing base image" }, { status: 400 });
  }
  const newNode = mockCreateNode(baseImage);
  return NextResponse.json(newNode, { status: 201 });
}


// import { NextResponse } from 'next/server';
// import { createNode, getAllNodes } from '@/lib/nodeManager';

// export async function GET() {
//     try {
//         const nodes = await getAllNodes();
//         return NextResponse.json(nodes);
//     } catch (error) {
//         return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
//     }
// }

// export async function POST(req: Request) {
//   try {
//     const { baseImage } = await req.json();
//     if (!baseImage) {
//       return NextResponse.json({ message: "Missing base image" }, { status: 400 });
//     }

//     const newNode = await createNode(baseImage);
//     return NextResponse.json(newNode, { status: 201 });
//   } catch (error: any) {
//     console.error("Error creating node:", error);
//     return NextResponse.json({ message: error.message }, { status: 500 });
//   }
// }
