import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
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

  @ViewChild('txtSearch') txtSearch!: ElementRef<HTMLInputElement>; // Referencia al input

  onSearchType(query: string) {
    // Limpia el valor del input
    if (this.txtSearch) this.txtSearch.nativeElement.value = '';
    
    if (query === 'all') {
      this.pokedexService.loadAllPokemons();
    } else {
      this.pokedexService.searchPokemonsByType(query);
    }
  }

  onSearch(query: string) {
    // Convertimos el query a minúsculas y eliminamos espacios en blanco
    const trimmedQuery = query.trim().toLowerCase();

    if (!trimmedQuery) {
      // Si el input está vacío, mostramos todos los Pokémon
      this.pokedexService.trendingPokemons.set(
        this.pokedexService.allPokemons()
      );
      return;
    }

    // Filtramos los Pokémon que coincidan con el query
    const filteredPokemons = this.pokedexService
      .allPokemons()
      .filter((pokemon) => pokemon.name.toLowerCase().includes(trimmedQuery));

    // Actualizamos la lista de Pokémon mostrados con los resultados filtrados
    this.pokedexService.trendingPokemons.set(filteredPokemons);
  }

  preventFormSubmit(event: Event) {
    event.preventDefault(); // Previene el comportamiento predeterminado del formulario
  }

  toggleShinyMode(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    console.log('ShinyMode: ', isChecked);
    this.pokedexService.shinyMode.set(isChecked); // Actualiza el estado del checkbox
  }

  toggleLegendaryMode(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    console.log('LegendaryMode: ', isChecked);
    this.pokedexService.legendaryMode.set(isChecked); // Actualiza el estado del checkbox
  }
}
