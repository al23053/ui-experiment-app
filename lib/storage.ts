import { supabase } from './supabase';

export interface Result {
  taskId: string;
  variant: 'bad' | 'improved';
  duration: number;
  sessionId: string;
}

export interface AggregatedResult {
  variant: 'bad' | 'improved';
  avgDuration: number;
  count: number;
}

// セッションIDを生成（ブラウザごとに一意）
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = localStorage.getItem('experiment_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('experiment_session_id', sessionId);
  }
  return sessionId;
}

// 結果を保存
export async function saveResult(result: Result): Promise<void> {
  const { error } = await supabase
    .from('experiment_results')
    .insert({
      task_id: result.taskId,
      variant: result.variant,
      duration: result.duration,
      session_id: result.sessionId,
    });

  if (error) {
    console.error('Error saving result:', error);
    throw error;
  }
}

// 全体の集計結果を取得
export async function getAggregatedResults(
  taskId: string
): Promise<AggregatedResult[]> {
  const { data, error } = await supabase
    .from('experiment_results')
    .select('variant, duration')
    .eq('task_id', taskId);

  if (error) {
    console.error('Error fetching results:', error);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Bad と Improved それぞれで平均を計算
  const badResults = data.filter((r) => r.variant === 'bad');
  const improvedResults = data.filter((r) => r.variant === 'improved');

  const results: AggregatedResult[] = [];

  if (badResults.length > 0) {
    results.push({
      variant: 'bad',
      avgDuration: badResults.reduce((sum, r) => sum + r.duration, 0) / badResults.length,
      count: badResults.length,
    });
  }

  if (improvedResults.length > 0) {
    results.push({
      variant: 'improved',
      avgDuration: improvedResults.reduce((sum, r) => sum + r.duration, 0) / improvedResults.length,
      count: improvedResults.length,
    });
  }

  return results;
}

// 自分のセッションの結果を取得（オプション）
export async function getMyResults(sessionId: string): Promise<Result[]> {
  const { data, error } = await supabase
    .from('experiment_results')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching my results:', error);
    return [];
  }

  return (data || []).map((row) => ({
    taskId: row.task_id,
    variant: row.variant as 'bad' | 'improved',
    duration: row.duration,
    sessionId: row.session_id,
  }));
}

