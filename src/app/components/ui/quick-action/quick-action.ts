import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-quick-action',
  standalone: true,
  imports: [NgIf],
  templateUrl: './quick-action.html',
  styleUrl: './quick-action.scss'
})
export class QuickActionComponent {
  @Input() label: string = '';
  @Input() iconSrc: string = '';
  @Input() href: string | null = null;
}
