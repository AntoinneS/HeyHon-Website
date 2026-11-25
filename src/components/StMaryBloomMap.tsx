import React, { useEffect, useMemo, useState } from 'react';
import {
  ST_MARY_FLORA,
  MONTHS,
  FULL_MONTHS,
  getMonthBloomSummary,
  type EcologicalLayer,
  type FloraSpecies,
} from '@/data/flora';

interface Props {
  compact?: boolean;
}

type LayerFilter = 'All' | EcologicalLayer;
type PlantVisualKind =
  | 'palm'
  | 'banana'
  | 'canopy-tree'
  | 'orchard-tree'
  | 'shrub'
  | 'wildflower'
  | 'vine-crop'
  | 'cane';

const PLANT_KIND_BY_ID: Record<string, PlantVisualKind> = {
  coconut: 'palm',
  'palm-tree': 'palm',
  banana: 'banana',
  plantain: 'banana',
  logwood: 'canopy-tree',
  ackee: 'canopy-tree',
  mango: 'canopy-tree',
  pimento: 'canopy-tree',
  guango: 'canopy-tree',
  avocado: 'canopy-tree',
  'blue-mahoe': 'canopy-tree',
  tamarind: 'canopy-tree',
  breadfruit: 'canopy-tree',
  jackfruit: 'canopy-tree',
  naseberry: 'canopy-tree',
  'star-apple': 'canopy-tree',
  nutmeg: 'canopy-tree',
  orange: 'orchard-tree',
  lime: 'orchard-tree',
  'grapefruit-tangerine': 'orchard-tree',
  guava: 'orchard-tree',
  'otaheite-apple': 'orchard-tree',
  soursop: 'orchard-tree',
  'june-plum': 'orchard-tree',
  cocoa: 'orchard-tree',
  moringa: 'shrub',
  sorrel: 'shrub',
  hibiscus: 'shrub',
  bougainvillea: 'shrub',
  'gungo-pea': 'shrub',
  tobacco: 'shrub',
  'spanish-needle': 'wildflower',
  'blue-vervain': 'wildflower',
  'christmas-pops': 'vine-crop',
  cerasee: 'vine-crop',
  pumpkin: 'vine-crop',
  'sweet-potato': 'vine-crop',
  'irish-potato': 'vine-crop',
  sugarcane: 'cane',
};

const LAYERS: LayerFilter[] = [
  'All',
  'Main Honey Flowers',
  'Fruit & Herb Blossoms',
  'Surrounding Trees & Crops',
];

function toMapStageCoords(x: number, y: number): { left: number; top: number } {
  return {
    left: 8 + x * 0.84,
    top: 15 + y * 0.72,
  };
}

