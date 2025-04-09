import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  Input,
} from '@angular/core'; // Corregido: Input en mayúsculas
import { ListItemComponent } from './list-item/list-item.component';
import { PokemonApp } from '../../interface/pokemon.interface';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'list',
  imports: [ListItemComponent],
  templateUrl: './list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent {

  //Recibe como parametro la lista dada por el padre
  pokemonsApp = input.required<PokemonApp[]>();
  shinyMode = input.required<boolean>();
  legendaryMode = input.required<boolean>();

}
