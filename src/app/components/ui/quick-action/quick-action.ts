import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-quick-action',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './quick-action.html',
  styleUrl: './quick-action.scss'
})
export class QuickActionComponent {
  @Input() label: string = '';
  @Input() iconSrc: string = '';
  @Input() href: string | null = null;
  @Input() routerLink: string | null = null;
}
