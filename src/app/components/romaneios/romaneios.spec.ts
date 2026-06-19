import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Romaneios } from './romaneios';

describe('Romaneios', () => {
  let component: Romaneios;
  let fixture: ComponentFixture<Romaneios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Romaneios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Romaneios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
