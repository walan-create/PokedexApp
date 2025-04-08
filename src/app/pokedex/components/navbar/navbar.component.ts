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

  onSearchType(query: string) {
    this.pokedexService.searchPokemons(query)

  }

  load() {
    this.pokedexService.loadTrendingPokemons()
}

  onSearchOne() {
    this.pokedexService.searchPokemonByName().subscribe((response) => {
      //this.searchedPokemon.set(response);
      console.log(response);
    });
  }
}
