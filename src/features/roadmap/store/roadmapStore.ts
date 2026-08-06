import { create } from 'zustand';

type ViewMode = 'syllabus' | 'company';
type Difficulty = 'All' | 'Easy' | 'Medium' | 'Hard';

interface RoadmapState {
  viewMode: ViewMode;
  searchQuery: string;
  difficultyFilter: Difficulty;
  activeCompany: string | null;
  
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  setDifficultyFilter: (diff: Difficulty) => void;
  setActiveCompany: (company: string | null) => void;
  resetFilters: () => void;
}

export const useRoadmapStore = create<RoadmapState>((set) => ({
  viewMode: 'syllabus',
  searchQuery: '',
  difficultyFilter: 'All',
  activeCompany: null,

  setViewMode: (mode) => set({ viewMode: mode }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setDifficultyFilter: (diff) => set({ difficultyFilter: diff }),
  setActiveCompany: (company) => set({ activeCompany: company }),
  resetFilters: () => set({ searchQuery: '', difficultyFilter: 'All' }),
}));