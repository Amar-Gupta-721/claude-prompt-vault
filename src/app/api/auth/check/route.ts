import { NextResponse } from 'next/server';
import { getAdminFromCookies } from '../../../../lib/auth';

export async function GET() {
  const isAdmin = await getAdminFromCookies();
  return NextResponse.json({ isAdmin });
}
