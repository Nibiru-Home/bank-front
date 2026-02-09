import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { UiNotificationService } from './services/ui-notification.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly notifications = inject(UiNotificationService);

  closeErrorBanner(): void {
    this.notifications.clearError();
  }
}
