// import mongoose, { Schema, Document, Model } from 'mongoose';

// // ─── PROMPT MODEL ───────────────────────────────────────────
// export interface IPrompt extends Document {
//   title: string;
//   category: string;
//   author: string;
//   preview: string;
//   full: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const PromptSchema = new Schema<IPrompt>(
//   {
//     title: { type: String, required: true, trim: true },
//     category: { type: String, required: true, trim: true },
//     author: { type: String, required: true, trim: true },
//     preview: { type: String, required: true, trim: true },
//     full: { type: String, required: true, trim: true },
//   },
//   { timestamps: true }
// );

// // ─── SKILL MODEL ───────────────────────────────────────────
// export interface ISkill extends Document {
//   name: string;
//   desc: string;
//   icon: string;
//   tag: string;
//   github: string;
//   createdAt: Date;
// }

// const SkillSchema = new Schema<ISkill>(
//   {
//     name: { type: String, required: true, trim: true },
//     desc: { type: String, required: true, trim: true },
//     icon: { type: String, required: true },
//     tag: { type: String, required: true, trim: true },
//     github: { type: String, required: true, trim: true },
//   },
//   { timestamps: true }
// );

// // ─── STATS MODEL ───────────────────────────────────────────
// export interface IStats extends Document {
//   copiesMade: number;
//   updatedAt: Date;
// }

// const StatsSchema = new Schema<IStats>(
//   {
//     copiesMade: { type: Number, default: 0 },
//   },
//   { timestamps: true }
// );

// export const Prompt: Model<IPrompt> =
//   mongoose.models.Prompt ?? mongoose.model<IPrompt>('Prompt', PromptSchema);

// export const Skill: Model<ISkill> =
//   mongoose.models.Skill ?? mongoose.model<ISkill>('Skill', SkillSchema);

// export const Stats: Model<IStats> =
//   mongoose.models.Stats ?? mongoose.model<IStats>('Stats', StatsSchema);

import mongoose, { Schema, Document, Model } from 'mongoose';

// ─── PROMPT MODEL ───────────────────────────────────────────
export interface IPrompt extends Document {
  title: string;
  category: string;
  author: string;
  preview: string;
  full: string;
  createdAt: Date;
  updatedAt: Date;
}

const PromptSchema = new Schema<IPrompt>(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    preview: { type: String, required: true, trim: true },
    full: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// ─── SKILL MODEL ───────────────────────────────────────────
export interface ISkill extends Document {
  name: string;
  desc: string;
  icon: string;
  tag: string;
  github: string;
  createdAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true, trim: true },
    desc: { type: String, required: true, trim: true },
    icon: { type: String, required: true },
    tag: { type: String, required: true, trim: true },
    github: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// ─── STATS MODEL ───────────────────────────────────────────
export interface IStats extends Document {
  copiesMade: number;
  updatedAt: Date;
}

const StatsSchema = new Schema<IStats>(
  {
    copiesMade: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Prompt: Model<IPrompt> =
  mongoose.models.Prompt ?? mongoose.model<IPrompt>('Prompt', PromptSchema);

export const Skill: Model<ISkill> =
  mongoose.models.Skill ?? mongoose.model<ISkill>('Skill', SkillSchema);

export const Stats: Model<IStats> =
  mongoose.models.Stats ?? mongoose.model<IStats>('Stats', StatsSchema);

// ─── PROMPT SUBMISSION MODEL ───────────────────────────────────────────
export interface IPromptSubmission extends Document {
  title: string;
  category: string;
  promptText: string;
  submitterName: string;
  submitterEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

const PromptSubmissionSchema = new Schema<IPromptSubmission>(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    promptText: { type: String, required: true, trim: true },
    submitterName: { type: String, default: 'Anonymous', trim: true },
    submitterEmail: { type: String, required: true, trim: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

export const PromptSubmission: Model<IPromptSubmission> =
  mongoose.models.PromptSubmission ??
  mongoose.model<IPromptSubmission>('PromptSubmission', PromptSubmissionSchema);
