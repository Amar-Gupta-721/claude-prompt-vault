import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Skill } from '@/lib/models';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET() {
  await dbConnect();
  const skills = await Skill.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ skills, total: skills.length });
}

export async function POST(req: NextRequest) {
  const isAdmin = await getAdminFromCookies();
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const body = await req.json();
  const skill = await Skill.create(body);
  return NextResponse.json({ skill }, { status: 201 });
}
