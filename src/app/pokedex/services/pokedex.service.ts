import { inject, Injectable, signal } from '@angular/core';
import {
  PokeGeneralResponse,
  PokeResponse,
} from '../interface/pokeapi.interfaces';
import { PokemonApp } from '../interface/pokemon.interface';
import {
  catchError,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { PokemonMapper } from '../mapper/pokemon.mapper';
import { HttpClient } from '@angular/common/http';

const API_URL = 'https://pokeapi.co/api/v2/';

@Injectable({ providedIn: 'root' })
export class PokedexService {
  private http = inject(HttpClient); //Contiene peticiones para CRUD

  trendingPokemons = signal<PokemonApp[]>([]); //Lista de Pokemons a mostrar
  private pokemonRequests: Observable<any>[] = []; // Lista compartida de peticiones
  shinyMode = signal<boolean>(false); // Rastrea estado del checkbox
  legendaryMode = signal<boolean>(false); 


  //--------------------- Métodos auxiliares ----------------------------------

  loadAllPokemons() {
    this.http
      .get<PokeGeneralResponse>(`${API_URL}pokemon`, {
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
      .get<PokeResponse>(`${API_URL}type/${query}`)
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
    const newRequest = this.http.get(`${API_URL}pokemon/${query}`);

    // Reasignamos pokemonRequests con el nuevo request
    this.pokemonRequests = [newRequest];

    // Procesamos las peticiones
    this.processPokemonRequests();
  }

  //--------------------- Métodos auxiliares Para tratar la Data----------------------------------

  private processPokemonRequests() {
    if (this.pokemonRequests.length === 0) {
      console.warn('No hay peticiones en pokemonRequests para procesar.');
      return;
    }

    forkJoin(this.pokemonRequests)
      .pipe(
        switchMap((detailedPokemons) => {
          //Arñadimos el atributo booleano isLegendary obtenido de una subconsulta para mandarselo al mapper
          const speciesRequests = detailedPokemons.map((pokemon: any) =>
            this.fetchPokemonSpecies(pokemon.species.name).pipe(
              map((speciesData) => ({
                ...pokemon,
                isLegendary: speciesData.is_legendary, // Añadimos el dato al objeto
              }))
            )
          );

          return forkJoin(speciesRequests);
        })
      )
      .subscribe((enhancedPokemons) => {
        const pokemonApps =
          PokemonMapper.mapDetailedPokemonsToPokemonAppArray(enhancedPokemons);
        this.trendingPokemons.set(pokemonApps);
      });
  }


  private fetchPokemonSpecies(name: string): Observable<any> {
    // Si el nombre contiene un '-', tomamos solo la parte antes del guion
    return this.http.get(`${API_URL}pokemon-species/${name}`);
  }
}
