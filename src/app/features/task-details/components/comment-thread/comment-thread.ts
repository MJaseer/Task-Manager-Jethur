import { Component, input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Required for ngModel
import { Comment } from '../../../../core/models/task.model';
import { TaskService } from '../../../../core/services/task.service';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-comment-thread',
  standalone: true,
  // Added FormsModule and InputTextareaModule
  imports: [CommonModule, FormsModule, ButtonModule, AvatarModule, TextareaModule],
  templateUrl: './comment-thread.html',
  styleUrl: './comment-thread.css',
})
export class CommentThread {
  private taskService = inject(TaskService);
  
  // Inputs
  comment = input.required<Comment>();
  taskId = input.required<string>(); // Needed to tell the service which task to update

  // Local UI State
  isReplying = signal(false);
  replyContent = signal('');

  toggleReply() {
    this.isReplying.update(v => !v);
    this.replyContent.set('');
  }

  submitReply() {
    const content = this.replyContent().trim();
    if (!content) return;

    this.taskService.addComment(this.taskId(), this.comment().id, content);
    
    // Reset state
    this.isReplying.set(false);
    this.replyContent.set('');
  }
}