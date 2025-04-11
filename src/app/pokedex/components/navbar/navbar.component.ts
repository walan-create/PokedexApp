import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { PokedexService } from '../../services/pokedex.service';
import { NgClass, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
    imports: [NgClass],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {

  // Lista de tipos de Pokémon
  pokemonTypes = [
    { name: 'water', buttonClass: 'btn-outline-primary', icon: '/assets/type-icons/water.png' },
    { name: 'fire', buttonClass: 'btn-outline-danger', icon: '/assets/type-icons/fire.png' },
    { name: 'flying', buttonClass: 'btn-outline-info', icon: '/assets/type-icons/flying.png' },
    { name: 'electric', buttonClass: 'btn-outline-warning', icon: '/assets/type-icons/electric.png' },
    { name: 'ground', buttonClass: 'btn-outline-dark', icon: '/assets/type-icons/ground.png' },
    { name: 'grass', buttonClass: 'btn-outline-success', icon: '/assets/type-icons/grass.png' },
    { name: 'psychic', buttonClass: 'btn-outline-secondary', icon: '/assets/type-icons/psychic.png' }
  ];


  pokedexService = inject(PokedexService);
  @ViewChild('txtSearch') txtSearch!: ElementRef<HTMLInputElement>; // Referencia al input

  /**
   * Maneja la búsqueda por tipo de Pokémon.
   * @param type - Tipo de Pokémon seleccionado.
   */
  onSearchType(type: string): void {

    this.pokedexService.selectedType.set(type);
    // Limpia el valor del input de búsqueda
    if (this.txtSearch) this.txtSearch.nativeElement.value = '';

    // Llama al servicio para cargar todos los Pokémon o buscar por tipo
    if (type === 'all') {
      this.pokedexService.loadAllPokemons();
    } else {
      this.pokedexService.searchPokemonsByType(type);
    }
  }

  /**
   * Maneja la búsqueda por nombre de Pokémon.
   * @param query - Texto ingresado en el campo de búsqueda.
   */
  onSearch(query: string): void {
    const trimmedQuery = query.trim().toLowerCase(); // Normaliza el texto ingresado

    if (!trimmedQuery) {
      // Si el input está vacío, muestra todos los Pokémon
      this.pokedexService.shownPokemons.set(this.pokedexService.allPokemons());
      return;
    }

    // Filtra los Pokémon por nombre
    const filteredPokemons = this.pokedexService
      .allPokemons()
      .filter((pokemon) => pokemon.name.toLowerCase().includes(trimmedQuery));

    // Actualiza la lista de Pokémon mostrados
    this.pokedexService.shownPokemons.set(filteredPokemons);
  }

  /**
   * Previene el envío del formulario al presionar Enter.
   * @param event - Evento del formulario.
   */
  preventFormSubmit(event: Event): void {
    event.preventDefault();
  }

  /**
   * Activa o desactiva el modo shiny.
   * @param event - Evento del checkbox.
   */
  toggleShinyMode(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.pokedexService.shinyMode.set(isChecked);
  }

  /**
   * Activa o desactiva el modo legendario.
   * @param event - Evento del checkbox.
   */
  toggleLegendaryMode(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.pokedexService.legendaryMode.set(isChecked);
  }
}
