import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Column } from './model';
import { FormGroup } from '@angular/forms';

const CREATE_ACTION = 'create';
const UPDATE_ACTION = 'update';
const REMOVE_ACTION = 'destroy';

@Injectable()
export class EditService extends BehaviorSubject<Column[]> {
  constructor(private http: HttpClient) {
    super([]);
  }

  private data: Column[] = [];

  public read(): void {
    if (this.data.length) {
      return super.next(this.data);
    }

    this.fetch()
      .pipe(tap((data) => (this.data = data)))
      .subscribe((data) => {
        super.next(data);
      });
  }

  public save(data: Column[], isNew?: boolean): void {
    const action = isNew ? CREATE_ACTION : UPDATE_ACTION;

    this.reset();

    this.fetch(action, data).subscribe(
      () => this.read(),
      () => this.read()
    );
  }

  public remove(data: Column[]): void {
    this.reset();

    this.fetch(REMOVE_ACTION, data).subscribe(
      () => this.read(),
      () => this.read()
    );
  }

  public resetItem(dataItem: Column): void {
    if (!dataItem) {
      return;
    }

    // find orignal data item
    const originalDataItem = this.data.find(
      (item) => item.name === dataItem.name
    );

    // revert changes
    Object.assign(originalDataItem, dataItem);

    super.next(this.data);
  }

  private reset() {
    this.data = [];
  }

  private fetch(action = '', data?: Column[]): Observable<Column[]> {
    return of([
      {
        name: 'Yield',
      },
    ]);
    // return this.http
    //     .jsonp(`https://demos.telerik.com/kendo-ui/service/Products/${action}?callback=JSONP_CALLBACK${this.serializeModels(data)}`, '')
    //     .pipe(map(res => <Product[]>res));
  }
}
