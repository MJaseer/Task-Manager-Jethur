import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { Task, Comment } from '../models/task.model';
import { map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);
  private readonly DATA_URL = environment.api;

  // 1. The Primary State (The "Source of Truth")
  private _tasks = signal<Task[]>([]);

  // 2. Read-only access for components
  public tasks = this._tasks.asReadonly();
  public loading = computed(() => this.taskResource.isLoading());

  // 3. Using rxResource for the initial fetch
  // This automatically triggers when the service is initialized
  private taskResource = rxResource({
    stream: () => this.http.get<Task[]>(this.DATA_URL).pipe(tap((data) => this._tasks.set(data))),
  });

  // --- CRUD Operations ---

  addTask(newTask: Task) {
    this._tasks.update((tasks) => [...tasks, newTask]);
  }

  updateTask(updatedTask: Task) {
    this._tasks.update((tasks) => tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  }

  deleteTask(taskId: string) {
    this._tasks.update((tasks) => tasks.filter((t) => t.id !== taskId));
  }

  /**
   * Returns a specific task by ID.
   * Since this is a Signal, components using it will react
   * automatically if the task data changes.
   */
  getTaskById(id: string) {
    return computed(() => this._tasks().find((t) => t.id === id));
  }

  /**
   * Adds a comment to a specific task.
   * For nested comments, you would typically pass the parent ID.
   */
  addComment(taskId: string, parentCommentId: string | null, content: string) {
    const newComment: Comment = {
      id: crypto.randomUUID(),
      author: 'Current User', // In a real app, get from an AuthService
      content: content,
      createdAt: new Date().toISOString(),
      replies: []
    };

    this._tasks.update((tasks) =>
      tasks.map((task) => {
        if (task.id !== taskId) return task;

        // If it's a top-level comment (no parent)
        if (!parentCommentId) {
          return { ...task, comments: [...task.comments, newComment] };
        }

        // If it's a nested reply, recurse through existing comments
        return {
          ...task,
          comments: this.addReplyToNestedList(task.comments, parentCommentId, newComment)
        };
      })
    );
  }

  private addReplyToNestedList(comments: Comment[], parentId: string, newComment: Comment): Comment[] {
    return comments.map((comment) => {
      if (comment.id === parentId) {
        return { ...comment, replies: [...comment.replies, newComment] };
      }
      if (comment.replies.length > 0) {
        return { 
          ...comment, 
          replies: this.addReplyToNestedList(comment.replies, parentId, newComment) 
        };
      }
      return comment;
    });
  }
}
