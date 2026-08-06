import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Topic, Item } from '@/types/models';

export async function getTopics(categoryId: string): Promise<Topic[]> {
  const q = query(
    collection(db, 'topics'),
    where('categoryId', '==', categoryId),
    orderBy('order', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as Topic);
}

export async function getItems(categoryId: string): Promise<Item[]> {
  const q = query(
    collection(db, 'items'),
    where('categoryId', '==', categoryId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as Item);
}