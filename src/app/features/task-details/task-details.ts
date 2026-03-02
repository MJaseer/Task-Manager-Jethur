import { Component, inject, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../core/services/task.service';
import { EditorModule } from 'primeng/editor';
import { FormsModule } from '@angular/forms';
import { CommentThread } from './components/comment-thread/comment-thread';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule, EditorModule, FormsModule, CommentThread],
  templateUrl: './task-details.html',
  styleUrl: './task-details.css',
})
export class TaskDetails {
  id = input.required<string>();

  private taskService = inject(TaskService);

  // Reactive connection to the global store
  task = computed(() => this.taskService.getTaskById(this.id())());
}
