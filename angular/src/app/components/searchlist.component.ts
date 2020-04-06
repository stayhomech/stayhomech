import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AppStore} from '../app.store';
import {Observable} from 'rxjs';
import {Business} from '../app.models';

@Component({
  selector: 'searchlist',
  templateUrl: './searchlist.component.html',
  styleUrls: ['./searchlist.component.scss']
})
export class SearchlistComponent {
  businesses: Observable<Business[]>;
  constructor(private translate: TranslateService, private store: AppStore) {
    translate.setDefaultLang('en');
    this.businesses = store.businesses$;
  }

  reduce(strings: string[], separator) {
    return strings.reduce((a,b) => !!a?`${a} ${separator} ${b}`:b, '');
  }
}
