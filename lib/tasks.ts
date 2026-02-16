export interface Task {
  id: string;
  description: string;
}

export const tasks: Task[] = [
  {
    id: 'form-input',
    description: '名前とメールアドレスを入力して送信してください',
  },
];
