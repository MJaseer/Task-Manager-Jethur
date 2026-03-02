import { Component, inject, input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../core/services/task.service';
import { EditorModule } from 'primeng/editor';
import { FormsModule } from '@angular/forms';
import { CommentThread } from './components/comment-thread/comment-thread';
import { Task } from '../../core/models/task.model';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { UiService } from '../../core/services/ui.service';
@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule, EditorModule, FormsModule, CommentThread, ButtonModule, TextareaModule, TagModule],
  templateUrl: './task-details.html',
  styleUrl: './task-details.css',
})
export class TaskDetails {
  id = input.required<string>();

  private taskService = inject(TaskService);
  public ui = inject(UiService);

  // Reactive connection to the global store
  task = computed(() => this.taskService.getTaskById(this.id())());

  newCommentContent = signal('');

  saveDescription(task: Task) {
    // Persist the current task state (including editor changes) to the service
    this.taskService.updateTask(task);
  }

  submitTopLevelComment() {
    const content = this.newCommentContent().trim();
    if (!content) return;

    // Passing null as parentCommentId signals a top-level comment
    this.taskService.addComment(this.id(), null, content);
    this.newCommentContent.set('');
  }
}
