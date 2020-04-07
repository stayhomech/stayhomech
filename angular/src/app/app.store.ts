import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Business, BusinessSearch, Canton, Category, District, Municipality, Npa} from './app.models';

@Injectable({
  providedIn: 'root',
})
export class AppStore {

  private readonly _title = new BehaviorSubject<string>('stayhome');
  private readonly _businessSearch = new BehaviorSubject<BusinessSearch>({
    npa: null,
    municipality: null,
    district: null,
    canton: null,
    businesses: [],
    categories: [],
    parent_categories: []
  });

  readonly businessSearch$ = this._businessSearch.asObservable();

  get businessSearch(): BusinessSearch {
    return this._businessSearch.getValue();
  }

  set businessSearch(val: BusinessSearch) {
    this._businessSearch.next(val);
  }

}
