// src/app/api/images/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
  // Return a hardcoded list of image names for the demo
  const mockImages = [
    'cirros-0.5.2-x86_64-disk.img.qcow2',
    'tinycore-11.1.qcow2',
    'ubuntu-20.04-cloudimg-amd64.qcow2'
  ];
  
  return NextResponse.json(mockImages);
}


// import { NextResponse } from 'next/server';
// import fs from 'fs/promises';
// import path from 'path';

// export async function GET() {
//   const imagesDirectory = path.join(process.cwd(), 'base_images');

//   try {
//     const allFiles = await fs.readdir(imagesDirectory);
//     const qcow2Images = allFiles.filter(file => file.endsWith('.qcow2'));
//     return NextResponse.json(qcow2Images);

//   } catch (error) {
//     console.error('Failed to read base images directory:', error);
//     return NextResponse.json(
//       { error: 'Could not retrieve base images. Check server logs.' },
//       { status: 500 }
//     );
//   }
// }