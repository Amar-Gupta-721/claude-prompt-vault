import dbConnect from '@/lib/mongodb';
import { Prompt, Skill, Stats } from '@/lib/models';
import HomeClient from '@/components/HomeClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  await dbConnect();

  const [prompts, skills, statsDoc] = await Promise.all([
    Prompt.find({}).sort({ createdAt: -1 }).lean(),
    Skill.find({}).sort({ createdAt: -1 }).lean(),
    Stats.findOne({}).lean(),
  ]);

  const stats = {
    prompts: prompts.length,
    skillRepos: skills.length,
    copiesMade: (statsDoc as { copiesMade?: number } | null)?.copiesMade ?? 0,
  };

  return (
    <HomeClient
      initialPrompts={JSON.parse(JSON.stringify(prompts))}
      initialSkills={JSON.parse(JSON.stringify(skills))}
      initialStats={stats}
    />
  );
}
