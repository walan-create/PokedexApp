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

  onSearch(query: string) {
    if (query === null || query ==='') {
      return
    }
    this.pokedexService.searchPokemonsByName(query);
  }
  preventFormSubmit(event: Event) {
    event.preventDefault(); // Previene el comportamiento predeterminado del formulario
  }

  toggleShinyMode(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    console.log("Shiny ",isChecked)
    this.pokedexService.shinyMode.set(isChecked); // Actualiza el estado del checkbox
  }

  toggleLegendaryMode(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    console.log("Legendary ",isChecked)
    this.pokedexService.legendaryMode.set(isChecked); // Actualiza el estado del checkbox
  }
}
