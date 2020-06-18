import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Authenticate } from './auth.page';

describe('Authenticate', () => {
  let component: Authenticate;
  let fixture: ComponentFixture<Authenticate>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Authenticate ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Authenticate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
