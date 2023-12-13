import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BehaviorSubject } from 'rxjs';

import { DataService } from '../../services/data.service';

import { TabComponent } from './tab.component';

class DataServiceStub {
  state$ = new BehaviorSubject({
    tabDataSources: [],
    selectedTabIndex: 0,
    paginator: null
  });

  updateState(data: any) {
    this.state$.next({
      ...this.state$.getValue(),
      ...data,
    });
  }

  setMarkersForTab() {}
}

describe('TabComponent', () => {
  let component: TabComponent;
  let fixture: ComponentFixture<TabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NoopAnimationsModule, MatPaginatorModule, MatTabsModule, TabComponent],
      providers: [{ provide: DataService, useClass: DataServiceStub }]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should unsubscribe on destroy', () => {
    fixture.detectChanges();

    spyOn(component.subscription, 'unsubscribe');

    component.ngOnDestroy();
    
    expect(component.subscription.unsubscribe).toHaveBeenCalled();
  });

  it('should update state when tab changes', () => {
    fixture.detectChanges();

    spyOn(component.dataService, 'updateState');

    const tabGroup = fixture.debugElement.query(By.css('mat-tab-group'));
    tabGroup.triggerEventHandler('selectedTabChange', { index: 1 });

    expect(component.dataService.updateState).toHaveBeenCalled();
  });

  it('should set markers for tab when tab changes', () => {
    fixture.detectChanges();

    spyOn(component.dataService, 'setMarkersForTab');

    const tabGroup = fixture.debugElement.query(By.css('mat-tab-group'));
    tabGroup.triggerEventHandler('selectedTabChange', { index: 1 });

    expect(component.dataService.setMarkersForTab).toHaveBeenCalled();
  });
});
