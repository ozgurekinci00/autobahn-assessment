import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule, MapMarker, MapInfoWindow } from '@angular/google-maps';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { AsyncPipe } from '@angular/common';
import {
  AllRoadInfos,
  CommonFields,
  ExtractedInfo,
  AllRoadExtractedInfos,
  ExampleTab,
} from '../interfaces/CommonInfoFields';
import { ParserService } from '../parser.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    GoogleMapsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatTabsModule,
    AsyncPipe,
    MatTableModule,
    MatPaginatorModule,
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent implements OnInit {
  panelOpenState = false;
  roads = [];
  selectedRoad: string = 'A1';
  center: google.maps.LatLngLiteral = { lat: 52.1657, lng: 8.4515 };
  zoom = 6;
  markerPositions: google.maps.LatLngLiteral[] = [];
  markerClustererImagePath =
    'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m';
  asyncTabs: Observable<ExampleTab[]>;
  currentContent = [];
  displayedColumns: string[] = [
    'title',
    'subtitle',
    'latitude',
    'longitude',
    'isBlocked',
  ];
  selectedRow: any = null;
  selectedTabIndex: number = 0;
  parsedData: AllRoadExtractedInfos = {
    roadworksData: [],
    restAreasData: [],
    trafficReportsData: [],
    suspensionsData: [],
    chargingStationsData: [],
  };
  infoWindowContent: string = '';

  // Add ViewChild for the paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;

  // Create a new MatTableDataSource array for each tab
  tabDataSources: MatTableDataSource<ExtractedInfo>[] = [];

  constructor(
    private apiService: ApiService,
    private parserService: ParserService
  ) {
    this.asyncTabs = new Observable((observer: Observer<ExampleTab[]>) => {
      observer.next([
        { label: 'Construction Sites', content: [] },
        { label: 'Rest Areas', content: [] },
        { label: 'Traffic Reports', content: [] },
        { label: 'Suspensions', content: [] },
        { label: 'Charging Stations', content: [] },
      ]);
    });
  }

  ngOnInit() {
    this.apiService.getAutobahns().subscribe({
      next: (data) => {
        this.roads = data.roads;
      },
      error: (error) => {
        console.error('Error fetching Autobahn data:', error);
      },
    });
    this.onRoadSelectionChange();
  }

  onRoadSelectionChange() {
    this.selectedRow = null; // Reset selected row when the highway changes
    this.selectedTabIndex = 0;
    // Make API call with the new value of selectedRoad
    this.apiService.getTableData(this.selectedRoad).subscribe({
      next: (data: AllRoadInfos) => {
        // Update map values and content values of tabs
        if (data.roadworksData.roadworks.length !== 0) {
          this.center = {
            lat: Number(data.roadworksData.roadworks[0].coordinate.lat),
            lng: Number(data.roadworksData.roadworks[0].coordinate.long),
          };
        }
        this.parsedData = this.parserService.parseInfo(data);
        this.setMarkersForTab();
        // Update tab content based on the API response
        this.asyncTabs = new Observable((observer: Observer<ExampleTab[]>) => {
          observer.next([
            {
              label: 'Construction Sites',
              content: this.parsedData.roadworksData,
            },
            { label: 'Rest Areas', content: this.parsedData.restAreasData },
            {
              label: 'Traffic Reports',
              content: this.parsedData.trafficReportsData,
            },
            { label: 'Suspensions', content: this.parsedData.suspensionsData },
            {
              label: 'Charging Stations',
              content: this.parsedData.chargingStationsData,
            },
          ]);
        });

        // Initialize or update the MatTableDataSource for each tab
        this.asyncTabs.subscribe((tabs) => {
          this.tabDataSources = tabs.map((tab) => {
            const dataSource = new MatTableDataSource(tab.content);
            dataSource.paginator =
              this.selectedTabIndex === 0 ? this.paginator : null; // Set paginator for each dataSource
            return dataSource;
          });
        });
      },
      error: (error: any) => {
        console.error('Error fetching road data:', error);
      },
    });
  }

  onRowSelected(row: CommonFields) {
    if (this.selectedRow !== row) {
      this.selectedRow = row;
      console.log('SELECTED ROW', this.selectedRow);
      // Update the center based on the selected row
      this.updateCenterFromSelectedRow();
    } else {
      this.selectedRow = null;
      this.center = { lat: 51.1657, lng: 10.4515 };
      this.zoom = 6;
    }
  }

  updateCenterFromSelectedRow() {
    if (this.selectedRow) {
      const long = parseFloat(this.selectedRow.coordinate.long);
      const lat = parseFloat(this.selectedRow.coordinate.lat);
      this.center = { lat: lat, lng: long };
      this.zoom = 16;
    }
  }

  setMarkersForTab() {
    let markersArray: google.maps.LatLngLiteral[] = [];
    let tab: string = '';
    switch (this.selectedTabIndex) {
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

    this.parsedData[tab].forEach((item: ExtractedInfo) => {
      markersArray.push({
        lat: parseFloat(item.coordinate.lat),
        lng: parseFloat(item.coordinate.long),
      });
    });

    this.markerPositions = markersArray;
  }

  onTabChange(event: any) {
    this.selectedRow = null;
    this.selectedTabIndex = event.index;
    this.center = { lat: 52.1657, lng: 8.4515 };
    this.zoom = 6;
    this.setMarkersForTab();

    if (this.paginator) {
      this.tabDataSources[this.selectedTabIndex].paginator = this.paginator;
    }
  }

  openInfoWindow(marker: MapMarker) {
    console.log('MARKER', marker);
    this.infoWindow.open(marker);
    this.infoWindowContent = this.selectedRow.description.join(' ');
  }
}
