import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {BusinessesApiService} from './services/businesses.api.service';
import {take} from 'rxjs/operators';
import {AppStore} from './app.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'stayhome';
  constructor(private translate: TranslateService, private businessesService: BusinessesApiService, private store: AppStore) {
    translate.setDefaultLang('en');
    businessesService.retrieveBusinesses("en", 3253, "Schnottwil")
      .pipe(take(1))
      .subscribe(businessSearch => store.businessSearch = businessSearch);
  }
}
