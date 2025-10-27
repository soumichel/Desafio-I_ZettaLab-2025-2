import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Educativo } from './educativo';

describe('Educativo', () => {
  let component: Educativo;
  let fixture: ComponentFixture<Educativo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Educativo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Educativo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
