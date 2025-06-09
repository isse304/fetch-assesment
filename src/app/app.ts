import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from './components/auth/login/login';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'fetch-assesment';
}
