import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private _search$ = new BehaviorSubject<string | null>(null);

  get search$() {
    return this._search$.asObservable();
  }

  setSearch(term: string | null) {
    this._search$.next(term && term.trim() !== '' ? term : null);
  }
}
