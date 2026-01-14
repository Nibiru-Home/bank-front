import { Component } from '@angular/core';
import { HeaderComponent } from '../../layout/header/header';
import { FooterComponent } from '../../layout/footer/footer';

@Component({
  selector: 'app-contratar-productos',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './contratar-productos.html',
  styleUrl: './contratar-productos.scss'
})
export class ContratarProductosComponent {}
