import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const yearParam = url.searchParams.get('year');
    const facultyParam = url.searchParams.get('faculty');

    let specialties = db.getSpecialties();

    if (yearParam && yearParam !== 'all' && yearParam !== 'TOUS') {
      const y = parseInt(yearParam, 10);
      if (!isNaN(y)) {
        specialties = specialties.filter(s => s.year === y);
      }
    }

    if (facultyParam && facultyParam !== 'TOUS') {
      specialties = specialties.filter(s => !s.faculty || s.faculty === 'TOUS' || s.faculty === facultyParam);
    }

    return NextResponse.json(
      { success: true, specialties },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
