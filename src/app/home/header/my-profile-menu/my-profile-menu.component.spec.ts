import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileMenuComponent } from './my-profile-menu.component';

describe('MyProfileMenuComponent', () => {
  let component: MyProfileMenuComponent;
  let fixture: ComponentFixture<MyProfileMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyProfileMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyProfileMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
