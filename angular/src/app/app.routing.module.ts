import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SearchlistComponent} from './components/searchlist.component';

const routes: Routes = [
  {path: '', redirectTo: '/', pathMatch: 'full'},
  {path: '**', component: SearchlistComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      { scrollPositionRestoration: 'enabled' } // scroll to top always
      // {enableTracing: true} // <-- debugging purposes only
    )],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
