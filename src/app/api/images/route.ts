import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  const imagesDirectory = path.join(process.cwd(), 'base_images');

  try {
    const allFiles = await fs.readdir(imagesDirectory);
    const qcow2Images = allFiles.filter(file => file.endsWith('.qcow2'));
    return NextResponse.json(qcow2Images);

  } catch (error) {
    console.error('Failed to read base images directory:', error);
    return NextResponse.json(
      { error: 'Could not retrieve base images. Check server logs.' },
      { status: 500 }
    );
  }
}