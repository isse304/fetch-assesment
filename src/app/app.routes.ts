import { Routes } from '@angular/router';
import { Login } from './components/auth/login/login';
import { DogSearch } from './components/search/dog-search/dog-search';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'search', component: DogSearch, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];
