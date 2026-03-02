import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaskService } from '../../core/services/task.service';

// FullCalendar Imports
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

// PrimeNG & Tailwind Components
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, CardModule],
  templateUrl: './calendar-view.html',
  styleUrl: './calendar-view.css',
})
export class CalendarView {
  private taskService = inject(TaskService);
  private router = inject(Router);

  // 1. Map Tasks to Calendar Events using a Computed Signal
  // This automatically updates the calendar if a task is added or edited elsewhere
  private events = computed(() => {
    return this.taskService.tasks().map((task) => ({
      id: task.id,
      title: task.title,
      start: task.dueDate,
      allDay: true,
      // Color-code based on priority
      backgroundColor: this.getEventColor(task.priority),
      borderColor: 'transparent',
      extendedProps: { status: task.status },
    }));
  });

  // 2. Reactive Calendar Options
  calendarOptions = computed<CalendarOptions>(() => ({
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek',
    },
    events: this.events(),
    eventClick: (info: EventClickArg) => this.handleEventClick(info),
    height: 'auto',
  }));

  private handleEventClick(info: EventClickArg) {
    // Navigate to the detail page using the task ID stored in the event
    const taskId = info.event.id;
    this.router.navigate(['/tasks', taskId]);
  }

  private getEventColor(priority: string): string {
    switch (priority) {
      case 'High':
        return '#ef4444'; // Tailwind red-500
      case 'Medium':
        return '#f59e0b'; // Tailwind amber-500
      case 'Low':
        return '#10b981'; // Tailwind emerald-500
      default:
        return '#6366f1'; // Tailwind indigo-500
    }
  }
}
