import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule, MapMarker, MapInfoWindow } from '@angular/google-maps';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Observable, Observer, Subscription } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { AsyncPipe } from '@angular/common';
import {
  AllRoadInfos,
  CommonFields,
  ExtractedInfo,
  ExampleTab,
} from '../interfaces/CommonInfoFields';
import { ParserService } from '../parser.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DataService } from '../data.service';

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
  state: any;
  subscription: Subscription;
  displayedColumns: string[] = [
    'title',
    'subtitle',
    'latitude',
    'longitude',
    'isBlocked',
  ];

  // Add ViewChild for the paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;

  constructor(
    private apiService: ApiService,
    private parserService: ParserService,
    public dataService: DataService
  ) {
    this.subscription = this.dataService.state$
      .subscribe(state => {
        this.state = state;
      });
    this.dataService.updateState({
      asyncTabs: new Observable((observer: Observer<ExampleTab[]>) => {
        observer.next([
          { label: 'Construction Sites', content: [] },
          { label: 'Rest Areas', content: [] },
          { label: 'Traffic Reports', content: [] },
          { label: 'Suspensions', content: [] },
          { label: 'Charging Stations', content: [] },
        ]);
      })
    })
  }

  ngOnInit() {
    this.apiService.getAutobahns().subscribe({
      next: (data) => {
        this.dataService.updateState({
          roads: data.roads
        })
      },
      error: (error) => {
        console.error('Error fetching Autobahn data:', error);
      },
    });
    this.onRoadSelectionChange();
  }

  onRoadSelectionChange() {
    this.dataService.updateState({
      selectedRow: null, // Reset selected row when the highway changes
      selectedTabIndex: 0
    });
    // Make API call with the new value of selectedRoad
    this.apiService.getTableData(this.state.selectedRoad).subscribe({
      next: (data: AllRoadInfos) => {
        // Update map values and content values of tabs
        if (data.roadworksData.roadworks.length !== 0) {
          this.dataService.updateState({
            center: {
              lat: Number(data.roadworksData.roadworks[0].coordinate.lat),
              lng: Number(data.roadworksData.roadworks[0].coordinate.long),
            }
          })
        }
        this.dataService.updateState({
          parsedData: this.parserService.parseInfo(data)
        });
        this.setMarkersForTab();
        // Update tab content based on the API response
        this.dataService.updateState({
          asyncTabs: new Observable((observer: Observer<ExampleTab[]>) => {
            observer.next([
              {
                label: 'Construction Sites',
                content: this.state.parsedData.roadworksData,
              },
              { label: 'Rest Areas', content: this.state.parsedData.restAreasData },
              {
                label: 'Traffic Reports',
                content: this.state.parsedData.trafficReportsData,
              },
              { label: 'Suspensions', content: this.state.parsedData.suspensionsData },
              {
                label: 'Charging Stations',
                content: this.state.parsedData.chargingStationsData,
              },
            ]);
          })
        })

        // Initialize or update the MatTableDataSource for each tab
        this.state.asyncTabs.subscribe((tabs: any) => {
          this.dataService.updateState({
            tabDataSources: tabs.map((tab: any) => {
              const dataSource = new MatTableDataSource(tab.content);
              dataSource.paginator =
                this.state.selectedTabIndex === 0 ? this.paginator : null; // Set paginator for each dataSource
              return dataSource;
            })
          })
        });
      },
      error: (error: any) => {
        console.error('Error fetching road data:', error);
      },
    });
  }

  onRowSelected(row: CommonFields) {
    if (this.state.selectedRow !== row) {
      this.dataService.updateState({
        selectedRow: row
      });
      console.log('SELECTED ROW', this.state.selectedRow);
      // Update the center based on the selected row
      this.updateCenterFromSelectedRow();
    } else {
      this.dataService.updateState({
        selectedRow: null,
        center: { lat: 51.1657, lng: 10.4515 },
        zoom: 6
      });
    }
  }

  updateCenterFromSelectedRow() {
    if (this.state.selectedRow) {
      const long = parseFloat(this.state.selectedRow.coordinate.long);
      const lat = parseFloat(this.state.selectedRow.coordinate.lat);
      this.dataService.updateState({
        center: { lat: lat, lng: long },
        zoom: 16
      })
    }
  }

  setMarkersForTab() {
    let markersArray: google.maps.LatLngLiteral[] = [];
    let tab: string = '';
    switch (this.state.selectedTabIndex) {
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

    this.state.parsedData[tab].forEach((item: ExtractedInfo) => {
      markersArray.push({
        lat: parseFloat(item.coordinate.lat),
        lng: parseFloat(item.coordinate.long),
      });
    });

    this.dataService.updateState({
      markerPositions: markersArray
    });
  }

  onTabChange(event: any) {
    this.dataService.updateState({
      selectedRow: null,
      selectedTabIndex: event.index,
      center: { lat: 52.1657, lng: 8.4515 },
      zoom: 6
    });

    this.setMarkersForTab();

    if (this.paginator) {
      const updatedTabDataSources = this.state.tabDataSources;
      updatedTabDataSources[this.state.selectedTabIndex].paginator = this.paginator;
      this.dataService.updateState({
        tabDataSources: updatedTabDataSources
      })
    }
  }

  openInfoWindow(marker: MapMarker) {
    console.log('MARKER', marker);
    this.infoWindow.open(marker);
    this.dataService.updateState({
      infoWindowContent: this.state.selectedRow.description.join(' ')
    })
  }
}
