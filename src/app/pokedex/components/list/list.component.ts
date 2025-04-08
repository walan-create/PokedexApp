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

  // Inyecta el estado del interruptor desde el NavbarComponent
  navbarComponent = inject(NavbarComponent);
  showOnlyShiny = this.navbarComponent.showOnlyShiny;

  // Computa la lista de Pokémon a mostrar según el estado del interruptor
  filteredPokemons = computed(() =>
    this.showOnlyShiny()
      ? this.pokemonsApp().filter((pokemon) => pokemon.isShiny)
      : this.pokemonsApp()
  );
}
