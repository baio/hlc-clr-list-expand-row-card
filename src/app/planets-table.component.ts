import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Table, TableDescription, HlcClrTableComponent } from '@ng-holistic/clr-list';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SWAPIService } from './swapi.service';
import { AppModels } from './app.models';

// Provide table UI definition in js object
const definition: Table.Definition = {
  cols: [
    {
      id: 'name',
      title: 'Name',
      sort: true
    },
    {
      id: 'population',
      title: 'Population',
      sort: false
    }
  ],
  details: {
    rows(parent: AppModels.Planet) {
      // The children data must already be expanded, swapi doesn't provide
      // expand functionality, so as a sample here display raw urls under the population column
      // TODO : Add option to return Observable of array to load children rows dynamically.
      return parent.residents.map(residentUrl => ({residentUrl}));
    }
  }
};

@Component({
  selector: 'my-planets-table',
  template: `
    <hlc-clr-table [definition]="definition" [dataProvider]="dataProvider">
        <ng-template hlcClrRowDetail let-detail>
          <a [href]="detail.residentUrl">{{ detail.residentUrl }}</a>
        </ng-template>  
    </hlc-clr-table>
  `,
  styleUrls: ['./palnets-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class TableComponent {
  readonly definition = definition;
  readonly dataProvider: Table.Data.DataProvider;

  constructor(swapi: SWAPIService) {
    this.dataProvider = {
      load(state: any) {
        return swapi.planets(state).pipe(
          tap(console.log),
          catchError(err => {
            return throwError('SWAPI return error');
          })
        );
      }
    };
  }

}
