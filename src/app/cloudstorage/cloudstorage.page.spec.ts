import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CloudstoragePage } from './cloudstorage.page';

describe('CloudstoragePage', () => {
  let component: CloudstoragePage;
  let fixture: ComponentFixture<CloudstoragePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudstoragePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
