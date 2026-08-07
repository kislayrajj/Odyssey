export interface Category {
  id: string;
  title: string;
  note?: string;
  companyDataAsOf?: string;
  companyDataSource?: string;
  updatedAt?: string;
  uiConfig?: {
    primaryViewTitle: string;
    primaryViewSubtitle: string;
    accordionMode?: boolean; 
  };
}

export interface Topic {
  id: string;
  categoryId: string;
  name: string;
  order: number;
  type?: 'theory' | 'practice'; // Used in DB syllabus
  subtopics?: string[];
}

export interface Item {
  id: string;
  categoryId: string;
  topicIds: string[];
  title: string;
  url: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  acceptance?: number;
  companies?: string[];
  recentCompanies?: string[];
  tags?: string[];
  note?: string;
}

export interface UserItemData {
  note?: string;
  updatedAt?: string;
}

export interface UserNote {
  itemId: string;
  content: string;
  updatedAt: string;
}