function PlantIcon({
  plantId,
  bloomColor,
  isBlooming,
  isPeak,
  sizeClass = 'w-9 h-9',
}: {
  plantId: string;
  bloomColor: string;
  isBlooming: boolean;
  isPeak: boolean;
  sizeClass?: string;
}) {
  const kind: PlantVisualKind = PLANT_KIND_BY_ID[plantId] ?? 'shrub';
  const leafDark = isBlooming ? '#2F6F3D' : '#587654';
  const leafMid = isBlooming ? '#43894E' : '#6D8A67';
  const leafLight = isBlooming ? '#60A964' : '#839E7C';
  const trunk = '#6D4B32';
  const showBlossoms = isBlooming || isPeak;
  const dotR = isPeak ? 2.8 : 2.1;

  if (kind === 'palm') {
    return (
      <svg viewBox="0 0 40 40" className={sizeClass} aria-hidden="true">
        <ellipse cx="20" cy="36.5" rx="8" ry="2.2" fill="#294726" opacity="0.24" />
        <path
          d="M17.5 36 Q18.5 25 21 15 L23 15.3 Q21 25.5 20.5 36 Z"
          fill="#805E41"
        />
        <path d="M21 15 Q11 10 5 16 Q13 15 21 16.5 Z" fill={leafDark} />
        <path d="M21 15 Q13 5 9 8 Q15 9.5 21 15.5 Z" fill={leafMid} />
        <path d="M22 15 Q29 6 35 12 Q29 12 22 16 Z" fill={leafMid} />
        <path d="M22 15.5 Q31 13 35 20 Q28 17.5 21.5 16.5 Z" fill={leafDark} />
        <path d="M21.5 14.5 Q22 6 25 4 Q24 10 22 15.5 Z" fill={leafLight} />
        <circle cx="20.2" cy="17.2" r="1.7" fill="#6F5726" />
        <circle cx="22.8" cy="17.6" r="1.6" fill="#6F5726" />
        {showBlossoms && (
          <>
            <circle cx="19" cy="16.4" r={dotR * 0.72} fill={bloomColor} stroke="#FFF9ED" strokeWidth="0.6" />
            <circle cx="23.5" cy="16" r={dotR * 0.72} fill={bloomColor} stroke="#FFF9ED" strokeWidth="0.6" />
          </>
        )}
      </svg>
    );
  }

  if (kind === 'banana') {
    return (
      <svg viewBox="0 0 40 40" className={sizeClass} aria-hidden="true">
        <ellipse cx="20" cy="36.5" rx="9" ry="2.2" fill="#294726" opacity="0.24" />
        <rect x="18.2" y="21" width="3.6" height="15" rx="1.6" fill="#6A8B4A" />
        <path d="M19.5 22 Q9 15 5 21 Q11 22 19 24 Z" fill={leafDark} />
        <path d="M20.5 22 Q31 15 35 21 Q29 22 21 24 Z" fill={leafDark} />
        <path d="M19.5 20 Q11 9 8 13 Q14 14.5 19.5 21.5 Z" fill={leafMid} />
        <path d="M20.5 20 Q29 9 32 13 Q26 14.5 20.5 21.5 Z" fill={leafMid} />
        <path d="M20 20 Q19.5 8 22 6 Q23 13 20.5 21 Z" fill={leafLight} />
        {showBlossoms && (
          <>
            <path d="M20 22 Q23 25 22.8 29 Q20.5 31 18.8 28.5 Q19 25 20 22 Z" fill={bloomColor} stroke="#FFF9ED" strokeWidth="0.6" />
            <circle cx="21" cy="24.5" r="1.2" fill="#FBE59B" />
          </>
        )}
      </svg>
    );
  }

  if (kind === 'canopy-tree') {
    return (
      <svg viewBox="0 0 40 40" className={sizeClass} aria-hidden="true">
        <ellipse cx="20" cy="36.5" rx="10" ry="2.4" fill="#294726" opacity="0.25" />
        <path d="M17.5 36 L18.4 22 L21.6 22 L22.5 36 Z" fill={trunk} />
        <path d="M19 25 L13.5 19.5" stroke={trunk} strokeWidth="2" strokeLinecap="round" />
        <path d="M21 25 L26.5 19.5" stroke={trunk} strokeWidth="2" strokeLinecap="round" />
        <circle cx="13" cy="18.5" r="7.5" fill={leafDark} />
        <circle cx="27" cy="18.5" r="7.5" fill={leafDark} />
        <circle cx="20" cy="13.5" r="9.2" fill={leafMid} />
        <circle cx="17.5" cy="12" r="5.5" fill={leafLight} opacity="0.85" />
        {showBlossoms && (
          <>
            <circle cx="12" cy="17" r={dotR} fill={bloomColor} stroke="#FFF9ED" strokeWidth="0.6" />
            <circle cx="19" cy="10.5" r={dotR} fill={bloomColor} stroke="#FFF9ED" strokeWidth="0.6" />
            <circle cx="26.5" cy="16" r={dotR} fill={bloomColor} stroke="#FFF9ED" strokeWidth="0.6" />
            <circle cx="22" cy="18.5" r={dotR * 0.85} fill={bloomColor} stroke="#FFF9ED" strokeWidth="0.5" />
            {isPeak && (
              <circle cx="15.5" cy="13" r={dotR * 0.85} fill={bloomColor} stroke="#FFF9ED" strokeWidth="0.5" />
            )}
          </>
        )}
      </svg>
    );
  }

  if (kind === 'orchard-tree') {
    return (
      <svg viewBox="0 0 40 40" className={sizeClass} aria-hidden="true">
        <ellipse cx="20" cy="36.5" rx="8.5" ry="2.2" fill="#294726" opacity="0.24" />
        <rect x="18.3" y="23" width="3.4" height="13" rx="1.2" fill={trunk} />
        <ellipse cx="20" cy="16.5" rx="10.5" ry="9.5" fill={leafDark} />
        <ellipse cx="18.8" cy="15" rx="7.8" ry="7" fill={leafMid} />
        <circle cx="16.5" cy="12.5" r="4" fill={leafLight} opacity="0.8" />
        {showBlossoms && (
          <>
            <circle cx="13.5" cy="17.5" r={dotR} fill={bloomColor} stroke="#FFF9ED" strokeWidth="0.6" />
            <circle cx="21" cy="11.5" r={dotR} fill={bloomColor} stroke="#FFF9ED" strokeWidth="0.6" />
            <circle cx="25.5" cy="17.5" r={dotR * 0.9} fill={bloomColor} stroke="#FFF9ED" strokeWidth="0.6" />
            {isPeak && (
              <circle cx="17.5" cy="19.5" r={dotR * 0.8} fill="#FFF7DE" />
            )}
          </>
        )}
      </svg>
    );
  }

  if (kind === 'cane') {
    return (
      <svg viewBox="0 0 40 40" className={sizeClass} aria-hidden="true">
        <ellipse cx="20" cy="36.5" rx="8.5" ry="2" fill="#294726" opacity="0.22" />
        <path d="M15 36 L13.5 14 M20 36 L20 12 M25 36 L26.5 15" stroke="#75A956" strokeWidth="2.1" strokeLinecap="round" />
        <path d="M14 23 Q7 18 6 22 M20 20 Q12 13 9 16 M20 21 Q28 14 31 17 M25 24 Q33 19 34 23" stroke={leafMid} strokeWidth="1.9" fill="none" strokeLinecap="round" />
        {showBlossoms && (
          <>
            <ellipse cx="13.5" cy="10.5" rx="1.8" ry="3.6" fill={bloomColor} stroke="#FFF9ED" strokeWidth="0.5" />
            <ellipse cx="20" cy="8.5" rx="2.1" ry="4.2" fill={bloomColor} stroke="#FFF9ED" strokeWidth="0.5" />
            <ellipse cx="26.5" cy="11.5" rx="1.8" ry="3.4" fill={bloomColor} stroke="#FFF9ED" strokeWidth="0.5" />
          </>
        )}
      </svg>
    );
  }

  if (kind === 'vine-crop') {
    return (
      <svg viewBox="0 0 40 40" className={sizeClass} aria-hidden="true">
        <ellipse cx="20" cy="34.5" rx="12.5" ry="3" fill="#294726" opacity="0.22" />
        <path d="M7 31 Q14 27 20 30 Q27 32 34 29" stroke="#4D8043" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <circle cx="12.5" cy="27.5" r="5" fill={leafDark} />
        <circle cx="27.5" cy="27.5" r="5" fill={leafDark} />
        <circle cx="20" cy="25.5" r="6.2" fill={leafMid} />
        <circle cx="18.5" cy="24" r="3.5" fill={leafLight} opacity="0.85" />
        {showBlossoms && (
          <>
            <circle cx="12.5" cy="25" r={dotR} fill={bloomColor} stroke="#FFF9ED" strokeWidth="0.6" />
            <circle cx="20" cy="22" r={dotR * 1.05} fill={bloomColor} stroke="#FFF9ED" strokeWidth="0.6" />
            <circle cx="27.5" cy="25.5" r={dotR} fill={bloomColor} stroke="#FFF9ED" strokeWidth="0.6" />
          </>
        )}
      </svg>
    );
  }

  if (kind === 'wildflower') {
    return (
      <svg viewBox="0 0 40 40" className={sizeClass} aria-hidden="true">
        <ellipse cx="20" cy="36" rx="8.5" ry="2" fill="#294726" opacity="0.22" />
        <path d="M14 35 Q13 25 12 18 M20 35 L20 14 M26 35 Q27 25 28 19" stroke={leafDark} strokeWidth="2" fill="none" strokeLinecap="round" />
        <ellipse cx="14" cy="28" rx="3.2" ry="1.6" fill={leafMid} />
        <ellipse cx="25.5" cy="28" rx="3.2" ry="1.6" fill={leafMid} />
        <circle cx="20" cy="24" r="3" fill={leafLight} />
        {showBlossoms ? (
          <>
            <circle cx="12" cy="17" r={dotR * 1.1} fill={bloomColor} stroke="#FFF9ED" strokeWidth="0.7" />
            <circle cx="20" cy="13" r={dotR * 1.25} fill={bloomColor} stroke="#FFF9ED" strokeWidth="0.7" />
            <circle cx="28" cy="18" r={dotR * 1.1} fill={bloomColor} stroke="#FFF9ED" strokeWidth="0.7" />
            <circle cx="20" cy="13" r="1.2" fill="#FFF2B8" />
          </>
        ) : (
          <>
            <circle cx="12" cy="18" r="1.6" fill={leafMid} />
            <circle cx="20" cy="14.5" r="1.8" fill={leafMid} />
            <circle cx="28" cy="19" r="1.6" fill={leafMid} />
          </>
        )}
      </svg>
    );
  }

  // Default: shrub (Moringa, Sorrel, Hibiscus, Bougainvillea, Gungo Pea, Tobacco)
  return (
    <svg viewBox="0 0 40 40" className={sizeClass} aria-hidden="true">
      <ellipse cx="20" cy="36" rx="9.5" ry="2.2" fill="#294726" opacity="0.24" />
      <path d="M18.5 35 L16 25 M20 35 L20 24 M21.5 35 L24 25" stroke={trunk} strokeWidth="1.9" strokeLinecap="round" />
      <circle cx="13.5" cy="22.5" r="5.8" fill={leafDark} />
      <circle cx="26.5" cy="22.5" r="5.8" fill={leafDark} />
      <circle cx="20" cy="18.5" r="6.8" fill={leafMid} />
      <circle cx="18.5" cy="16.5" r="4" fill={leafLight} opacity="0.85" />
      {showBlossoms && (
        <>
          <circle cx="13.5" cy="20" r={dotR} fill={bloomColor} stroke="#FFF9ED" strokeWidth="0.6" />
          <circle cx="20" cy="14.5" r={dotR * 1.05} fill={bloomColor} stroke="#FFF9ED" strokeWidth="0.6" />
          <circle cx="26.5" cy="20" r={dotR} fill={bloomColor} stroke="#FFF9ED" strokeWidth="0.6" />
        </>
      )}
    </svg>
  );
}

