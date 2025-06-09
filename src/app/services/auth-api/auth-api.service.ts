import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private baseURL: string;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    if (isPlatformServer(this.platformId)) {
      this.baseURL = 'https://frontend-take-home-service.fetch.com';
    } else {
      this.baseURL = '/api';
    }
  }

  login(name: string, email: string): Observable<any> {
    return this.http.post(`${this.baseURL}/auth/login`, { name, email }, {
      observe: 'response',
      withCredentials: true,
      responseType: 'text'
    });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseURL}/auth/logout`, {}, { withCredentials: true });
  }

  verifyAuthStatus(): Observable<boolean> {
    return this.http.get(`${this.baseURL}/dogs/breeds`, { withCredentials: true }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
