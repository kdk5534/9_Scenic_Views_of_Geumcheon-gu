import { useEffect, useState } from 'react';

const STORAGE_KEY = 'geumcheon_quiz_v1';

export interface QuizRecord {
  spotId: number;
  score: number;    // 0-3
  completed: boolean;
  answeredAt: string;
}

function load(): Record<number, QuizRecord> {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}'); } catch { return {}; }
}

function save(data: Record<number, QuizRecord>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useQuiz() {
  const [records, setRecords] = useState<Record<number, QuizRecord>>(load);

  useEffect(() => { save(records); }, [records]);

  const saveResult = (spotId: number, score: number) => {
    setRecords(prev => ({
      ...prev,
      [spotId]: { spotId, score, completed: true, answeredAt: new Date().toISOString() },
    }));
  };

  const isCompleted = (spotId: number) => Boolean(records[spotId]?.completed);
  const getScore = (spotId: number) => records[spotId]?.score ?? 0;
  const completedCount = Object.values(records).filter(r => r.completed).length;
  const perfectCount = Object.values(records).filter(r => r.score === 3).length;
  const allCompleted = completedCount === 9;
  const allPerfect = perfectCount === 9;

  return { records, saveResult, isCompleted, getScore, completedCount, perfectCount, allCompleted, allPerfect };
}
