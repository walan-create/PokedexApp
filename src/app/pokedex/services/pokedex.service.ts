import { inject, Injectable, signal } from '@angular/core';
import {
  PokeGeneralResponse,
  PokeResponse,
} from '../interface/pokeapi.interfaces';
import { PokemonApp } from '../interface/pokemon.interface';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { PokemonMapper } from '../mapper/pokemon.mapper';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PokedexService {
  private http = inject(HttpClient); //Contiene peticiones para CRUD

  trendingPokemons = signal<PokemonApp[]>([]); //Lista de Pokemons a mostrar
  private pokemonRequests: Observable<any>[] = []; // Lista compartida de peticiones

  loadAllPokemons() {
    this.http
      .get<PokeGeneralResponse>(`https://pokeapi.co/api/v2/pokemon`, {
        params: {
          limit: 20,
        },
      })
      .subscribe((respuesta) => {
        // Llenamos la lista compartida de peticiones
        this.pokemonRequests = respuesta.results.map((pokemon) =>
          this.http.get(pokemon.url)
        );

        // Llamamos al método para procesar las peticiones
        this.processPokemonRequests();
      });
  }

  searchPokemonsByType(query: string) {
    this.http
      .get<PokeResponse>(`https://pokeapi.co/api/v2/type/${query}`, {})
      .subscribe((respuesta) => {
        // Llenamos la lista compartida de peticiones
        this.pokemonRequests = respuesta.pokemon.map((pokemon) =>
          this.http.get(pokemon.pokemon.url)
        );

        // Llamamos al método para procesar las peticiones
        this.processPokemonRequests();
      });
  }

  searchPokemonsByName(query: string) {
    const newRequest = this.http.get(
      `https://pokeapi.co/api/v2/pokemon/${query}`
    );

    // Reasignamos pokemonRequests con el nuevo request
    this.pokemonRequests = [newRequest];

    // Procesamos las peticiones
    this.processPokemonRequests();
  }

  showShinys(){
    
  }
  //-------------------------------------------------------

  private processPokemonRequests() {
    if (this.pokemonRequests.length === 0) {
      console.warn('No hay peticiones en pokemonRequests para procesar.');
      return;
    }

    forkJoin(this.pokemonRequests).subscribe((detailedPokemons) => {
      const pokemonApps =
        PokemonMapper.mapDetailedPokemonsToPokemonAppArray(detailedPokemons);
      this.trendingPokemons.set(pokemonApps);
    });
  }
}
