import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import { Prompt, Skill, Stats } from '../../../../lib/models';
import { seedPrompts, seedSkills } from '../../../../lib/seedData';

// GET /api/admin/seed — open in browser to seed prompts & skills
// Admin login uses ADMIN_USERNAME + ADMIN_PASSWORD from .env.local directly (no DB needed)
export async function GET() {
  await dbConnect();

  const existingPrompts = await Prompt.countDocuments();
  if (existingPrompts === 0) {
    await Prompt.insertMany(seedPrompts);
  }

  const existingSkills = await Skill.countDocuments();
  if (existingSkills === 0) {
    await Skill.insertMany(seedSkills);
  }

  const statsCount = await Stats.countDocuments();
  if (statsCount === 0) {
    await Stats.create({ copiesMade: 0 });
  }

  return NextResponse.json({
    success: true,
    message: 'Prompts & skills seeded. Admin login uses .env.local credentials directly — no seeding needed.',
    promptsInDB: await Prompt.countDocuments(),
    skillsInDB: await Skill.countDocuments(),
  });
}
