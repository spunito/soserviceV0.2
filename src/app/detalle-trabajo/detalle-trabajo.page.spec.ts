import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleTrabajoPage } from './detalle-trabajo.page';

describe('DetalleTrabajoPage', () => {
  let component: DetalleTrabajoPage;
  let fixture: ComponentFixture<DetalleTrabajoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTrabajoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
