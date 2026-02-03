import { provideAnimations } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUiDemo } from './shared-ui-demo';

describe('SharedUiDemo', () => {
  let component: SharedUiDemo;
  let fixture: ComponentFixture<SharedUiDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUiDemo],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUiDemo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
