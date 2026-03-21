import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Prompt } from '@/lib/models';
import { getAdminFromCookies } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const isAdmin = await getAdminFromCookies();
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const body = await req.json();
  const prompt = await Prompt.findByIdAndUpdate(params.id, body, { new: true });
  if (!prompt) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ prompt });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const isAdmin = await getAdminFromCookies();
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  await Prompt.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
