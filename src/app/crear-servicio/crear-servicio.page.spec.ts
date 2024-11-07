import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearServicioPage } from './crear-servicio.page';

describe('CrearServicioPage', () => {
  let component: CrearServicioPage;
  let fixture: ComponentFixture<CrearServicioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearServicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
