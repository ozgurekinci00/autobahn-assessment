import { Component, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TableComponent } from '../table/table.component';
import { MatTabsModule } from '@angular/material/tabs';
import { State } from '../../interfaces/CommonInfoFields';

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, TableComponent, MatTabsModule],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss',
})
export class TabComponent implements OnDestroy {
  state!: State;
  subscription: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(public dataService: DataService) {
    this.subscription = this.dataService.state$.subscribe((state) => {
      this.state = state;
    });
  }

  onTabChange(event: any) {
    this.dataService.updateState({
      selectedRow: null,
      selectedTabIndex: event.index,
      center: { lat: 52.1657, lng: 8.4515 },
      zoom: 6,
    });

    this.dataService.setMarkersForTab();

    if (this.paginator) {
      const updatedTabDataSources = this.state.tabDataSources;
      updatedTabDataSources[this.state.selectedTabIndex].paginator =
        this.paginator;
      this.dataService.updateState({
        tabDataSources: updatedTabDataSources,
      });
    }
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }
}
