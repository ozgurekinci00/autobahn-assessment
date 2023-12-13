import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';
import { CommonFields, State } from '../../interfaces/CommonInfoFields';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnDestroy {
  state!: State;
  subscription: Subscription;
  displayedColumns: string[] = [
    'title',
    'subtitle',
    'latitude',
    'longitude',
    'isBlocked',
  ];
  @Input() currentTabIndex!: number;

  constructor(public dataService: DataService) {
    this.subscription = this.dataService.state$.subscribe((state) => {
      this.state = state;
    });
  }

  onRowSelected(row: CommonFields) {
    if (this.state.selectedRow !== row) {
      this.dataService.updateState({
        selectedRow: row,
      });
      // Update the center based on the selected row
      this.updateCenterFromSelectedRow();
    } else {
      this.dataService.updateState({
        selectedRow: null,
        center: { lat: 51.1657, lng: 10.4515 },
        zoom: 6,
      });
    }
  }

  updateCenterFromSelectedRow() {
    if (this.state.selectedRow) {
      const long = parseFloat(this.state.selectedRow.coordinate.long);
      const lat = parseFloat(this.state.selectedRow.coordinate.lat);
      this.dataService.updateState({
        center: { lat: lat, lng: long },
        zoom: 16,
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
