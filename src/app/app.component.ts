import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';

import { Column } from './model';

import { EditService } from './edit.service';
import { map, tap } from 'rxjs/operators';
import { GridComponent } from '@progress/kendo-angular-grid';

@Component({
  selector: 'my-app',
  template: `
        <kendo-grid
            [kendoGridBinding]="view | async"
            [height]="400"
            (dataStateChange)="onStateChange()"
            [rowReorderable]="true"
            [hideHeader]="true"
            (add)="addHandler($event)"
        >
        <ng-template kendoGridToolbarTemplate>
        <button kendoGridAddCommand>Add new</button>
        </ng-template>
        <kendo-grid-rowreorder-column [width]="40"></kendo-grid-rowreorder-column>
            <kendo-grid-column field="name" title="Product Name" [width]="250">
                <ng-template kendoGridCellTemplate let-dataItem let-column="column">
                    <kendo-dropdownlist
                        kendoGridFocusable
                        [data]="names"
                        [formControl]="getFormControl(dataItem, column.field)"
                    ></kendo-dropdownlist>
                </ng-template>
            </kendo-grid-column>
        </kendo-grid>
    `,
  styles: [
    `
            .k-textbox {
                width: 100%;
            }
        `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  public view: Observable<Column[]>;
  public formGroups: FormGroup = new FormGroup({ items: new FormArray([]) });

  public formGroup: FormGroup;
  private isNew: boolean;

  @ViewChild(GridComponent)
  private grid: GridComponent;

  // for demo purposes only - hardcoded first 10 product names for the dropdowns
  public names = ['Yield', 'AUM', 'ResearchEntityName'];

  public getFormControl(dataItem: Column, field: string): FormControl {
    // return the FormControl for the respective column editor
    return <FormControl>(
      (this.formGroups.get('items') as FormArray).controls
        .find((i) => i.value.name === dataItem.name)
        .get(field)
    );
  }

  constructor(private editService: EditService) {}

  public ngOnInit(): void {
    this.view = this.editService.pipe(
      tap((data) => {
        // generate the FormGroups per each Grid row
        if ((this.formGroups.get('items') as FormArray).controls.length === 0) {
          data.forEach((i) => {
            const formGroup = new FormGroup({
              name: new FormControl(i.name),
            });

            (this.formGroups.get('items') as FormArray).push(formGroup);
          });
        }
      }),
      map((data) => data)
    );

    this.editService.read();
  }

  public addHandler({sender}): void {

    

    this.formGroup = new FormGroup({
        'name': new FormControl('tgesgdfgdfgdfg')
      });

      sender.addItem(this.formGroup);

      this.isNew = true;

    //   this.grid.addRow(this.formGroup);

// this.editService.save([{ name: 'AUM' }], true);

    // const formGroup = new FormGroup({
    //     'name': new FormControl('jijiji')
    //   });

// this.editService.next([{ name: 'AUM' }])

    // this.closeEditor();

    // this.formGroup = createFormGroup({
    //   'Discontinued': false,
    //   'ProductName': '',
    //   'UnitPrice': 0,
    //   'UnitsInStock': ''
    // });
    // this.isNew = true;

    // this.grid.addRow(this.formGroup);

   // Here we add a new row and edit it using editRow method https://www.telerik.com/kendo-angular-ui/components/grid/api/GridComponent/#toc-editrow
   
    // this.view.push({});
    // this.grid.editRow(this.view.length - 1, this.formGroup)
    // this.editedRowIndex = this.view.length - 1;
  }

  public onStateChange(): void {
    this.editService.read();
  }
}
