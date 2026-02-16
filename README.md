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

## セットアップ

### 1. Supabaseプロジェクトの作成

1. https://supabase.com にアクセスしてサインアップ
2. 新しいプロジェクトを作成
3. Table Editorで以下のテーブルを作成：

**テーブル名**: `experiment_results`

| Column name | Type | Default value | Primary |
|------------|------|---------------|---------|
| id | uuid | uuid_generate_v4() | ✅ |
| task_id | text | - | - |
| variant | text | - | - |
| duration | int8 | - | - |
| session_id | text | - | - |
| created_at | timestamptz | now() | - |

4. RLS（Row Level Security）を有効化し、以下のポリシーを追加：
   - Enable read access for all users
   - Enable insert access for all users

5. Project Settings → API から以下をコピー：
   - Project URL
   - anon public key

### 2. プロジェクトのセットアップ

```bash
# リポジトリをクローン
git clone https://github.com/al23053/ui-experiment-app.git
cd ui-experiment-app

# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.local.example .env.local
```

`.env.local` を編集してSupabaseの情報を設定：

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

```bash
# 開発サーバーを起動
npm run dev
```

ブラウザで `http://localhost:3000` を開いてください。

## 使い方

1. トップページで「Start Experiment」をクリック
2. ランダムに割り当てられたUI（Bad または Improved）でタスクを完了
3. 結果画面で全ユーザーの平均時間を確認

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

## データ設計

### 実験の流れ

1. ユーザーがアクセス → セッションIDを自動生成
2. Bad/Improved のいずれかをランダムに割当
3. タスク完了時にデータをSupabaseに保存
4. 結果画面で全ユーザーの集計結果を表示

### データ構造

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

### 集計ロジック

- Bad UI: 全Bad UIデータの平均時間
- Improved UI: 全Improved UIデータの平均時間
- 改善効果: (1 - Improved平均 / Bad平均) × 100%

## 拡張方法

### 新しいタスクの追加

1. `/lib/tasks.ts` にタスクを追加
2. 対応する Bad/Improved コンポーネントを作成
3. `/app/play/page.tsx` で条件分岐を追加

### データ分析の追加

Supabaseのダッシュボードで直接SQLクエリを実行可能：

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
