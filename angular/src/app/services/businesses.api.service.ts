import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Business} from '../app.models';

@Injectable({
  providedIn: 'root',
})
export class BusinessesApiService {
  constructor() {
  }

  retrieveBusinesses(zip: number): Observable<Business[]> {
    // TODO: call here the businesses API
    return new BehaviorSubject<Business[]>(this.BUSINESSES_EXAMPLE).asObservable();
  }

  BUSINESSES_EXAMPLE: Business[] = [
    {
      pk: 2,
      name: "Citrus by Kunz",
      description: "Wir vertreiben handbemalte Pflanzentöpfe aus Terracotta in diversen Grössen, Muster und Farben. Mit unserer DIY Box können sie ihrer Kreativität freien Lauf lassen und ihren Pflanzentopf selber bemalen.",
      location: "8003 Zürich",
      website: "https://www.citrusbykunz.ch/",
      phone: "",
      email: "",
      categories: ['Store', 'Food'],
      cantons: ["BE", "SO"],
      districts: [],
      municipalities: [],
      npas: [],
      category: "Store / Food",
    },
    {
      pk: 3,
      name: "Numisantique GmbH",
      description: "Numisantique ist auf den Handel mit Münzen, Medaillen, Banknoten und Edelmetallen – auch Altgold und \u002Dsilber – spezialisiert.",
      location: "3011 Bern",
      website: "http://www.numisantique.com",
      phone: "",
      email: "",
      categories: ['Resturant', 'Store'],
      cantons: ["BE", "SO"],
      districts: [],
      municipalities: [],
      npas: [],
      category: "Store / Coffee",
    }];
}
