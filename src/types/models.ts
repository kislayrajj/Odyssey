export interface Category {
  id: string;
  title: string;
  note?: string;
  companyDataAsOf?: string;
  companyDataSource?: string;
  updatedAt?: string;
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