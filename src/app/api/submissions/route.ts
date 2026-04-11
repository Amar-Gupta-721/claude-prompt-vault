import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import { PromptSubmission } from '../../../lib/models';
import { getAdminFromCookies } from '../../../lib/auth';

export async function GET() {
  const isAdmin = await getAdminFromCookies();
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const submissions = await PromptSubmission.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ submissions });
}
