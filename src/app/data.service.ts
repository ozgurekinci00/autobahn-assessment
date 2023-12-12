import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { ExtractedInfo } from './interfaces/CommonInfoFields';

@Injectable({
  providedIn: 'root'
})

export class DataService {

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
    infoWindowContent: ''
  };

  private state = new BehaviorSubject(this.initialState);
  public state$ = this.state.asObservable();  // Observable to be subscribed to in components

  constructor() { }

  // updates the state
  updateState(updatedState: any) {
    this.state.next({...this.state.getValue(), ...updatedState});
  }

}