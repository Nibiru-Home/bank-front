import { Routes } from '@angular/router';
import { IndexComponent } from './components/pages/index/index';
import { LoginComponent } from './components/pages/login/login';

export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'login', component: LoginComponent }
];
