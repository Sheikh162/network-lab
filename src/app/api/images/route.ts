import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  const mockImages = [
    'cirros-0.5.2-x86_64-disk.img.qcow2',
    'tinycore-11.1.qcow2',
    'ubuntu-20.04-cloudimg-amd64.qcow2'
  ];
  
  return NextResponse.json(mockImages);
}