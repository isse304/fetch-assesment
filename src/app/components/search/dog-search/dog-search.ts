import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthApiService } from '../../../services/auth-api/auth-api.service';
import { AuthStateService } from '../../../services/auth-state/auth-state.service';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  Subject,
  switchMap,
  tap,
  map,
  shareReplay,
  catchError,
  of,
  merge,
  debounceTime,
} from 'rxjs';
import { Dog, DogSearchService } from '../../../services/dog-search/dog-search.service';

@Component({
  selector: 'app-dog-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressBarModule,
  ],
  templateUrl: './dog-search.html',
  styleUrl: './dog-search.css',
})
export class DogSearch implements OnInit {
  // Public state for the template
  public breeds$: Observable<string[]>;
  public dogs$ = new BehaviorSubject<Dog[]>([]);
  public totalResults$ = new BehaviorSubject<number>(0);
  public loading$ = new BehaviorSubject<boolean>(true);
  public matchDog$: Observable<Dog | null>;

  // Action streams
  private onSearch$ = new Subject<void>();
  private onGenerateMatch$ = new Subject<void>();
  private onClearMatch$ = new Subject<void>();

  // Component state for UI bindings
  public selectedBreeds: string[] = [];
  public ageMin: number | null = null;
  public ageMax: number | null = null;
  public zipCodes: string = '';
  public favorites = new Set<string>();
  public pageIndex = 0;
  public pageSize = 10;
  public sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private authApiService: AuthApiService,
    private authStateService: AuthStateService,
    private router: Router,
    private dogSearchService: DogSearchService
  ) {
    this.breeds$ = this.dogSearchService.getBreeds().pipe(
      catchError(() => of([])),
      shareReplay(1)
    );

    this.onSearch$
      .pipe(
        debounceTime(300),
        tap(() => this.loading$.next(true)),
        switchMap(() => {
          const filters = {
            breeds: this.selectedBreeds,
            zipCodes: this.zipCodes.split(',').map((z) => z.trim()).filter(Boolean),
            ageMin: this.ageMin,
            ageMax: this.ageMax,
            sortDirection: this.sortDirection,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
          };
          return this.dogSearchService.searchDogs(filters).pipe(
            catchError(() => {
              this.totalResults$.next(0);
              return of({ resultIds: [], total: 0 });
            })
          );
        }),
        tap((searchResult) => this.totalResults$.next(searchResult.total)),
        switchMap((searchResult) =>
          searchResult.resultIds.length > 0
            ? this.dogSearchService.getDogsByIds(searchResult.resultIds).pipe(catchError(() => of([])))
            : of([])
        ),
        tap((dogs) => {
          this.dogs$.next(dogs);
          this.loading$.next(false);
        })
      )
      .subscribe();

    const generateMatch$ = this.onGenerateMatch$.pipe(
      tap(() => this.loading$.next(true)),
      switchMap(() => {
        if (this.favorites.size === 0) return of(null);
        const favoriteIds = Array.from(this.favorites);
        return this.dogSearchService.getMatch(favoriteIds).pipe(
          switchMap((match) => this.dogSearchService.getDogsByIds([match.match])),
          map((dogs) => (dogs.length > 0 ? dogs[0] : null)),
          catchError(() => of(null))
        );
      }),
      tap(() => this.loading$.next(false))
    );
    const clearMatch$ = this.onClearMatch$.pipe(map(() => null));
    this.matchDog$ = merge(generateMatch$, clearMatch$);
  }

  ngOnInit() {
    this.onSearch$.next();
  }

  onFilterChange() {
    this.pageIndex = 0;
    this.onSearch$.next();
  }

  toggleSortDirection() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.onFilterChange();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.onSearch$.next();
  }

  toggleFavorite(dog: Dog) {
    if (this.favorites.has(dog.id)) {
      this.favorites.delete(dog.id);
    } else {
      this.favorites.add(dog.id);
    }
  }

  generateMatch() {
    this.onGenerateMatch$.next();
  }

  clearMatch() {
    this.onClearMatch$.next();
  }

  logout() {
    this.authApiService.logout().subscribe({
      next: () => {
        this.authStateService.setAuthenticated(false);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed', err);
        this.authStateService.setAuthenticated(false);
        this.router.navigate(['/login']);
      },
    });
  }
}
