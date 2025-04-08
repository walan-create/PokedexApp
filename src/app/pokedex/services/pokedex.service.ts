import { inject, Injectable, signal } from '@angular/core';
import { PokeResponse } from '../interface/pokeapi.interfaces';
import { PokemonApp } from '../interface/pokemon.interface';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { PokemonMapper } from '../mapper/pokemon.mapper';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PokedexService {

  private http = inject(HttpClient); //Contiene peticiones para CRUD

  trendingPokemons = signal<PokemonApp[]>([]);

  //Metodo que hace una petición HTTP ALL de los pokemons y los asigna a trendingPokemon
  loadTrendingPokemons() {
    //Especificamos ruta a hacer la petición
    this.http
      .get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon`, {
        params: {
          limit: 20,
        },
      })
      .subscribe((respuesta) => {
        const pokemonList = respuesta.pokemon;

        const pokemonRequests = pokemonList.map((pokemon) =>
          this.http.get(pokemon.pokemon.url) // Petición para obtener detalles de cada Pokémon
        );

        forkJoin(pokemonRequests).subscribe((detailedPokemons) => {
          // Mapeamos ss
          const pokemonApps = PokemonMapper.mapDetailedPokemonsToPokemonAppArray(detailedPokemons);
          this.trendingPokemons.set(pokemonApps);
        });
      });
  }

  searchPokemonByName(): Observable<PokemonApp>{
    return this.http.get<PokemonApp>(`https://pokeapi.co/api/v2/pokemon/pikachu`)
  }

  searchPokemons(query: string) {
    //Especificamos ruta a hacer la petición
    this.http
      .get<PokeResponse>(`https://pokeapi.co/api/v2/type/${query}`, {
        params: {
          limit: 20,
        },
      })
      .subscribe((respuesta) => {
        const pokemonList = respuesta.pokemon;

        const pokemonRequests = pokemonList.map((pokemon) =>
          this.http.get(pokemon.pokemon.url) // Petición para obtener detalles de cada Pokémon
        );

        forkJoin(pokemonRequests).subscribe((detailedPokemons) => {
          // Mapeamos ss
          const pokemonApps = PokemonMapper.mapDetailedPokemonsToPokemonAppArray(detailedPokemons);
          this.trendingPokemons.set(pokemonApps);
        });
      });
  }
}
