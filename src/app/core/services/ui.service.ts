import { Injectable } from '@angular/core';
import { TaskStatus, Priority } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  // Standardized severity mapping for PrimeNG Tags
  getStatusSeverity(status: TaskStatus | string) {
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

  // Standardized color mapping for Priority labels
  getPriorityColor(priority: Priority | string): string {
    switch (priority) {
      case 'High':
        return '#ef4444';
      case 'Medium':
        return '#f59e0b';
      case 'Low':
        return '#10b981';
      default:
        return '#6366f1';
    }
  }
}
