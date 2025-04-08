import { Component, inject, signal } from '@angular/core';
import { PokemonApp } from '../../interface/pokemon.interface';
import { PokedexService } from '../../services/pokedex.service';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {

  pokedexService = inject(PokedexService);
  pokemonsApp = signal<PokemonApp[]>([]); //Gifs a mostrar
  showOnlyShiny = signal(false); // Controla si se muestran solo los shiny

  onSearchType(query: string) {
    if (query === 'all') {
      this.pokedexService.loadAllPokemons();
    } else {
      this.pokedexService.searchPokemonsByType(query);
    }
  }

  onSearchOne(query: string){
    this.pokedexService.searchPokemonsByName(query);
  }

  onToggleShiny(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.showOnlyShiny.set(isChecked); // Actualiza el estado del interruptor
  }
}
