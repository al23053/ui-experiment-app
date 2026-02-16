# UI Comparison Experiment App

UIデザインの良し悪しが作業効率に与える影響を測定するWebアプリケーションです。

## 概要

Bad UI / Improved UI の2パターンをランダムに提示し、タスク完了時間を計測します。
複数ユーザーのデータを集約し、UI改善の効果を定量的に測定します。

## 技術スタック

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Supabase（PostgreSQL）

## データベース設計

### テーブル構造

**テーブル名**: `experiment_results`

| Column name | Type | Default value | Primary |
|------------|------|---------------|---------|
| id | uuid | gen_random_uuid() | ✅ |
| task_id | text | - | - |
| variant | text | - | - |
| duration | int8 | - | - |
| session_id | text | - | - |
| created_at | timestamptz | now() | - |

### RLSポリシー

```sql
-- 読み取り許可
CREATE POLICY "Enable read access for all users"
ON public.experiment_results
FOR SELECT TO public USING (true);

-- 書き込み許可
CREATE POLICY "Enable insert access for all users"
ON public.experiment_results
FOR INSERT TO public WITH CHECK (true);
```

## プロジェクト構成

```
ui-experiment-app/
├── app/
│   ├── page.tsx              # スタート画面
│   ├── play/page.tsx         # 実験実行画面
│   └── result/page.tsx       # 結果表示画面（全体集計）
├── components/
│   ├── BadForm.tsx           # Bad UI フォーム
│   ├── ImprovedForm.tsx      # Improved UI フォーム
│   └── Timer.tsx             # タイマー
├── lib/
│   ├── supabase.ts           # Supabaseクライアント
│   ├── tasks.ts              # タスク定義
│   └── storage.ts            # データ保存・取得ロジック
└── ...
```

## 主な機能

- **ランダム割当**: Bad/Improved UIをランダムに表示
- **時間計測**: タスク開始から完了までの時間をミリ秒単位で計測
- **データ集約**: 複数ユーザーのデータを自動集計
- **統計表示**: 各バリアントの平均時間とサンプル数を表示
- **改善効果**: 時間短縮率を自動計算

## 実験の流れ

1. ユーザーがアクセス → セッションIDを自動生成
2. Bad/Improved のいずれかをランダムに割当
3. タスク完了時にデータをSupabaseに保存
4. 結果画面で全ユーザーの集計結果を表示

## データ構造

```typescript
{
  id: uuid,
  task_id: 'form-input',
  variant: 'bad' | 'improved',
  duration: number, // ミリ秒
  session_id: string, // ブラウザごとに一意
  created_at: timestamp
}
```

## 集計ロジック

- **Bad UI**: 全Bad UIデータの平均時間
- **Improved UI**: 全Improved UIデータの平均時間
- **改善効果**: (1 - Improved平均 / Bad平均) × 100%

## 拡張方法

### 新しいタスクの追加

1. `/lib/tasks.ts` にタスクを追加
2. 対応する Bad/Improved コンポーネントを作成
3. `/app/play/page.tsx` で条件分岐を追加

### データ分析

SupabaseのSQL Editorで分析クエリを実行：

```sql
-- バリアントごとの統計
SELECT 
  variant,
  COUNT(*) as count,
  AVG(duration) as avg_duration,
  STDDEV(duration) as std_duration
FROM experiment_results
WHERE task_id = 'form-input'
GROUP BY variant;
```

## 工夫した点

- **統計的妥当性**: 複数ユーザーのデータを集約することで信頼性の高い比較を実現
- **セッション管理**: ブラウザごとに一意のIDを付与し、重複を防止
- **リアルタイム集計**: データ保存と同時に最新の統計を表示
- **拡張性**: 新しいタスクの追加が容易な設計

## ライセンス

MIT
