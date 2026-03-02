import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../core/services/task.service';
import { Task, TaskStatus, Priority } from '../../core/models/task.model';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select'; // PrimeNG 19+ use Select instead of Dropdown
import { DatePickerModule } from 'primeng/datepicker'; // PrimeNG 19+ use DatePicker instead of Calendar
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ValidateOutlineDirective } from '../../validator/validate-outline.directive';
import { Router } from '@angular/router';
import { EditorModule } from 'primeng/editor';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    ValidateOutlineDirective,
    DialogModule,
    SelectModule,
    DatePickerModule,
    InputTextModule,
    TagModule,
    EditorModule,
  ],
  templateUrl: './task-list.html',
})
export class TaskList {
  private taskService = inject(TaskService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // State Signals
  tasks = this.taskService.tasks;
  isDialogVisible = signal(false);
  isEditMode = signal(false);
  selectedTaskId = signal<string | null>(null);

  // Form Options
  statusOptions = signal<TaskStatus[]>(['Todo', 'In Progress', 'Done']);
  priorityOptions = signal<Priority[]>(['Low', 'Medium', 'High']);

  taskForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    status: ['Todo', Validators.required],
    priority: ['Medium', Validators.required],
    dueDate: [new Date(), Validators.required],
    assignee: this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    }),
  });

  showAddTask() {
    this.isEditMode.set(false);
    this.taskForm.reset({ status: 'Todo', priority: 'Medium', dueDate: new Date() });
    this.isDialogVisible.set(true);
  }

  viewTaskDetails(taskId: string) {
    // Navigate to the detail page using the task ID stored in the event
    this.router.navigate(['/tasks', taskId]);
  }

  showEditTask(task: Task) {
    this.isEditMode.set(true);
    this.selectedTaskId.set(task.id);
    this.isDialogVisible.set(true);

    setTimeout(() => {
      this.taskForm.patchValue({
        title: task.title,
        description: task.description || '', // Ensure empty string if null
        status: task.status,
        priority: task.priority,
        dueDate: new Date(task.dueDate),
        assignee: {
          name: task.assignee.name,
          email: task.assignee.email,
        },
      });
    }, 0);
  }

  saveTask() {
    if (this.taskForm.invalid) return;

    const formValue = this.taskForm.value;
    const taskData: Task = {
      ...formValue,
      id: this.isEditMode() ? this.selectedTaskId()! : `TASK-${Math.floor(Math.random() * 1000)}`,
      dueDate: formValue.dueDate.toISOString(),
      comments: this.isEditMode()
        ? this.tasks().find((t) => t.id === this.selectedTaskId())?.comments || []
        : [],
    };

    if (this.isEditMode()) {
      this.taskService.updateTask(taskData);
    } else {
      this.taskService.addTask(taskData);
    }

    this.isDialogVisible.set(false);
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id);
  }

  getSeverity(status: string) {
    switch (status) {
      case 'Done':
        return 'success';
      case 'In Progress':
        return 'info';
      case 'Todo':
        return 'secondary';
      default:
        return 'contrast';
    }
  }

  stripHtml(html: string | undefined): string {
    if (!html) return '';
    // Use a regex to strip tags, then trim whitespace
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent?.trim() || '';
  }
}
