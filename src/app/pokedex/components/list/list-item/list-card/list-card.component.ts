import { Component, inject, input, signal } from '@angular/core';
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
  showStats= signal<boolean>(false);

  get shinyModeOn() {
    return this.pokedexService.shinyMode(); // Accede al estado del servicio
  }

  toggleStats(): void {
    this.showStats.update(value => !value);
  }

}
