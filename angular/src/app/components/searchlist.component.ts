import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AppStore} from '../app.store';
import {Observable} from 'rxjs';
import {Business, BusinessSearch} from '../app.models';

@Component({
  selector: 'searchlist',
  templateUrl: './searchlist.component.html',
  styleUrls: ['./searchlist.component.scss']
})
export class SearchlistComponent {
  businessSearch: Observable<BusinessSearch>;
  constructor(private translate: TranslateService, private store: AppStore) {
    translate.setDefaultLang('en');
    this.businessSearch = store.businessSearch$;
  }

  reduce(strings: any[], separator) {
    return strings.reduce((a,b) => !!a?`${a} ${separator} ${b}`:b, '');
  }
}
