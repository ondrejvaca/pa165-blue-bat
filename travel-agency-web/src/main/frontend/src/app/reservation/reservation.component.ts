import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import { ButtonStateEnum } from "../../models/button-state.enum";
import { InfoboxStateEnum } from 'src/models/infobox-state.enum';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  InfoboxStateEnum = InfoboxStateEnum;
  submitState: ButtonStateEnum = ButtonStateEnum.init;
  created: boolean = false;
  error: any;

  trip: any;
  excursions: number[] = new Array(0);
  price: number = 0;

  constructor(public reservationService: ReservationService) { }

  ngOnInit(): void {
    this.trip = window.history.state.trip;
    this.price = this.trip.price;
  }

  onClick(): void {
    this.submitState = ButtonStateEnum.loading;
    this.reservationService.createReservation({
      tripId: this.trip.id,
      customerId: 1,
      excursionIds: this.excursions
    })
      .subscribe(
        () => {
          this.submitState = ButtonStateEnum.success;
          this.created = true;
        },
        error => {
          this.submitState = ButtonStateEnum.error;
          this.error = error;
          console.log(error);
        }
      );
  }

  setExcursion(event: any, excursion: any) {
    if (event.target.checked) {
      this.excursions.push(excursion.id);
      this.price += excursion.price;
    }
    else {
      const index = this.excursions.indexOf(excursion.id, 0);
      if (index > -1) {
        this.excursions.splice(index, 1);
        this.price -= excursion.price;
      }
    }
  }
}
