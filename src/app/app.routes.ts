import { Routes } from '@angular/router';
import { IndexComponent } from './components/pages/index/index';
import { LoginComponent } from './components/pages/login/login';
import { ContratarProductosComponent } from './components/pages/contratar-productos/contratar-productos';

export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'login', component: LoginComponent },
  { path: 'contratar-productos', component: ContratarProductosComponent }
];