function BeehiveClusterIcon({ className = 'w-14 h-12' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 52" className={className} aria-hidden="true">
      {/* Grassy hive clearing */}
      <ellipse cx="32" cy="46" rx="26" ry="5" fill="#7CA15E" opacity="0.55" />
      {/* Left wooden hive stack */}
      <rect x="11" y="39" width="17" height="4" rx="1" fill="#6D4B32" />
      <rect x="12" y="30" width="15" height="9" rx="1" fill="#C98A3F" stroke="#7A4F22" strokeWidth="0.9" />
      <rect x="12" y="21" width="15" height="9" rx="1" fill="#DA9E52" stroke="#7A4F22" strokeWidth="0.9" />
      <path d="M10 21 L29 21 L27.5 17.5 L11.5 17.5 Z" fill="#FBF4E6" stroke="#7A4F22" strokeWidth="0.9" />
      <rect x="16" y="36.5" width="7" height="2" rx="0.6" fill="#2A1B10" />
      {/* Right main wooden hive stack */}
      <rect x="33" y="39" width="19" height="4" rx="1" fill="#6D4B32" />
      <rect x="34" y="29" width="17" height="10" rx="1" fill="#BF7E32" stroke="#7A4F22" strokeWidth="0.9" />
      <rect x="34" y="19" width="17" height="10" rx="1" fill="#D59648" stroke="#7A4F22" strokeWidth="0.9" />
      <rect x="34" y="11" width="17" height="8" rx="1" fill="#E3AA5E" stroke="#7A4F22" strokeWidth="0.9" />
      <path d="M32 11 L53 11 L51 7.5 L34 7.5 Z" fill="#FBF4E6" stroke="#7A4F22" strokeWidth="0.9" />
      <rect x="39" y="36.5" width="7.5" height="2" rx="0.6" fill="#2A1B10" />
      {/* Honeybees hovering above */}
      <g transform="translate(22 10)">
        <ellipse cx="0" cy="-1.4" rx="1.6" ry="0.9" fill="#FFFDF7" opacity="0.9" />
        <ellipse cx="0" cy="0" rx="2.4" ry="1.4" fill="#F2B830" stroke="#2A1B10" strokeWidth="0.6" />
      </g>
      <g transform="translate(49 4)">
        <ellipse cx="0" cy="-1.3" rx="1.5" ry="0.8" fill="#FFFDF7" opacity="0.9" />
        <ellipse cx="0" cy="0" rx="2.2" ry="1.3" fill="#F2B830" stroke="#2A1B10" strokeWidth="0.6" />
      </g>
    </svg>
  );
}

