import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Business} from './app.models';

@Injectable({
  providedIn: 'root',
})
export class AppStore {

  private readonly _title = new BehaviorSubject<string>('stayhome');
  private readonly _businesses = new BehaviorSubject<Business[]>([]);

  readonly title$ = this._title.asObservable();
  readonly businesses$ = this._businesses.asObservable();

  get title(): string {
    return this._title.getValue();
  }

  set title(val: string) {
    this._title.next(val);
  }

  get businesses(): Business[] {
    return this._businesses.getValue();
  }

  set businesses(val: Business[]) {
    this._businesses.next(val);
  }

}
