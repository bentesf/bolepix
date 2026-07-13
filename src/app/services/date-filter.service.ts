import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateFilterService {
  dataInicio: string = '';
  dataFim: string = '';
}