export default function StMaryBloomMap({ compact = false }: Props) {
  const [month, setMonth] = useState<number>(3);
  const [playing, setPlaying] = useState<boolean>(false);
  const [layerFilter, setLayerFilter] = useState<LayerFilter>('All');
  const [inBloomOnly, setInBloomOnly] = useState<boolean>(false);
  const [profileTab, setProfileTab] = useState<'health' | 'taste'>('health');
  const [selectedId, setSelectedId] = useState<string>('moringa');

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setMonth((prev) => (prev % 12) + 1);
    }, 1800);
    return () => window.clearInterval(id);
  }, [playing]);

  const summary = useMemo(() => getMonthBloomSummary(month), [month]);

  const layerCounts = useMemo(() => {
    const counts: Record<LayerFilter, number> = {
      All: ST_MARY_FLORA.length,
      'Main Honey Flowers': 0,
      'Fruit & Herb Blossoms': 0,
      'Surrounding Trees & Crops': 0,
    };
    for (const plant of ST_MARY_FLORA) {
      counts[plant.layer] += 1;
    }
    return counts;
  }, []);

  const filteredPlants = useMemo(() => {
    return ST_MARY_FLORA.filter((plant) => {
      if (layerFilter !== 'All' && plant.layer !== layerFilter) return false;
      if (inBloomOnly && !plant.bloomMonths.includes(month)) return false;
      return true;
    });
  }, [layerFilter, inBloomOnly, month]);

  const depthSortedPlants = useMemo(
    () => [...filteredPlants].sort((a, b) => a.y - b.y),
    [filteredPlants]
  );

  const selected: FloraSpecies = useMemo(() => {
    return (
      filteredPlants.find((p) => p.id === selectedId) ||
      ST_MARY_FLORA.find((p) => p.id === selectedId) ||
      filteredPlants[0] ||
      ST_MARY_FLORA[0]
    );
  }, [filteredPlants, selectedId]);

  const topBloomingNow = useMemo(() => {
    return ST_MARY_FLORA.filter((p) => p.bloomMonths.includes(month))
      .sort((a, b) => {
        const aPeak = a.peakMonths.includes(month) ? 1 : 0;
        const bPeak = b.peakMonths.includes(month) ? 1 : 0;
        if (aPeak !== bPeak) return bPeak - aPeak;
        return b.nectarScore - a.nectarScore;
      })
      .slice(0, 6);
  }, [month]);

  const hiveStage = toMapStageCoords(50, 48);
  const selectedStage = toMapStageCoords(selected.x, selected.y);
  const hiveSvgX = hiveStage.left * 8;
  const hiveSvgY = hiveStage.top * 5.6;
  const selectedSvgX = selectedStage.left * 8;
  const selectedSvgY = selectedStage.top * 5.6;
  const arcCtrlX = (hiveSvgX + selectedSvgX) / 2;
  const arcCtrlY = Math.min(hiveSvgY, selectedSvgY) - 42;

  const isSelectedPeak = selected.peakMonths.includes(month);
  const isSelectedBlooming = selected.bloomMonths.includes(month);

  const honeyBars =
    profileTab === 'health'
      ? [
          { label: 'Antioxidants', value: summary.medicinal.antioxidant },
          { label: 'Throat Soothing', value: summary.medicinal.soothing },
          { label: 'Immune Support', value: summary.medicinal.immuneVitality },
          { label: 'Natural Minerals', value: summary.medicinal.mineralDensity },
          { label: 'Bee Pollen Nutrition', value: summary.medicinal.pollenNutrition },
        ]
      : [
          { label: 'Floral', value: summary.profile.floral },
          { label: 'Fruity', value: summary.profile.fruity },
          { label: 'Warm Spice', value: summary.profile.spiced },
          { label: 'Caramel Richness', value: summary.profile.caramel },
          { label: 'Citrus Brightness', value: summary.profile.brightness },
        ];

  return (
    <div className="space-y-5">
      {/* Top Card: Blooming Now + 12-Month Timeline + Month's Honey Profile directly below */}
      <div className="glass-pearl rounded-3xl p-4 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-gold-deep">
              Blooming Now
            </div>
            <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
              <h3 className="font-serif text-xl sm:text-2xl font-semibold text-ink">
                {FULL_MONTHS[month - 1]} in St. Mary
              </h3>
              <span className="text-xs font-medium text-bloom-deep">
                {summary.activeCount} blooming ({summary.peakCount} in peak nectar)
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-pressed={playing}
            className="inline-flex items-center gap-2 rounded-full bg-obsidian px-4 py-2 text-xs font-semibold text-ivory transition hover:bg-gold hover:text-obsidian cursor-pointer"
          >
            <span>{playing ? 'Pause Seasons' : 'Play Whole Year'}</span>
          </button>
        </div>

        {/* 12-Month Selector Strip */}
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
          {MONTHS.map((label, idx) => {
            const m = idx + 1;
            const active = month === m;
            return (
              <button
                key={label}
                type="button"
                onClick={() => {
                  setPlaying(false);
                  setMonth(m);
                }}
                aria-pressed={active}
                className={`rounded-xl py-2 text-xs font-semibold transition cursor-pointer ${
                  active
                    ? 'bg-obsidian text-ivory shadow-sm ring-2 ring-gold-bright/60'
                    : 'bg-ivory-deep/75 text-ink-muted hover:bg-nectar hover:text-ink'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Month's Honey Profile directly under Blooming Now (ideal for mobile visibility) */}
        <div className="rounded-2xl border border-obsidian/10 bg-parchment/85 p-4 sm:p-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-7 flex items-start gap-3.5">
              <div
                className="relative shrink-0 w-12 h-14 sm:w-14 sm:h-16 rounded-2xl border border-obsidian/15 shadow-inner flex items-center justify-center"
                style={{ backgroundColor: summary.colorHex }}
                title={summary.pfundLabel}
              >
                <div className="w-6 h-8 rounded-full bg-white/25 blur-[2px] -translate-x-1 -translate-y-1" />
              </div>

              <div className="min-w-0">
                <div className="text-xs font-semibold text-gold-deep">
                  {FULL_MONTHS[month - 1]} Honey Profile
                </div>
                <div className="mt-0.5 font-serif text-base sm:text-lg font-semibold text-ink leading-snug">
                  {summary.pfundLabel}
                </div>
                <p className="mt-1 text-xs sm:text-sm text-ink-muted leading-relaxed">
                  {summary.seasonalMedicinalNote}
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-2.5 border-t border-obsidian/10 pt-3 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-ink-muted">Seasonal Profile</span>
                <div className="inline-flex rounded-full bg-ivory-deep p-0.5 border border-obsidian/10">
                  <button
                    type="button"
                    onClick={() => setProfileTab('health')}
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold transition cursor-pointer ${
                      profileTab === 'health'
                        ? 'bg-obsidian text-ivory shadow-xs'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    Health Benefits
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfileTab('taste')}
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold transition cursor-pointer ${
                      profileTab === 'taste'
                        ? 'bg-obsidian text-ivory shadow-xs'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    Taste & Color
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                {honeyBars.map((bar) => (
                  <div key={bar.label} className="flex items-center gap-2.5">
                    <span className="w-28 sm:w-32 shrink-0 text-[11px] font-medium text-ink-muted truncate">
                      {bar.label}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-ivory-deep overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          profileTab === 'health' ? 'bg-gold-deep' : 'bg-gold'
                        }`}
                        style={{ width: `${bar.value}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-mono text-[11px] text-ink-muted">
                      {bar.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split: Scenic Landscape Map + Filter Tabs Directly Beneath (left) & Selected Plant Inspector (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-8 space-y-3">
          {/* Illustrated St. Mary Hillside & Valley Landscape Canvas */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[10/7] min-h-[360px] rounded-3xl overflow-hidden border border-obsidian/12 shadow-sm bg-[#E9E4CC] select-none">
            <svg
              viewBox="0 0 800 560"
              preserveAspectRatio="xMidYMid slice"
              className="absolute inset-0 w-full h-full pointer-events-none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="stMarySky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFF5DB" />
                  <stop offset="48%" stopColor="#F4EBD1" />
                  <stop offset="100%" stopColor="#DCE7C6" />
                </linearGradient>
                <radialGradient id="morningSunGlow" cx="78%" cy="14%" r="35%">
                  <stop offset="0%" stopColor="#FFE196" stopOpacity="0.85" />
                  <stop offset="45%" stopColor="#FCEAC2" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FFF5DB" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="farRidge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9AB591" />
                  <stop offset="100%" stopColor="#B8CCA6" />
                </linearGradient>
                <linearGradient id="midHills" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A9C48E" />
                  <stop offset="100%" stopColor="#CFE0B3" />
                </linearGradient>
                <linearGradient id="valleyFloor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D7E4B9" />
                  <stop offset="100%" stopColor="#BFCF9E" />
                </linearGradient>
              </defs>

              {/* Sky + Morning Sun */}
              <rect width="800" height="560" fill="url(#stMarySky)" />
              <rect width="800" height="300" fill="url(#morningSunGlow)" />
              <circle cx="624" cy="76" r="28" fill="#FFF3C8" opacity="0.85" />

              {/* Soft Clouds */}
              <path
                d="M90 78 Q120 62 152 75 Q176 68 195 82 Q145 88 90 78 Z"
                fill="#FFFDF7"
                opacity="0.7"
              />
              <path
                d="M420 56 Q445 44 472 54 Q492 48 510 60 Q462 66 420 56 Z"
                fill="#FFFDF7"
                opacity="0.65"
              />

              {/* Distant Blue Mountain / Guy's Hill Ridges */}
              <path
                d="M0 155 Q115 92 240 132 Q380 76 520 124 Q660 88 800 138 L800 280 L0 280 Z"
                fill="url(#farRidge)"
              />
              <path
                d="M0 198 Q160 144 310 180 Q465 135 615 175 Q720 150 800 172 L800 320 L0 320 Z"
                fill="#92B284"
                opacity="0.72"
              />

              {/* Mid-ground Orchard Slopes */}
              <path
                d="M0 245 Q170 205 340 238 Q525 198 680 236 Q745 224 800 235 L800 420 L0 420 Z"
                fill="url(#midHills)"
              />

              {/* Sunny Apiary Meadow & Foothills */}
              <path
                d="M0 325 Q220 296 420 322 Q620 342 800 306 L800 560 L0 560 Z"
                fill="url(#valleyFloor)"
              />
              <ellipse cx="400" cy="285" rx="160" ry="62" fill="#E3ECC2" opacity="0.75" />

              {/* Soft contour lines & terraced hillside ridges */}
              <path
                d="M40 282 Q210 250 385 276 Q565 298 760 264"
                stroke="#8FB174"
                strokeWidth="1.5"
                fill="none"
                opacity="0.45"
              />
              <path
                d="M25 390 Q230 356 455 385 Q640 408 780 375"
                stroke="#9AB97C"
                strokeWidth="1.5"
                fill="none"
                opacity="0.45"
              />

              {/* Meandering Valley Stream in Lower Valley */}
              <path
                d="M0 448 Q160 416 290 456 Q410 492 560 462 Q695 436 800 472"
                stroke="#9DC2BB"
                strokeWidth="15"
                fill="none"
                strokeLinecap="round"
                opacity="0.7"
              />
              <path
                d="M0 448 Q160 416 290 456 Q410 492 560 462 Q695 436 800 472"
                stroke="#D4ECE6"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                opacity="0.75"
              />

              {/* Warm Footpath leading toward the central hives */}
              <path
                d="M450 560 Q435 450 415 365 Q404 322 400 295"
                stroke="#E4CFA5"
                strokeWidth="11"
                fill="none"
                strokeLinecap="round"
                opacity="0.72"
              />

              {/* Golden Foraging Flight Path from Hives to Selected Plant */}
              <path
                d={`M ${hiveSvgX} ${hiveSvgY} Q ${arcCtrlX} ${arcCtrlY} ${selectedSvgX} ${selectedSvgY}`}
                stroke="#C97A1D"
                strokeWidth="2.4"
                strokeDasharray="6 5"
                fill="none"
                opacity="0.88"
              />
              <circle cx={hiveSvgX} cy={hiveSvgY} r="4" fill="#C97A1D" opacity="0.85" />
            </svg>

            {/* Subtle Landscape Zone Labels */}
            <div className="pointer-events-none absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
              <span className="rounded-full bg-ivory/85 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold text-ink border border-obsidian/10">
                St. Mary Hills & Valley
              </span>
              <span className="hidden sm:inline-flex rounded-full bg-parchment/85 backdrop-blur-sm px-2.5 py-1 text-[10px] font-medium text-ink-muted border border-obsidian/10">
                Guy&apos;s Hill to Louisiana Foothills
              </span>
            </div>

            <div className="pointer-events-none absolute top-3 right-3 z-10 hidden sm:block">
              <span className="rounded-full bg-parchment/85 backdrop-blur-sm px-2.5 py-1 text-[10px] font-medium text-ink-muted border border-obsidian/10">
                Highland Ridges
              </span>
            </div>

            {/* Central Wooden Beehives Marker */}
            <div
              style={{ left: `${hiveStage.left}%`, top: `${hiveStage.top}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none"
            >
              <div className="relative">
                <div className="absolute -inset-2 rounded-full bg-gold-bright/30 blur-md" />
                <BeehiveClusterIcon className="relative w-12 h-11 sm:w-14 sm:h-12 drop-shadow-md" />
              </div>
              <span className="mt-0.5 rounded-full bg-obsidian/92 px-2 py-0.5 text-[10px] font-semibold text-gold-bright shadow-sm whitespace-nowrap">
                Hey Hon Hives
              </span>
            </div>

            {/* Depth-Sorted Illustrated Plant & Tree Nodes */}
            {depthSortedPlants.map((plant) => {
              const pos = toMapStageCoords(plant.x, plant.y);
              const isSelected = plant.id === selected.id;
              const isPeak = plant.peakMonths.includes(month);
              const isBlooming = plant.bloomMonths.includes(month);

              return (
                <button
                  key={plant.id}
                  type="button"
                  onClick={() => setSelectedId(plant.id)}
                  style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
                  aria-label={`${plant.commonName} (${isPeak ? 'Peak bloom' : isBlooming ? 'Blooming' : 'Resting'})`}
                  aria-pressed={isSelected}
                  className={`group absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-transform duration-200 focus:outline-none cursor-pointer ${
                    isSelected
                      ? 'z-30 scale-120'
                      : isPeak
                        ? 'z-20 scale-105 hover:scale-118 hover:z-30'
                        : isBlooming
                          ? 'z-15 hover:scale-115 hover:z-30'
                          : 'z-10 opacity-70 scale-90 hover:opacity-100 hover:scale-110 hover:z-30'
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    {/* Bloom aura ring */}
                    {isPeak && (
                      <span
                        className="absolute inset-0 rounded-full bloom-pulse opacity-45"
                        style={{ backgroundColor: plant.colorHex }}
                      />
                    )}
                    {isBlooming && !isPeak && (
                      <span
                        className="absolute inset-0.5 rounded-full opacity-25 blur-[2px]"
                        style={{ backgroundColor: plant.colorHex }}
                      />
                    )}
                    {isSelected && (
                      <span className="absolute -inset-1.5 rounded-full border-2 border-obsidian bg-ivory/75 shadow-sm" />
                    )}

                    <PlantIcon
                      plantId={plant.id}
                      bloomColor={plant.colorHex}
                      isBlooming={isBlooming}
                      isPeak={isPeak}
                      sizeClass="relative w-7 h-7 sm:w-9 sm:h-9 drop-shadow-xs"
                    />
                  </div>

                  {/* Plant Label Pill (always shown for selected, shown on hover/focus for others) */}
                  <span
                    className={`mt-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold whitespace-nowrap shadow-xs transition-opacity ${
                      isSelected
                        ? 'bg-obsidian text-ivory opacity-100'
                        : 'bg-ivory/95 text-ink opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 pointer-events-none border border-obsidian/10'
                    }`}
                  >
                    {plant.commonName}
                  </span>
                </button>
              );
            })}

            {/* Bottom Map Legend Bar */}
            <div className="pointer-events-none absolute bottom-2.5 left-2.5 right-2.5 flex flex-wrap items-center justify-between gap-2 z-20">
              <div className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full bg-ivory/88 backdrop-blur-sm px-3 py-1.5 text-[10px] font-medium text-ink border border-obsidian/10 shadow-xs">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-gold" />
                  Peak Bloom
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-gold-deep" />
                  Blooming
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#6D8A67]" />
                  Resting Foliage
                </span>
              </div>

              <div className="hidden sm:inline-flex rounded-full bg-ivory/88 backdrop-blur-sm px-3 py-1.5 text-[10px] font-medium text-ink-muted border border-obsidian/10">
                Tap any tree or flower to trace nectar to the hive
              </div>
            </div>
          </div>

          {/* Category Filter Tabs Directly Below the Map (Visible on Home & Flora Page) */}
          <div className="glass-pearl rounded-2xl p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {LAYERS.map((layer) => {
                const active = layerFilter === layer;
                const label = layer === 'All' ? 'All Plants' : layer;
                return (
                  <button
                    key={layer}
                    type="button"
                    onClick={() => setLayerFilter(layer)}
                    aria-pressed={active}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                      active
                        ? 'bg-obsidian text-ivory shadow-xs'
                        : 'bg-parchment/90 text-ink-muted border border-obsidian/10 hover:bg-nectar hover:text-ink'
                    }`}
                  >
                    {label} ({layerCounts[layer]})
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setInBloomOnly((b) => !b)}
              aria-pressed={inBloomOnly}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                inBloomOnly
                  ? 'bg-obsidian text-gold-bright shadow-xs'
                  : 'bg-parchment/90 text-ink-muted border border-obsidian/10 hover:text-ink'
              }`}
            >
              {inBloomOnly ? 'Showing In-Bloom Only' : `In-Bloom in ${MONTHS[month - 1]} Only`}
            </button>
          </div>
        </div>

        {/* Right Column: Selected Plant Inspector */}
        <aside className="lg:col-span-4 glass-pearl rounded-3xl p-5 space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="shrink-0 w-14 h-14 rounded-2xl bg-ivory-deep/85 border border-obsidian/10 flex items-center justify-center">
              <PlantIcon
                plantId={selected.id}
                bloomColor={selected.colorHex}
                isBlooming={isSelectedBlooming}
                isPeak={isSelectedPeak}
                sizeClass="w-11 h-11"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    isSelectedPeak
                      ? 'bg-obsidian text-gold-bright'
                      : isSelectedBlooming
                        ? 'bg-nectar text-gold-deep'
                        : 'bg-ivory-deep text-ink-muted'
                  }`}
                >
                  {isSelectedPeak
                    ? `Peak Bloom in ${MONTHS[month - 1]}`
                    : isSelectedBlooming
                      ? `Blooming in ${MONTHS[month - 1]}`
                      : `Resting in ${MONTHS[month - 1]}`}
                </span>
              </div>
              <h4 className="mt-1 font-serif text-xl font-semibold text-ink leading-tight">
                {selected.commonName}
              </h4>
              <p className="text-xs italic text-ink-muted">
                {selected.botanicalName} · {selected.mapZone}
              </p>
            </div>
          </div>

          {/* Color & Taste */}
          <div className="rounded-2xl bg-parchment/85 border border-obsidian/8 p-3.5 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-ink">Honey Impact</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-deep">
                <span
                  className="w-3 h-3 rounded-full border border-obsidian/15"
                  style={{ backgroundColor: selected.colorHex }}
                />
                {selected.colorImpact}
              </span>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">{selected.flavorNotes}</p>
          </div>

          {/* Plant Health Contribution */}
          <div className="rounded-2xl bg-parchment/85 border border-obsidian/8 p-3.5 space-y-1.5">
            <div className="text-xs font-semibold text-bloom-deep">
              {selected.medicinal.primaryBenefit}
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              {selected.medicinal.honeyEffect}
            </p>
            <div className="pt-1 flex items-center justify-between text-[11px] text-ink-muted">
              <span>Nectar flow: {selected.nectarScore}/5</span>
              <span>Bee pollen: {selected.pollenScore}/5</span>
            </div>
          </div>

          {/* Year-Round Bloom Calendar for Selected Plant */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-ink">Bloom Calendar</span>
              <span className="text-[11px] text-ink-muted">Tap month to jump</span>
            </div>
            <div className="grid grid-cols-12 gap-1">
              {MONTHS.map((mLabel, i) => {
                const mNum = i + 1;
                const isPeakM = selected.peakMonths.includes(mNum);
                const isBloomM = selected.bloomMonths.includes(mNum);
                const isCurrent = mNum === month;
                return (
                  <button
                    key={mLabel}
                    type="button"
                    onClick={() => {
                      setPlaying(false);
                      setMonth(mNum);
                    }}
                    title={`${mLabel}: ${isPeakM ? 'Peak bloom' : isBloomM ? 'Blooming' : 'Resting'}`}
                    className={`rounded-md py-1.5 text-[10px] font-semibold transition cursor-pointer ${
                      isCurrent ? 'ring-2 ring-obsidian ' : ''
                    }${
                      isPeakM
                        ? 'bg-obsidian text-gold-bright'
                        : isBloomM
                          ? 'bg-gold/25 text-gold-deep'
                          : 'bg-ivory-deep/75 text-ink-muted/70'
                    }`}
                  >
                    {mLabel.slice(0, 1)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Jump to Active Honey Drivers */}
          <div className="space-y-1.5 pt-1 border-t border-obsidian/10">
            <div className="text-[11px] font-semibold text-ink-muted">
              Top in bloom ({MONTHS[month - 1]}):
            </div>
            <div className="flex flex-wrap gap-1.5">
              {topBloomingNow.map((p) => {
                const active = p.id === selected.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedId(p.id)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition cursor-pointer ${
                      active
                        ? 'bg-obsidian text-ivory'
                        : 'bg-parchment/90 text-ink-muted border border-obsidian/10 hover:bg-nectar hover:text-ink'
                    }`}
                  >
                    {p.commonName}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>

      {/* Full St. Mary Plant Directory (Flora Page Only) */}
      {!compact && (
        <section className="space-y-4 pt-2">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-serif text-xl sm:text-2xl font-semibold text-ink">
              St. Mary Flora Directory ({filteredPlants.length})
            </h3>
            <span className="text-xs text-ink-muted">
              Select any plant to trace it on the hillside map
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlants.map((plant) => {
              const active = plant.id === selected.id;
              const isPeak = plant.peakMonths.includes(month);
              const isBlooming = plant.bloomMonths.includes(month);
              return (
                <button
                  key={plant.id}
                  type="button"
                  onClick={() => setSelectedId(plant.id)}
                  className={`text-left glass-pearl rounded-2xl p-4 transition cursor-pointer ${
                    active
                      ? 'ring-2 ring-gold border-gold/40'
                      : 'hover:border-gold/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-11 h-11 rounded-xl bg-ivory-deep/80 border border-obsidian/10 flex items-center justify-center">
                      <PlantIcon
                        plantId={plant.id}
                        bloomColor={plant.colorHex}
                        isBlooming={isBlooming}
                        isPeak={isPeak}
                        sizeClass="w-9 h-9"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-serif text-base font-semibold text-ink truncate">
                          {plant.commonName}
                        </span>
                        <span
                          className="shrink-0 w-2.5 h-2.5 rounded-full border border-obsidian/15"
                          style={{ backgroundColor: plant.colorHex }}
                          title={plant.colorImpact}
                        />
                      </div>
                      <div className="text-[11px] italic text-ink-muted truncate">
                        {plant.botanicalName} · {plant.layer}
                      </div>
                      <div className="mt-1.5 text-xs font-medium text-bloom-deep">
                        {plant.medicinal.primaryBenefit}
                      </div>
                      <div className="mt-1 text-[11px] text-ink-muted">
                        Blooms:{' '}
                        {plant.bloomMonths.map((m) => MONTHS[m - 1]).join(', ')}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
