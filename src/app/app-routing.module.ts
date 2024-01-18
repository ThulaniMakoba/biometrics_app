import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { SuccessErrorComponent } from './components/success-error/success-error.component';
import { LockedOutComponent } from './components/locked-out/locked-out.component';



const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'registration', component: UserRegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'success-error-page', component: SuccessErrorComponent },
  { path: 'locked-out', component: LockedOutComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }