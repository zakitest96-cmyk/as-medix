import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { QCMAttempt } from '@/types';
import { getCurrentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';

import { QCM } from '@/types';

let cachedCloudQcms: any[] | null = null;
let lastCloudFetchTime = 0;
const CLOUD_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get('userId');

    // Strictly isolate statistics: each user gets strictly their own attempts & stats
    const effectiveUserId = (currentUser?.role === 'ADMIN' && requestedUserId)
      ? requestedUserId
      : (currentUser?.id || 'usr_demo_free');

    // Load local memory DB qcms + Supabase cloud qcms for true platform total
    let qcmsMap = new Map<string, QCM>();
    const localQcms = db.getQcms();
    for (const q of localQcms) {
      qcmsMap.set(q.id, q);
    }
    try {
      let cloudQcms = cachedCloudQcms;
      const isCacheFresh = cloudQcms && (Date.now() - lastCloudFetchTime < CLOUD_CACHE_TTL_MS);

      if (!isCacheFresh) {
        const { data, error } = await supabaseAdmin.from('qcms').select('*');
        if (!error && Array.isArray(data)) {
          cloudQcms = data;
          cachedCloudQcms = data;
          lastCloudFetchTime = Date.now();
        }
      }

      if (Array.isArray(cloudQcms)) {
        for (const row of cloudQcms) {
          qcmsMap.set(row.id, {
            id: row.id,
            title: row.title || row.question || 'QCM',
            specialtyId: row.specialty_id || row.specialty || 'cardio',
            specialtyName: row.specialty_name || 'Cardiologie',
            courseId: row.course_id || undefined,
            courseTitle: row.course_title || undefined,
            faculty: row.faculty || 'ORAN',
            source: row.source || 'Annales Examens',
            rang: row.rang || 'Rang A',
            difficulty: row.difficulty || 'Moyen',
            type: row.type || 'SINGLE',
            vignette: row.vignette || '',
            question: row.question || row.title || '',
            options: Array.isArray(row.options) ? row.options : [],
            correctAnswers: Array.isArray(row.correct_answers) ? row.correct_answers : [0],
            explanation: row.explanation || '',
            reference: row.reference || "Faculté de Médecine d'Alger",
            tags: Array.isArray(row.tags) ? row.tags : [],
            accessLevel: row.access_level || 'FREE',
            year: row.year ? Number(row.year) as any : undefined
          });
        }
      }
    } catch (sErr) {
      console.warn('[Attempt API] Supabase QCM fetch error:', sErr);
    }

    const allQcms = Array.from(qcmsMap.values());
    const stats = db.getUserQcmStats(effectiveUserId, allQcms);
    const userAttempts = db.getUserAttempts(effectiveUserId);
    const specialties = db.getSpecialties();
    return NextResponse.json({
      success: true,
      ...stats,
      userAttempts,
      specialties,
      userId: effectiveUserId
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();
    const { userId, qcmId, userAnswers, isCorrect, scorePercentage, timeSpentSeconds } = body;

    // Strictly isolate attempt: prioritize the authenticated session
    const effectiveUserId = currentUser?.id || userId || 'usr_demo_free';

    const attempt: QCMAttempt = {
      id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: effectiveUserId,
      qcmId,
      userAnswers: userAnswers || [],
      isCorrect: Boolean(isCorrect),
      scorePercentage: scorePercentage || 0,
      timeSpentSeconds: timeSpentSeconds || 0,
      attemptedAt: new Date().toISOString()
    };

    db.recordAttempt(attempt);

    // Sync to Supabase qcm_attempts table if user exists in Supabase
    try {
      if (currentUser?.id && currentUser.id.length >= 30) {
        await supabaseAdmin.from('qcm_attempts').insert({
          user_id: currentUser.id,
          qcm_id: qcmId,
          user_answers: userAnswers || [],
          is_correct: Boolean(isCorrect),
          score_percentage: scorePercentage || 0,
          time_spent_seconds: timeSpentSeconds || 0,
          attempted_at: attempt.attemptedAt
        });
      }
    } catch (sbErr) {
      console.error('[Supabase QCM Attempt Sync Error]:', sbErr);
    }

    // Return updated user stats strictly for this user
    const stats = db.getUserQcmStats(effectiveUserId);

    return NextResponse.json({ success: true, attempt, stats });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Erreur enregistrement tentative' }, { status: 500 });
  }
}
