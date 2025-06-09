import { Component } from '@angular/core';
import { AuthApiService } from '../../../services/auth-api/auth-api.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStateService } from '../../../services/auth-state/auth-state.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  name!: string;
  email!: string;
  constructor(
    private authApiService: AuthApiService,
    private router: Router,
    private authStateService: AuthStateService
  ) {}

  login(name: string, email: string) {
    this.authApiService.login(name, email).subscribe({
      next: (response) => {
        if (response.status === 200) {
          console.log('Login successful & session verified');
          this.authStateService.setAuthenticated(true);
          this.router.navigate(['/search']);
        } else {
          console.error('Login failed:', response.status);
        }
      },
      error: (error) => {
        console.error('Login error:', error);
      },
    });
  }

  loginFormSubmit(event: Event) {
    event.preventDefault(); // Prevent the default form submission
    this.login(this.name, this.email); // Call the login function with the form values
  }
}
