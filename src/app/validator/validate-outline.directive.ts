import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  Self,
} from '@angular/core';
import { AbstractControl, ControlContainer, FormGroupDirective, NgControl } from '@angular/forms';
import { Subscription, merge } from 'rxjs';

@Directive({
  selector: '[appValidateOutline]',
  standalone: true,
})
export class ValidateOutlineDirective implements OnInit, OnDestroy {
  @Input('appValidateOutline') controlName?: string;

  private statusSub?: Subscription;
  private errorElement: HTMLElement | null = null;

  constructor(
    @Optional() @Self() private ngControl: NgControl,
    @Optional() private controlContainer: ControlContainer,
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnInit() {
    const ctrl = this.getControl();
    if (ctrl) {
      // Listen to both status changes and value changes to keep UI in sync
      this.statusSub = merge(ctrl.statusChanges, ctrl.valueChanges).subscribe(() => {
        this.updateUI(ctrl);
      });
    }
  }

private getControl(): AbstractControl | null {
  // 1. If we provided a string path like "assignee.name"
  if (this.controlName && this.controlContainer?.control) {
    return this.controlContainer.control.get(this.controlName);
  }

  // 2. Fallback to direct injection (works for simple top-level controls)
  return this.ngControl?.control || null;
}

updateUI(ctrl: AbstractControl) {
  const isInvalid = ctrl.invalid && (ctrl.touched || ctrl.dirty);

  // Clear existing error message
  if (this.errorElement) {
    this.renderer.removeChild(this.el.nativeElement.parentElement, this.errorElement);
    this.errorElement = null;
  }

  if (isInvalid) {
    this.renderer.addClass(this.el.nativeElement, 'ng-invalid');
    this.renderer.addClass(this.el.nativeElement, 'ng-dirty');
    
    // Specifically target PrimeNG CSS variables for Select and DatePicker
    this.renderer.setStyle(this.el.nativeElement, '--p-select-border-color', '#e24c4c');
    this.renderer.setStyle(this.el.nativeElement, '--p-datepicker-border-color', '#e24c4c');
    this.renderer.setStyle(this.el.nativeElement, 'border-color', '#e24c4c'); // For standard input
    
    this.renderMessage(ctrl.errors);
  } else {
    this.renderer.removeClass(this.el.nativeElement, 'ng-invalid');
    this.renderer.removeStyle(this.el.nativeElement, '--p-select-border-color');
    this.renderer.removeStyle(this.el.nativeElement, '--p-datepicker-border-color');
    this.renderer.removeStyle(this.el.nativeElement, 'border-color');
  }
}

  private renderMessage(errors: any) {
    if (!errors) return;

    this.errorElement = this.renderer.createElement('small');
    // Using PrimeNG error class
    this.renderer.addClass(this.errorElement, 'p-error');
    this.renderer.setStyle(this.errorElement, 'display', 'block');
    this.renderer.setStyle(this.errorElement, 'margin-top', '0.25rem');
    this.renderer.setStyle(this.errorElement, 'font-size', '0.75rem');

    const message = this.getErrorMessage(errors);
    this.renderer.setProperty(this.errorElement, 'innerText', message);

    this.renderer.appendChild(this.el.nativeElement.parentElement, this.errorElement);
  }

  private getErrorMessage(errors: any): string {
    if (errors['required']) return 'This field is required';
    if (errors['email']) return 'Invalid email address';
    if (errors['minlength']) return `Min ${errors['minlength'].requiredLength} chars`;
    return 'Invalid value';
  }

  ngOnDestroy() {
    this.statusSub?.unsubscribe();
  }
}
