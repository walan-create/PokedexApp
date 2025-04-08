import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PokemonApp } from '../../../interface/pokemon.interface';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'list-item',
  imports: [TitleCasePipe],
  templateUrl: './list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListItemComponent {
  //recibe como parametro el Pokemon dado por el padre
  pokemonApp = input.required<PokemonApp>();
 }
