import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Business, BusinessSearch} from '../app.models';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BusinessesApiService {
  constructor(private httpClient: HttpClient) {
  }

  retrieveBusinesses(lang: string, zip: number, city: string): Observable<BusinessSearch> {
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });
    return this.httpClient.get(`https://stayhome.ch/content/${lang}/${zip}/${city}/`,
      {headers: headers}).pipe(map((e: BusinessSearch) => e));
  }
}
