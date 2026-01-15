import { Component } from '@angular/core';
import { HeaderComponent } from '../../layout/header/header';
import { FooterComponent } from '../../layout/footer/footer';

@Component({
  selector: 'app-incidencias',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './incidencias.html',
  styleUrl: './incidencias.scss'
})
export class IncidenciasComponent {}
