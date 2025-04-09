import { Component, inject, input } from '@angular/core';
import { PokemonApp } from '../../../../interface/pokemon.interface';
import { TitleCasePipe } from '@angular/common';
import { PokedexService } from '../../../../services/pokedex.service';

@Component({
  selector: 'list-card',
  imports: [
    TitleCasePipe
  ],
  templateUrl: './list-card.component.html',
  styleUrl: './list-card.component.css'
})
export class ListCardComponent {
  pokedexService = inject(PokedexService);
  pokemon = input.required<PokemonApp>();

  get shinyModeOn() {
    return this.pokedexService.shinyMode(); // Accede al estado del servicio
  }

}
