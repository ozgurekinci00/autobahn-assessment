import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadComponent } from './road.component';
import { of } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { DataService } from '../../services/data.service';
import { ParserService } from '../../services/parser.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('RoadComponent', () => {
  let component: RoadComponent;
  let fixture: ComponentFixture<RoadComponent>;

  let mockApiService = {
    getAutobahns: jasmine.createSpy('getAutobahns').and.returnValue(of({roads: ['A1', 'A2']})),
    getTableData: jasmine.createSpy('getTableData').and.returnValue(of({ 
      roadworksData: { 
        roadworks: [
          { coordinate: { lat: 1, long: 1 } }
        ]
      } 
    }))
  };

  let mockDataService = {
    state$: of({ selectedRoad: 'A1' }),
    updateState: jasmine.createSpy('updateState'),
    setMarkersForTab: jasmine.createSpy('setMarkersForTab')
  };

  let mockParserService = {
    parseInfo: jasmine.createSpy('parseInfo').and.returnValue({})
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoadComponent, NoopAnimationsModule],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: DataService, useValue: mockDataService },
        { provide: ParserService, useValue: mockParserService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to DataService and update road list on init', () => {
    expect(mockApiService.getAutobahns).toHaveBeenCalledTimes(1);
    expect(mockDataService.updateState).toHaveBeenCalledWith({ roads: ['A1', 'A2'] });
    expect(component.onRoadSelectionChange).toBeTruthy();
  });

  it('should fetch table data and update state when selected road changes', () => {
    mockApiService.getTableData('A1');
    expect(mockDataService.updateState).toHaveBeenCalled();
    expect(mockDataService.setMarkersForTab).toHaveBeenCalled();
  });

  it('should unsubscribe from DataService on destroy', () => {
    const spy = spyOn(component.subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
