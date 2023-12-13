import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DataService } from '../../services/data.service';
import { TableComponent } from './table.component';

class DataServiceStub {
  state$ = of({
    tabDataSources: [],
    selectedRow: null,
  });

  updateState(newState: any) {
    this.state$ = of(newState);
  }
}

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let mockDataService: DataService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent],
      providers: [{ provide: DataService, useClass: DataServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    mockDataService = TestBed.get(DataService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should unsubscribe from DataService on destroy', () => {
    const spy = spyOn(component.subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it('should update state when a row is selected', () => {
    const row: any = {
      coordinate: {
        lat: '52',
        long: '13.5',
      },
      isBlocked: true,
      subtitle: 'Subtitle',
      title: 'Title',
    };
    const spy = spyOn(mockDataService, 'updateState').and.callThrough();
    component.onRowSelected(row);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should update center state from selected row', () => {
    component.state.selectedRow = {
      coordinate: {
        lat: '52',
        long: '13.5',
      },
      isBlocked: true,
      subtitle: 'Subtitle',
      title: 'Title',
    };
    const expectedStateAfterUpdateCenter = {
      center: { lat: 52, lng: 13.5 },
      zoom: 16,
    };
    const spy = spyOn(mockDataService, 'updateState').and.callThrough();
    component.updateCenterFromSelectedRow();
    expect(spy).toHaveBeenCalledWith(expectedStateAfterUpdateCenter);
  });
});
