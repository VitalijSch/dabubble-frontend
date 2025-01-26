import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelUpdateComponent } from './channel-update.component';

describe('ChannelUpdateComponent', () => {
  let component: ChannelUpdateComponent;
  let fixture: ComponentFixture<ChannelUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChannelUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
