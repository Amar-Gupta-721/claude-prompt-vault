import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import { PromptSubmission } from '../../../../lib/models';
import { getAdminFromCookies } from '../../../../lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await getAdminFromCookies();
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await dbConnect();
  const body = await req.json();
  const submission = await PromptSubmission.findByIdAndUpdate(id, { status: body.status }, { new: true });
  if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ submission });
}
