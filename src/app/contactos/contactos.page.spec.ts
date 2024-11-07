import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactosPage } from './contactos.page';

describe('ContactosPage', () => {
  let component: ContactosPage;
  let fixture: ComponentFixture<ContactosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
