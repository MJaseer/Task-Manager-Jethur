export type TaskStatus = 'Todo' | 'In Progress' | 'Done';
export type Priority = 'Low' | 'Medium' | 'High';

export interface Comment {
  id: string;
  author: string;
  avatarUrl?: string;
  content: string;
  createdAt: Date | string;
  // Recursive property for nested replies
  replies: Comment[]; 
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
  assignee: {
    name: string;
    email: string;
  };
  comments: Comment[];
}