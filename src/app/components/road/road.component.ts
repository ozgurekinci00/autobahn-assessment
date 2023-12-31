import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Observer, Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';
import {
  RawRoadData,
  ExampleTab,
  State,
} from '../../interfaces/CommonInfoFields';
import { ApiService } from '../../services/api.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ParserService } from '../../services/parser.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-road',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './road.component.html',
  styleUrl: './road.component.scss',
})
export class RoadComponent implements OnInit, OnDestroy {
  state!: State;
  subscription: Subscription;

  constructor(
    private apiService: ApiService,
    private parserService: ParserService,
    public dataService: DataService
  ) {
    this.subscription = this.dataService.state$.subscribe((state) => {
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
      }),
    });
  }

  ngOnInit() {
    // Fetch all roads on init
    this.apiService.getAutobahns().subscribe({
      next: (data) => {
        this.dataService.updateState({
          roads: data.roads,
        });
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
      selectedTabIndex: 0,
    });
    // Make API call with the new value of selectedRoad
    this.apiService.getTableData(this.state.selectedRoad).subscribe({
      next: (data: RawRoadData) => {
        // Update map values and content values of tabs
        if (data.roadworksData.roadworks.length !== 0) {
          this.dataService.updateState({
            center: {
              lat: Number(data.roadworksData.roadworks[0].coordinate.lat),
              lng: Number(data.roadworksData.roadworks[0].coordinate.long),
            },
          });
        }
        this.dataService.updateState({
          parsedData: this.parserService.parseInfo(data),
        });
        this.dataService.setMarkersForTab();
        // Update tab content based on the API response
        this.dataService.updateState({
          asyncTabs: new Observable((observer: Observer<ExampleTab[]>) => {
            observer.next([
              {
                label: 'Construction Sites',
                content: this.state.parsedData.roadworksData,
              },
              {
                label: 'Rest Areas',
                content: this.state.parsedData.restAreasData,
              },
              {
                label: 'Charging Stations',
                content: this.state.parsedData.chargingStationsData,
              },
              {
                label: 'Suspensions',
                content: this.state.parsedData.suspensionsData,
              },
              {
                label: 'Traffic Reports',
                content: this.state.parsedData.trafficReportsData,
              },
            ]);
          }),
        });

        // Initialize or update the MatTableDataSource for each tab
        this.state.asyncTabs.subscribe((tabs: ExampleTab[]) => {
          this.dataService.updateState({
            tabDataSources: tabs.map((tab: ExampleTab) => {
              const dataSource = new MatTableDataSource(tab.content);
              dataSource.paginator =
                this.state.selectedTabIndex === 0 ? this.state.paginator : null; // Set paginator for each dataSource
              return dataSource;
            }),
          });
        });
      },
      error: (error: any) => {
        console.error('Error fetching road data:', error);
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
