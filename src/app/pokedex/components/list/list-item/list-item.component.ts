import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PokemonApp } from '../../../interface/pokemon.interface';
import { ListCardComponent } from './list-card/list-card.component';

@Component({
  selector: 'list-item',
  imports: [ListCardComponent],
  templateUrl: './list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListItemComponent {
  //recibe como parametro el Pokemon dado por el padre
  pokemonApp = input.required<PokemonApp>();
  shinyModeOn = input.required<boolean>();
  legendaryModeOn = input.required<boolean>();

 }
