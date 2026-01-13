import { Component } from '@angular/core';
import { HeaderComponent } from '../../layout/header/header';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './index.html',
  styleUrl: './index.scss'
})
export class IndexComponent {}
