import { ChangeDetectionStrategy, Component, input, Input } from '@angular/core'; // Corregido: Input en mayúsculas
import { ListItemComponent } from "./list-item/list-item.component";
import { PokemonApp } from '../../interface/pokemon.interface';

@Component({
  selector: 'list',
  imports: [ListItemComponent],
  templateUrl: './list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent {

  //Recibe como parametro la lista dada por el padre
  pokemonsApp = input.required<PokemonApp[]>();

}
