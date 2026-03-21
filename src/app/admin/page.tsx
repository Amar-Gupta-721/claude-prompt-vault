import dbConnect from '@/lib/mongodb';
import { Prompt, Skill, Stats } from '@/lib/models';
import AdminDashboardClient from '@/components/AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  await dbConnect();

  const [prompts, skills, statsDoc] = await Promise.all([
    Prompt.find({}).sort({ createdAt: -1 }).lean(),
    Skill.find({}).sort({ createdAt: -1 }).lean(),
    Stats.findOne({}).lean(),
  ]);

  return (
    <AdminDashboardClient
      initialPrompts={JSON.parse(JSON.stringify(prompts))}
      initialSkills={JSON.parse(JSON.stringify(skills))}
      stats={{
        prompts: prompts.length,
        skillRepos: skills.length,
        copiesMade: (statsDoc as { copiesMade?: number } | null)?.copiesMade ?? 0,
      }}
    />
  );
}
