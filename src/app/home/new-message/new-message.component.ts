import { Component } from '@angular/core';
import { CreateMessageComponent } from "../create-message/create-message.component";

@Component({
  selector: 'app-new-message',
  standalone: true,
  imports: [CreateMessageComponent],
  templateUrl: './new-message.component.html',
  styleUrl: './new-message.component.scss'
})
export class NewMessageComponent {

}
