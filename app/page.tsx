'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Logo } from '@/components/brand/Logo';
import { ALL_SPECIALTIES } from '@/lib/db/seedData';
import { getSpecialtyEmoji } from '@/lib/specialtyEmojis';
import { useFaculty } from '@/components/context/FacultyContext';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useSpecialtyTheme } from '@/components/context/SpecialtyThemeContext';
import { SpecialtyLogo } from '@/components/brand/SpecialtyLogo';

const HeartOverviewCard = dynamic(
  () => import('@/components/home/HeartOverviewCard').then((m) => m.HeartOverviewCard),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-80 rounded-3xl bg-slate-900/40 border border-slate-800/60 animate-pulse flex items-center justify-center text-slate-500 text-sm">
        Chargement...
      </div>
    ),
  }
);

const QcmLaunchModal = dynamic(
  () => import('@/components/modals/QcmLaunchModal').then((m) => m.QcmLaunchModal),
  { ssr: false }
);
import {
  ArrowRight, Check, Sparkles, BookOpen, Brain, ShieldAlert,
  Activity, Star, ChevronRight, CheckCircle2, Lock, Clock, Users, Play,
  Pill, Siren, FileText, Stethoscope, Droplet, Zap, Shield, HelpCircle,
  Building2, CreditCard, ChevronDown, Search, Heart, Eye, Sun, Moon
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { faculty, setFaculty } = useFaculty();

  // If user already has an account and is signed in, redirect directly to Tableau de Bord
  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.authenticated && data.user) {
          router.replace('/dashboard');
        }
      })
      .catch(() => {});
  }, [router]);
  const { theme, toggleTheme } = useTheme();
  const { activeSpecialty, setActiveSpecialtyId } = useSpecialtyTheme();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isQcmModalOpen, setIsQcmModalOpen] = useState<boolean>(false);
  const [modalSpecialtyId, setModalSpecialtyId] = useState<string>('cardio');
  const [specialties, setSpecialties] = useState(ALL_SPECIALTIES);
  const [userStats, setUserStats] = useState<{ doneQcmIds: string[] }>({ doneQcmIds: [] });

  useEffect(() => {
    fetch('/api/specialties')
      .then(r => r.json())
      .then(d => {
        if (d.success && Array.isArray(d.specialties)) setSpecialties(d.specialties);
      })
      .catch(() => {});

    fetch('/api/qcm/attempt')
      .then(r => r.json())
      .then(d => {
        if (d.success && Array.isArray(d.doneQcmIds)) setUserStats({ doneQcmIds: d.doneQcmIds });
      })
      .catch(() => {});
  }, []);

  // Scroll reveal animation for professional interactive feel
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const faqs = [
    {
      q: "L'accès gratuit nécessite-t-il une carte bancaire ?",
      a: "Non, aucun moyen de paiement n'est requis. Vous créez votre compte en quelques secondes et accédez directement au catalogue Pharmnet DZ, aux cours et aux séries de QCM d'essai."
    },
    {
      q: "Les QCM sont-ils conformes au concours du Résidanat ?",
      a: "Oui. Toutes les questions proviennent des annales officielles et des épreuves des facultés de médecine d'Alger, Oran et Sidi Bel Abbès."
    },
    {
      q: "Comment payer avec BaridiMob ou CCP ?",
      a: "Pour débloquer les forfaits complets, effectuez simplement le virement sur notre compte BaridiMob ou CCP. Votre compte est activé rapidement dès réception de votre reçu."
    },
    {
      q: "Que contient le répertoire Pharmnet DZ ?",
      a: "Il réunit 9 560 médicaments commercialisés en Algérie avec leurs prix PPA, remboursement Chifa, formes, dosages et posologies."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-100 selection:bg-sky-500 selection:text-white font-sans relative overflow-x-hidden">

      {/* 1. BARRE DE NAVIGATION */}
      <header className="sticky top-0 z-50 px-4 sm:px-8 pb-3.5 backdrop-blur-2xl bg-white/80 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-colors" style={{ paddingTop: "max(0.875rem, env(safe-area-inset-top, 0px))" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo */}
          <Logo size="md" variant="default" />

          {/* Liens principaux */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <Link href="#features" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">
              Médicaments
            </Link>
            <Link href="#specialties" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">
              20 Spécialités
            </Link>
            <Link href="#garde" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">
              Mode Garde
            </Link>
            <Link href="/qcm" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">
              Banque QCM
            </Link>
            <Link href="#pricing" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">
              Tarifs
            </Link>
            <Link href="#faq" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">
              Aide & FAQ
            </Link>
          </nav>

          {/* Boutons d'accès & Sélecteur de Faculté */}
          <div className="flex items-center gap-3">
            {/* Faculty Switcher Pill */}
            <div className="hidden sm:inline-flex items-center gap-1 p-1 rounded-full bg-slate-100 dark:bg-navy-800 border border-slate-200/80 dark:border-navy-700 shadow-xs">
              <button
                onClick={() => setFaculty('TOUS')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  faculty === 'TOUS'
                    ? 'bg-white dark:bg-navy-900 text-blue-600 shadow-xs font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Toutes
              </button>
              <button
                onClick={() => setFaculty('ORAN')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                  faculty === 'ORAN'
                    ? 'bg-amber-500 text-white shadow-xs font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <span>Oran</span>
              </button>
              <button
                onClick={() => setFaculty('SIDI_BEL_ABBES')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                  faculty === 'SIDI_BEL_ABBES'
                    ? 'bg-teal-600 text-white shadow-xs font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <span>SBA</span>
              </button>
            </div>

            {/* Theme Toggle Button (Light/Dark mode) */}
            <button
              onClick={toggleTheme}
              aria-label="Basculer le mode jour/nuit"
              className="p-2 rounded-full text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md transition-all"
              title={theme === 'dark' ? 'Passer en Mode Clair' : 'Passer en Mode Sombre'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-sky-300" />}
            </button>

            <Link
              href="/login"
              className="px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider text-white bg-[#FFA34F] hover:bg-[#F97316] shadow-md shadow-orange-500/20 active:scale-95 transition-all"
            >
              LOGIN
            </Link>
            <Link
              href="/register"
              className="hidden sm:inline-flex px-5 py-2 rounded-full text-xs font-bold text-white faculty-accent-bg hover:opacity-90 shadow-md active:scale-95 transition-all"
            >
              Commencer
            </Link>
          </div>
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 relative z-10 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 space-y-12 sm:space-y-24 pt-3 sm:pt-8 pb-28 sm:pb-24 overflow-x-hidden">

        {/* 2. SECTION H�?RO (2 Colonnes) */}
        <section className="pt-2 sm:pt-8 space-y-8 sm:space-y-12">
          
          {/* TOP SHOWCASE CARD: Exact Heart Health Overview Glassmorphism with Yanbod Animated 3D Heart */}
          <div className="reveal-on-scroll is-revealed w-full">
            <HeartOverviewCard />
          </div>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center min-h-[500px] pt-4">
            
            {/* Colonne Gauche */}
            <div className="lg:col-span-6 space-y-6 text-left animate-fade-in-up">
              
              <div className="inline-block text-xs font-black uppercase tracking-widest faculty-accent-text transition-colors">
                {faculty === 'ORAN'
                  ? '�Y�>️ FACULT�? DE M�?DECINE D\'ORAN 1 �?� EHU & CHU'
                  : faculty === 'SIDI_BEL_ABBES'
                  ? '�Y�>️ FACULT�? DE M�?DECINE DJILLALI LIAB�^S �?� SBA'
                  : 'R�?SIDANAT ALGER �?� ORAN �?� SIDI BEL ABB�^S'}
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                Révisez la médecine avec clarté et précision.
              </h1>

              <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl font-normal">
                La plateforme complète des étudiants et médecins en Algérie : <strong className="text-slate-900 dark:text-white">9 560 médicaments Pharmnet DZ</strong>, entraînements QCM par spécialité et par cours, fiches cliniques et mode urgences H24.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href="/register"
                  className="w-full sm:w-auto justify-center px-6 sm:px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider faculty-accent-bg hover:opacity-95 active:scale-95 text-white shadow-xl shadow-sky-500/25 transition-all inline-flex items-center gap-2 text-center"
                >
                  <span>Commencer gratuitement</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/demo"
                  className="w-full sm:w-auto justify-center px-5 sm:px-6 py-3.5 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-white/15 backdrop-blur-xl shadow-sm inline-flex items-center gap-2 transition-all text-center"
                >
                  <Play className="w-3.5 h-3.5 faculty-accent-text" />
                  <span>Tester la démo</span>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] sm:text-xs text-slate-500 font-semibold pt-2 sm:pt-4">
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Accès gratuit sans engagement
                </span>
                <span className="flex items-center gap-1.5 text-blue-600">
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" /> Programme officiel du concours
                </span>
                <span className="flex items-center gap-1.5 text-amber-600">
                  <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" /> BaridiMob & CCP direct
                </span>
              </div>
            </div>

            {/* Colonne Droite : Maquette Médicale Flottante Organisée & Flottante (Visible sur grand écran pour éviter l'encombrement mobile) */}
            <div className="hidden lg:flex lg:col-span-6 relative w-full h-[540px] sm:h-[580px] items-center justify-center select-none animate-fade-in-up">
              
              {/* Halos de profondeur */}
              <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-blue-400/25 blur-3xl animate-pulse-subtle pointer-events-none" />
              <div className="absolute bottom-8 right-8 w-72 h-72 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />

              {/* 1. Carte Recherche Médicale & Spécialités (Haut Droite) */}
              <div className="absolute top-4 right-6 sm:right-10 w-72 p-4 rounded-3xl medical-glass-card space-y-3 z-20 animate-float-slow hover:scale-102 transition-transform cursor-pointer">
                <div className="flex items-center justify-between px-1">
                  <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-base shadow-xs hover:scale-110 transition-transform">
                    �Y��
                  </div>
                  <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center text-base shadow-xs hover:scale-110 transition-transform">
                    ❤️
                  </div>
                  <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center text-base shadow-xs hover:scale-110 transition-transform">
                    �Y'�️
                  </div>
                  <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center text-base shadow-xs hover:scale-110 transition-transform">
                    �Y'?
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/60 text-xs text-slate-500 shadow-inner">
                  <Search className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="text-[11px] truncate font-medium">Rechercher cours, QCM, produit...</span>
                </div>
              </div>

              {/* 2. Badge Profil Médecin 1 - Dr. Yasmine Saidi (Superposé Haut Droite) */}
              <div className="absolute -top-2 right-0 sm:-right-2 w-48 p-3 rounded-2xl medical-glass-card space-y-2 z-30 animate-float-reverse hover:scale-105 transition-transform">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-100 to-indigo-100 border border-purple-200 flex items-center justify-center text-sm shadow-xs">
                    �Y'��?��s.️
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-black text-slate-900 truncate">Dr. Yasmine Saidi</div>
                    <div className="text-[9px] text-slate-400 font-medium truncate">Cardiologie, EHU Oran</div>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-[9px] font-black tracking-wide text-center flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Session 100% Validée</span>
                </div>
              </div>

              {/* 3. Icône Flottante Seringue (Haut Gauche) */}
              <div className="absolute top-10 left-6 sm:left-8 w-12 h-12 p-3 rounded-2xl medical-glass-card flex items-center justify-center text-lg z-10 animate-float-medium hover:scale-115 transition-transform cursor-pointer text-blue-500 shadow-md">
                �Y'?
              </div>

              {/* 4. Calendrier de Session Médicale (Centre Droite) */}
              <div className="absolute top-44 right-2 sm:right-6 w-56 p-4 rounded-3xl medical-glass-card space-y-3 z-25 animate-float-medium hover:scale-102 transition-transform">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <span>�Y".</span>
                    <span>Session, 2027</span>
                  </div>
                  <span className="text-[9px] font-bold text-blue-600 px-2 py-0.5 rounded-full bg-blue-50">Actif</span>
                </div>
                <div className="grid grid-cols-7 text-center gap-1 text-[9px]">
                  <span className="text-slate-400 font-bold">L</span>
                  <span className="text-slate-400 font-bold">M</span>
                  <span className="text-slate-400 font-bold">M</span>
                  <span className="text-slate-400 font-bold">J</span>
                  <span className="text-slate-400 font-bold">V</span>
                  <span className="text-slate-400 font-bold">S</span>
                  <span className="text-slate-400 font-bold">D</span>
                  
                  <span className="py-1 text-slate-600 font-semibold">9</span>
                  <span className="py-1 text-slate-600 font-semibold">10</span>
                  <span className="py-1 rounded-full bg-blue-600 text-white font-black shadow-md shadow-blue-500/40 ring-2 ring-blue-400/30 animate-pulse">11</span>
                  <span className="py-1 text-slate-600 font-semibold">12</span>
                  <span className="py-1 text-slate-600 font-semibold">13</span>
                  <span className="py-1 text-slate-600 font-semibold">14</span>
                  <span className="py-1 text-slate-600 font-semibold">15</span>
                </div>
              </div>

              {/* 5. Fiche Médecin 2 - Dr. Mohamed Benali (Centre Gauche) */}
              <div className="absolute top-48 left-2 sm:left-4 w-60 p-4 rounded-3xl medical-glass-card space-y-2.5 z-30 animate-float-slow hover:scale-103 transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-100 to-sky-100 border border-blue-200 flex items-center justify-center text-sm shadow-xs">
                    �Y'��?��s.️
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-black text-slate-900 truncate">Dr. Mohamed Benali</div>
                    <div className="text-[10px] text-slate-500 font-medium truncate">Interne UMC, SBA</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] pt-2 border-t border-slate-100/90">
                  <span className="text-amber-600 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                    �-� Disponible Garde
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 font-bold text-[9px]">
                    Révision
                  </span>
                </div>
              </div>

              {/* 6. Pastille C�"ur Flottante */}
              <div className="absolute top-40 left-1/2 -translate-x-4 w-11 h-11 rounded-2xl medical-glass-card flex items-center justify-center text-rose-500 text-base z-20 animate-float-reverse hover:scale-120 transition-transform cursor-pointer shadow-md">
                ❤️
              </div>

              {/* 7. Pastille Gélule Flottante */}
              <div className="absolute bottom-24 left-1/2 translate-x-12 w-12 h-12 rounded-2xl medical-glass-card flex items-center justify-center text-lg z-20 animate-float-slow hover:scale-120 transition-transform cursor-pointer shadow-md">
                �Y'S
              </div>

              {/* 8. Icône Dent */}
              <div className="absolute bottom-16 left-6 sm:left-10 w-12 h-12 p-3 rounded-2xl medical-glass-card flex items-center justify-center text-xl z-15 animate-float-medium hover:scale-115 transition-transform text-amber-500 shadow-md">
                �Y��
              </div>

              {/* 9. Carte Médicament Pharmnet DZ (Bas Droite) */}
              <div className="absolute bottom-4 right-2 sm:right-6 w-52 p-3.5 rounded-2xl medical-glass-card space-y-1.5 z-30 animate-float-slow hover:scale-105 transition-transform cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-xs shadow-xs">
                    �Y'S
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-black text-slate-900 truncate">Amoxicilline 1g</div>
                    <div className="text-[9px] text-slate-400 font-medium">08:00 - Après Repas</div>
                  </div>
                </div>
                <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[9px]">
                  <span className="font-bold text-orange-600">Pharmnet DZ Officiel</span>
                  <span className="font-semibold text-emerald-600">Chifa 80%</span>
                </div>
              </div>

            </div>
          </div>
        </section>

                {/* 3. SECTION "HOW IT WORKS" - Outils Principaux */}
        <section className="space-y-5 pt-4 reveal-on-scroll">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-widest text-blue-600">Comment ca marche</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Tous les outils pour reussir
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            
            <Link href="/medicaments" className="p-4 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 hover:border-blue-400 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-2.5 group active:scale-95">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Pill className="w-6 h-6" />
              </div>
              <div className="text-xs font-black text-slate-900 dark:text-white">Pharmnet DZ</div>
              <div className="text-[10px] text-slate-400">9 560 Produits</div>
            </Link>

            <Link href="/cours" className="p-4 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 hover:border-amber-400 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-2.5 group active:scale-95">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="text-xs font-black text-slate-900 dark:text-white">Specialites</div>
              <div className="text-[10px] text-slate-400">20 Modules CNP</div>
            </Link>

            <Link href="/cours" className="p-4 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 hover:border-purple-400 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-2.5 group active:scale-95">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-xs font-black text-slate-900 dark:text-white">Residents</div>
              <div className="text-[10px] text-slate-400">Oran et SBA</div>
            </Link>

            <Link href="/ecg" className="p-4 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 hover:border-rose-400 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-2.5 group active:scale-95">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6" />
              </div>
              <div className="text-xs font-black text-slate-900 dark:text-white">Cardio et ECG</div>
              <div className="text-[10px] text-slate-400">Traces du Jour</div>
            </Link>

            <Link href="/garde" className="p-4 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 hover:border-cyan-400 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-2.5 group active:scale-95">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="text-xs font-black text-slate-900 dark:text-white">Mode Garde</div>
              <div className="text-[10px] text-slate-400">Urgences H24</div>
            </Link>

            <button
              type="button"
              onClick={() => {
                setModalSpecialtyId(activeSpecialty.id);
                setIsQcmModalOpen(true);
              }}
              className="p-4 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 hover:border-indigo-400 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-2.5 group active:scale-95 cursor-pointer w-full"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6" />
              </div>
              <div className="text-xs font-black text-slate-900 dark:text-white">Banque QCM</div>
              <div className="text-[10px] text-slate-400">Session Plein Ecran</div>
            </button>

            <Link href="/ordonnances" className="p-4 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 hover:border-teal-400 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-2.5 group active:scale-95">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <div className="text-xs font-black text-slate-900 dark:text-white">Ordonnances</div>
              <div className="text-[10px] text-slate-400">209 Modeles Types</div>
            </Link>

            <Link href="/fiches" className="p-4 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 hover:border-emerald-400 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-2.5 group active:scale-95">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <div className="text-xs font-black text-slate-900 dark:text-white">Fiches Flash</div>
              <div className="text-[10px] text-slate-400">Garde et Revision</div>
            </Link>

          </div>
        </section>
        {/* 4. FONCTIONNALITES CLES - Outils Principaux */}
        <section id="features" className="space-y-5 pt-4 reveal-on-scroll">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-widest text-blue-600">
              Outils Principaux
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Tout le necessaire pour reussir
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            
            <div className="rounded-3xl p-5 bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 space-y-3 hover:border-blue-400 shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0">
                <Pill className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Pharmacopee Pharmnet DZ</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                9 560 medicaments officiels en Algerie avec prix PPA, remboursement Chifa, indications et posologies.
              </p>
              <Link href="/medicaments" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline pt-1">
                <span>Voir le catalogue</span>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              </Link>
            </div>

            <div className="rounded-3xl p-5 bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 space-y-3 hover:border-rose-400 shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Mode Garde et Urgences</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Calculs reflexes au lit du malade : posologie pediatrique au kg, gazometrie (GDS), sondes et antidotes.
              </p>
              <Link href="/garde" className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:underline pt-1">
                <span>Acceder au Mode Garde</span>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              </Link>
            </div>

            <div className="rounded-3xl p-5 bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 space-y-3 hover:border-purple-400 shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center shrink-0">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Banque QCM Plein Ecran</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Entrainez-vous par cours et par source (Externat, Annales) en immersion totale avec corrections detaillees.
              </p>
              <button
                type="button"
                onClick={() => {
                  setModalSpecialtyId(activeSpecialty.id);
                  setIsQcmModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:underline pt-1 cursor-pointer"
              >
                <span>Lancer les QCMs</span>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>

          </div>
        </section>
        {/* 5. GRILLE DES 20 SPECIALITES */}
        <section id="specialties" className="space-y-6 pt-4 reveal-on-scroll">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-widest text-blue-600">
                Programme Officiel
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                20 Spécialités Médicales & Chirurgicales
              </h2>
            </div>
            <Link
              href="/cours"
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Voir tous les modules</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {specialties.map(spec => {
              const isSelected = activeSpecialty.id === spec.id;
              return (
                <div
                  key={spec.id}
                  onClick={() => setActiveSpecialtyId(spec.id)}
                  className={`rounded-3xl p-4 transition-all flex flex-col justify-between h-36 cursor-pointer group border ${
                    isSelected
                      ? 'bg-white/95 dark:bg-slate-800/95 border-sky-500 shadow-lg scale-103 ring-2 ring-sky-500/20'
                      : 'bg-white/80 dark:bg-slate-900/60 border-slate-200/80 dark:border-white/10 hover:scale-102 hover:border-sky-400 shadow-xs hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <SpecialtyLogo specialtyId={spec.id} size="sm" withGlow={isSelected} />
                      <span className="text-xl group-hover:scale-110 transition-transform">
                        {getSpecialtyEmoji(spec.id)}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {spec.totalCourses} cours
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-black text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors truncate">
                      {spec.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate flex items-center justify-between">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSpecialtyId(spec.id);
                          setModalSpecialtyId(spec.id);
                          setIsQcmModalOpen(true);
                        }}
                        className="hover:text-sky-500 font-bold transition-colors cursor-pointer text-left"
                      >
                        {spec.totalQcms} QCM ▶
                      </button>
                      <Link
                        href={`/cours?specialty=${spec.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSpecialtyId(spec.id);
                        }}
                        className="text-[10px] font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-0.5"
                      >
                        <span>Ouvrir</span>
                        <ChevronRight className="w-2.5 h-2.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. TARIFS ALG�?RIE */}
        <section id="pricing" className="space-y-6 pt-4 reveal-on-scroll">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-orange-600">
              Forfaits Simples & Flexibles
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Tarifs en Dinars Algériens (DA)
            </h2>
            <p className="text-xs text-slate-500">
              Paiement direct par BaridiMob (RIP instantané) ou virement CCP.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto items-stretch">
            {/* Gratuit */}
            <div className="rounded-3xl p-6 bg-white border border-slate-200/80 shadow-md flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Accès Découverte</span>
                <div className="text-3xl font-black text-slate-900">0 DA</div>
                <p className="text-xs text-slate-500">Pour découvrir la plateforme et le répertoire Pharmnet.</p>
                <ul className="space-y-2 text-xs text-slate-700 pt-3 border-t border-slate-100">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Répertoire 9 560 Médicaments Pharmnet DZ</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Mode Garde H24 (Urgences de base)</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Séries de QCMs d'essai</li>
                </ul>
              </div>
              <Link
                href="/register?plan=FREE"
                className="w-full py-3 rounded-2xl border border-slate-200 text-xs font-bold text-center text-slate-800 hover:bg-slate-50 transition-all block"
              >
                Créer mon compte gratuit
              </Link>
            </div>

            {/* Pro */}
            <div className="rounded-3xl p-7 bg-blue-600 text-white flex flex-col justify-between space-y-6 shadow-xl shadow-blue-500/25 transform md:-translate-y-2 border border-blue-500">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Forfait PRO</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-white/20 text-white">Recommandé</span>
                </div>
                <div className="text-4xl font-black">4 500 DA <span className="text-xs font-normal text-blue-200">/ mois</span></div>
                <p className="text-xs text-white/90">Accès complet aux 20 spécialités, ordonnances et sessions QCM.</p>
                <ul className="space-y-2 text-xs text-white/90 pt-3 border-t border-white/20">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-white" /> Accès complet aux 20 spécialités du concours</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-white" /> 209 Ordonnances types expliquées</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-white" /> Banque complète de QCM en plein écran</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-white" /> Validation rapide par BaridiMob & CCP</li>
                </ul>
              </div>
              <Link
                href="/checkout?plan=PRO"
                className="w-full py-3.5 rounded-2xl bg-white text-blue-700 text-xs font-black text-center hover:bg-blue-50 transition-all shadow-md block uppercase tracking-wider"
              >
                Payer par BaridiMob / CCP
              </Link>
            </div>

            {/* Premium */}
            <div className="rounded-3xl p-6 bg-white border border-slate-200/80 shadow-md flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600">PREMIUM VIP</span>
                <div className="text-3xl font-black text-slate-900">7 000 DA <span className="text-xs font-normal text-slate-400">/ mois</span></div>
                <p className="text-xs text-slate-500">Pour les candidats visant les premiers rangs du Résidanat.</p>
                <ul className="space-y-2 text-xs text-slate-700 pt-3 border-t border-slate-100">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Tous les avantages du forfait PRO</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Assistant IA médical illimité</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Interpréteur de bilans FNS par photo</li>
                </ul>
              </div>
              <Link
                href="/checkout?plan=PREMIUM"
                className="w-full py-3 rounded-2xl bg-[#FFA34F] hover:bg-[#F97316] text-white text-xs font-black text-center transition-all block shadow-sm uppercase tracking-wider"
              >
                Souscrire Forfait VIP
              </Link>
            </div>
          </div>
        </section>

        {/* 7. FAQ */}
        <section id="faq" className="space-y-6 pt-4 max-w-3xl mx-auto reveal-on-scroll">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-slate-900">Questions Fréquentes</h2>
            <p className="text-xs text-slate-500">Tout ce que vous devez savoir pour démarrer sereinement.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full p-4 text-left font-bold text-xs text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* 8. PIED DE PAGE */}
      <footer className="border-t border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl py-10 text-slate-500 dark:text-slate-400 text-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo size="sm" showTagline={true} variant={theme === 'dark' ? 'white' : 'default'} />
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            <Link href="/medicaments" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Pharmnet DZ</Link>
            <Link href="/garde" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Mode Garde H24</Link>
            <Link href="/ordonnances" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Ordonnances Types</Link>
            <Link href="/cours" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">20 Spécialités</Link>
            <Link href="/pricing" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Tarifs BaridiMob / CCP</Link>
          </div>

          <div className="text-[10px] text-slate-400 dark:text-slate-500">
            © 2027 AS MEDIX .dz. Tous droits réservés.
          </div>
        </div>
      </footer>

      {/* Interactive QCM Launch Modal */}
      <QcmLaunchModal
        isOpen={isQcmModalOpen}
        onClose={() => setIsQcmModalOpen(false)}
        specialtyId={modalSpecialtyId || activeSpecialty.id}
      />
    </div>
  );
}


