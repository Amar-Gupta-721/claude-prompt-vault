import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import { Stats, Prompt, Skill } from '../../../lib/models';

export async function GET() {
  await dbConnect();

  const [statsDoc, promptCount, skillCount] = await Promise.all([
    Stats.findOne({}).lean(),
    Prompt.countDocuments(),
    Skill.countDocuments(),
  ]);

  return NextResponse.json({
    prompts: promptCount,
    skillRepos: skillCount,
    copiesMade: (statsDoc as { copiesMade?: number } | null)?.copiesMade ?? 0,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (body.action !== 'increment_copy') {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  await dbConnect();
  const stats = await Stats.findOneAndUpdate(
    {},
    { $inc: { copiesMade: 1 } },
    { upsert: true, new: true }
  );

  return NextResponse.json({ copiesMade: stats.copiesMade });
}
