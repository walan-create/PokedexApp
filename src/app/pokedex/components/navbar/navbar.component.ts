import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
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
  selectedType: string = ''; // Tipo seleccionado por defecto
  @ViewChild('txtSearch') txtSearch!: ElementRef<HTMLInputElement>; // Referencia al input

  onSearchType(type: string) {
    this.selectedType = type; // Actualiza el tipo seleccionado

    // Limpia el valor del input
    if (this.txtSearch) this.txtSearch.nativeElement.value = '';

    if (type === 'all') {
      this.pokedexService.loadAllPokemons();
    } else {
      this.pokedexService.searchPokemonsByType(type);
    }
  }

  onSearch(query: string) {
    // Convertimos el query a minúsculas y eliminamos espacios en blanco
    const trimmedQuery = query.trim().toLowerCase();

    if (!trimmedQuery) {
      // Si el input está vacío, mostramos todos los Pokémon
      this.pokedexService.shownPokemons.set(this.pokedexService.allPokemons());
      return;
    }

    // Filtramos los Pokémon que coincidan con el query
    const filteredPokemons = this.pokedexService
      .allPokemons()
      .filter((pokemon) => pokemon.name.toLowerCase().includes(trimmedQuery));

    // Actualizamos la lista de Pokémon mostrados con los resultados filtrados
    this.pokedexService.shownPokemons.set(filteredPokemons);
  }

  preventFormSubmit(event: Event) {
    event.preventDefault(); // Previene el comportamiento predeterminado del formulario
  }

  toggleShinyMode(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.pokedexService.shinyMode.set(isChecked); // Actualiza el estado del checkbox
  }

  toggleLegendaryMode(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.pokedexService.legendaryMode.set(isChecked); // Actualiza el estado del checkbox
  }
}
