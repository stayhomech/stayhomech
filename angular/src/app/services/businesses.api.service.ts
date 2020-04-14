import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Business, BusinessSearch} from '../app.models';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BusinessesApiService {
  constructor(private httpClient: HttpClient) {
  }

  retrieveBusinesses(lang: string, zip: number, city: string): Observable<BusinessSearch> {
    const host = environment.production ? "": "http://localhost:8000";
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });
    return this.httpClient.get(`${host}/content/${lang}/${zip}/${city}/`,
      {headers: headers}).pipe(map((e: BusinessSearch) => e));
  }
}
