import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../layout/header/header';
import { FooterComponent } from '../../layout/footer/footer';

@Component({
  selector: 'app-contratar-productos',
  standalone: true,
  imports: [RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './contratar-productos.html',
  styleUrl: './contratar-productos.scss'
})
export class ContratarProductosComponent {}
