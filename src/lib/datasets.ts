const DATASET_BASE = "https://klubfisika.github.io/datasets/v1";

interface InstitutionsByRegion {
  [region: string]: {
    smp: string[];
    sma: string[];
    smk: string[];
    universitas: string[];
  };
}

export interface Competition {
  name: string;
  organizer: string;
  categories: string[];
  level: string;
  frequency: string;
  venue: string;
  registration_period: string;
  competition_period: string;
  website?: string;
  teams_limit?: number;
  prize_pool?: string;
  participants_limit?: number;
  team_size?: number;
  selection_process?: string;
}

export interface CompetitionsData {
  [category: string]: {
    [level: string]: Competition[];
  };
}

let institutionsCache: string[] | null = null;
const datasetCache = new Map<string, unknown>();

export async function fetchInstitutions(): Promise<string[]> {
  if (institutionsCache) return institutionsCache;

  try {
    const res = await fetch(`${DATASET_BASE}/institutions-diy.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: InstitutionsByRegion = await res.json();

    const all: string[] = [];
    for (const region of Object.values(data)) {
      all.push(...(region.smp || []));
      all.push(...(region.sma || []));
      all.push(...(region.smk || []));
      all.push(...(region.universitas || []));
    }

    institutionsCache = [...new Set(all)].sort();
    return institutionsCache;
  } catch {
    return [];
  }
}

export function searchInstitutions(query: string, institutions: string[]): string[] {
  const q = query.toLowerCase();
  return institutions.filter((inst) => inst.toLowerCase().includes(q)).slice(0, 10);
}

async function fetchDataset<T>(filename: string): Promise<T | null> {
  if (datasetCache.has(filename)) return datasetCache.get(filename) as T;
  try {
    const res = await fetch(`${DATASET_BASE}/${filename}`);
    if (!res.ok) return null;
    const data: T = await res.json();
    datasetCache.set(filename, data);
    return data;
  } catch {
    return null;
  }
}

export async function fetchCompetitions(): Promise<CompetitionsData | null> {
  return fetchDataset<CompetitionsData>("competitions-indonesia.json");
}

export const CATEGORY_LABELS: Record<string, { label: string; icon: string }> = {
  robotics: { label: "Robotik", icon: "🤖" },
  rocket: { label: "Roket", icon: "🚀" },
  physics_olympiad: { label: "Olimpiade Fisika", icon: "🔬" },
  research_competitions: { label: "Riset", icon: "📚" },
  maker_competitions: { label: "Maker", icon: "🛠️" },
};

export const LEVEL_LABELS: Record<string, string> = {
  national: "Nasional",
  regional: "Regional",
  international: "Internasional",
};

interface PhysicsProgram {
  name: string;
  location: string;
  programs: Record<string, {
    name: string;
    accreditation: string;
    specializations?: string[];
  }>;
}

interface PhysicsProgramsData {
  public_universities: Record<string, PhysicsProgram[]>;
  private_universities: Record<string, PhysicsProgram[]>;
}

export async function fetchPhysicsPrograms(): Promise<string[]> {
  const data = await fetchDataset<PhysicsProgramsData>("physics-programs.json");
  if (!data) return [];

  const programs: string[] = [];
  const addPrograms = (unis: Record<string, PhysicsProgram[]>) => {
    for (const unisList of Object.values(unis)) {
      for (const uni of unisList) {
        for (const prog of Object.values(uni.programs)) {
          programs.push(`${prog.name} - ${uni.name}`);
        }
      }
    }
  };

  addPrograms(data.public_universities);
  addPrograms(data.private_universities);
  return [...new Set(programs)].sort();
}

export async function fetchPhysicsSpecializations(): Promise<string[]> {
  const data = await fetchDataset<PhysicsProgramsData>("physics-programs.json");
  if (!data) return [];

  const specs = new Set<string>();
  const addSpecs = (unis: Record<string, PhysicsProgram[]>) => {
    for (const unisList of Object.values(unis)) {
      for (const uni of unisList) {
        for (const prog of Object.values(uni.programs)) {
          if (prog.specializations) {
            for (const spec of prog.specializations) {
              specs.add(spec);
            }
          }
        }
      }
    }
  };

  addSpecs(data.public_universities);
  addSpecs(data.private_universities);
  return [...specs].sort();
}
