import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';
import { Observable } from 'rxjs';

export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export interface DogSearchResult {
  resultIds: string[];
  total: number;
  next?: string;
  prev?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DogSearchService {
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

  getBreeds(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseURL}/dogs/breeds`, { withCredentials: true });
  }

  searchDogs(filters: any): Observable<DogSearchResult> {
    let params = new HttpParams();
    if (filters.breeds && filters.breeds.length) {
      filters.breeds.forEach((breed: string) => {
        params = params.append('breeds', breed);
      });
    }
    if (filters.zipCodes && filters.zipCodes.length) {
      filters.zipCodes.forEach((zip: string) => {
        params = params.append('zipCodes', zip);
      });
    }
    if (filters.ageMin) {
      params = params.append('ageMin', filters.ageMin);
    }
    if (filters.ageMax) {
      params = params.append('ageMax', filters.ageMax);
    }
    params = params.append('sort', `breed:${filters.sortDirection}`);
    params = params.append('size', filters.pageSize.toString());
    params = params.append('from', (filters.pageIndex * filters.pageSize).toString());

    return this.http.get<DogSearchResult>(`${this.baseURL}/dogs/search`, { params, withCredentials: true });
  }

  getDogsByIds(ids: string[]): Observable<Dog[]> {
    return this.http.post<Dog[]>(`${this.baseURL}/dogs`, ids, { withCredentials: true });
  }

  getMatch(ids: string[]): Observable<{ match: string }> {
    return this.http.post<{ match: string }>(`${this.baseURL}/dogs/match`, ids, { withCredentials: true });
  }
} 