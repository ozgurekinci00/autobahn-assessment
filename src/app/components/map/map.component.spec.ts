import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapComponent } from './map.component';
import { DataService } from '../../services/data.service';
import { GoogleMapsModule } from '@angular/google-maps';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { MapMarker } from '@angular/google-maps';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;
  let mockDataService = {
    state$: of({ selectedRow: { description: ['description'] } }),
    updateState: jasmine.createSpy('updateState')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoogleMapsModule, MapComponent],
      providers: [{ provide: DataService, useValue: mockDataService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.subscription?.unsubscribe();
    fixture.destroy();
  });

  class MockInfoWindow {
    open() {}
    close() {}
    get() {}
    setOptions() {}
  }

  // Mock google object
  (window as any).google = {
    maps: {
      Map: function() {
        return {
          setTilt: function() {},
          mapTypeId: ''
        };
      },
      LatLng: function() {},
      event: {
        addListener: function() {}
      },
      ControlPosition: {
        RIGHT_CENTER: '',
        LEFT_CENTER: '',
        LEFT_TOP: ''
      },
      Data: class {},
      Marker: class {},
      InfoWindow: MockInfoWindow,
      MapTypeId: {
        ROADMAP: '',
        SATELLITE: '',
        HYBRID: '',
        TERRAIN: ''
      },
      MarkerClusterer: class {
        addMarkers() {}
        removeMarkers() {}
        clearMarkers() {}
        getMarkers() {}
        setMaxZoom() {}
        setGridSize() {}
        setStyles() {}
      },
    }
  };

  (window as any).MarkerClusterer = class {
    addMarkers() {}
    removeMarkers() {}
    clearMarkers() {}
    getMarkers() {}
    setMaxZoom() {}
    setGridSize() {}
    setStyles() {}
    setMap() {}
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to DataService and update state upon creation', () => {
    expect(component.state.selectedRow.description[0]).toEqual('description');
  });

  it('should update the state when openInfoWindow is called', () => {
    let marker!: MapMarker;
    component.openInfoWindow(marker);
    expect(mockDataService!.updateState).toHaveBeenCalledWith({
      infoWindowContent: component.state.selectedRow.description.join(' '),
    });
  });
});
