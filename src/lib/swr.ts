import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

// Cached hooks for common data
export function useAnalytics(userId: string | undefined) {
  return useSWR(
    userId ? `/api/analytics?userId=${userId}` : null,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );
}

export function useRevisions(userId: string | undefined, type: 'due' | 'upcoming' = 'due') {
  return useSWR(
    userId ? `/api/revisions?userId=${userId}&type=${type}` : null,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );
}

export function useLeaderboard(type: string, exam: string, period: string, userId: string | undefined) {
  return useSWR(
    userId ? `/api/leaderboard?type=${type}&exam=${exam}&period=${period}&userId=${userId}` : null,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );
}

export function useQuestions(filters: { subject?: string; difficulty?: string; chapter?: string }) {
  const params = new URLSearchParams();
  if (filters.subject) params.set('subject', filters.subject);
  if (filters.difficulty) params.set('difficulty', filters.difficulty);
  if (filters.chapter) params.set('chapter', filters.chapter);
  
  return useSWR(
    `/api/questions?${params.toString()}`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );
}

export function useMockTests(userId: string | undefined) {
  return useSWR(
    userId ? `/api/mocktest?userId=${userId}` : null,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );
}
