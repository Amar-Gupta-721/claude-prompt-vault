import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import { Prompt } from '../../../lib/models';
import { getAdminFromCookies } from '../../../lib/auth';

export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  const query: Record<string, unknown> = {};
  if (category && category !== 'all') {
    query.category = category;
  }
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { preview: { $regex: search, $options: 'i' } },
      { full: { $regex: search, $options: 'i' } },
    ];
  }

  const prompts = await Prompt.find(query).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ prompts, total: prompts.length });
}

export async function POST(req: NextRequest) {
  const isAdmin = await getAdminFromCookies();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const body = await req.json();
  const { title, category, author, preview, full } = body;

  if (!title || !category || !author || !preview || !full) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  const prompt = await Prompt.create({ title, category, author, preview, full });
  return NextResponse.json({ prompt }, { status: 201 });
}
