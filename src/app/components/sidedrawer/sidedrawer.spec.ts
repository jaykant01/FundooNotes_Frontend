import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sidedrawer } from './sidedrawer';

describe('Sidedrawer', () => {
  let component: Sidedrawer;
  let fixture: ComponentFixture<Sidedrawer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidedrawer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sidedrawer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
