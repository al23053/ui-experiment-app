export interface Task {
  id: string;
  description: string;
}

export const tasks: Task[] = [
  {
    id: 'delete-confirm',
    description: 'ファイル一覧から「sample.txt」を削除してください',
  },
  {
    id: 'sort',
    description: '商品一覧を価格が安い順に並べ替えてください',
  },
  {
    id: 'filter',
    description: 'タスク一覧から完了済みのタスクだけ表示してください',
  },
];
