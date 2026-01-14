import { Routes } from '@angular/router';
import { IndexComponent } from './components/pages/index/index';
import { LoginComponent } from './components/pages/login/login';
import { AccountsComponent } from './components/pages/accounts/accounts';
import { CardsComponent } from './components/pages/cards/cards';

export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'login', component: LoginComponent },
  { path: 'accounts', component: AccountsComponent },
  { path: 'cards', component: CardsComponent }
];
