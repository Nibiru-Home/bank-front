import { Routes } from '@angular/router';
import { IndexComponent } from './components/pages/index/index';
import { LoginComponent } from './components/pages/login/login';
import { AccountsComponent } from './components/pages/accounts/accounts';
import { AccountCreateComponent } from './components/pages/account-create/account-create';
import { CardsComponent } from './components/pages/cards/cards';
import { CardCreateComponent } from './components/pages/card-create/card-create';
import { AccountDetailComponent } from './components/pages/account-detail/account-detail';
import { CardDetailComponent } from './components/pages/card-detail/card-detail';

export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'login', component: LoginComponent },
  { path: 'accounts', component: AccountsComponent },
  { path: 'accounts/new', component: AccountCreateComponent }, // Specific route first
  { path: 'accounts/:id', component: AccountDetailComponent },
  { path: 'cards', component: CardsComponent },
  { path: 'cards/new', component: CardCreateComponent }, // Specific route first
  { path: 'cards/:id', component: CardDetailComponent }
];
