import { Injectable, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ExtractedInfo, State } from '../interfaces/CommonInfoFields';
import { MatPaginator } from '@angular/material/paginator';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private initialState = {
    roads: [],
    selectedRoad: 'A1',
    tabsData: {
      constructionSites: { roadworks: [] },
      trafficReports: { warning: [] },
      restAreas: { parking_lorry: [] },
      suspensions: { closure: [] },
      chargingStations: { electric_charging_station: [] },
    },
    selectedTabIndex: 0,
    selectedRow: null,
    markerPositions: [],
    markerClustererImagePath:
      'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
    center: { lat: 52.1657, lng: 8.4515 },
    zoom: 6,
    parsedData: {
      roadworksData: [],
      restAreasData: [],
      trafficReportsData: [],
      suspensionsData: [],
      chargingStationsData: [],
    },
    asyncTabs: null,
    tabDataSources: [],
    infoWindowContent: '',
    paginator: this.paginator,
  };

  private state = new BehaviorSubject(this.initialState);
  public state$ = this.state.asObservable(); // Observable to be subscribed to in components

  constructor() {}

  // updates the state
  updateState(updatedState: any) {
    this.state.next({ ...this.state.getValue(), ...updatedState });
  }

  setMarkersForTab() {
    let markersArray: google.maps.LatLngLiteral[] = [];
    let tab: string = '';
    const currentState: State = this.state.getValue();
    switch (currentState.selectedTabIndex) {
      case 0:
        tab = 'roadworksData';
        break;
      case 1:
        tab = 'restAreasData';
        break;
      case 2:
        tab = 'trafficReportsData';
        break;
      case 3:
        tab = 'suspensionsData';
        break;
      case 4:
        tab = 'chargingStationsData';
        break;
    }

    currentState.parsedData[tab].forEach((item: ExtractedInfo) => {
      markersArray.push({
        lat: parseFloat(item.coordinate.lat),
        lng: parseFloat(item.coordinate.long),
      });
    });

    this.updateState({
      markerPositions: markersArray,
    });
  }
}
