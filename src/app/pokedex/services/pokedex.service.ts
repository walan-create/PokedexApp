import { computed, inject, Injectable, signal } from '@angular/core';
import {
  PokeGeneralResponse,
  PokeResponse,
} from '../interface/pokeapi.interfaces';
import { PokemonApp } from '../interface/pokemon.interface';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { PokemonMapper } from '../mapper/pokemon.mapper';
import { HttpClient } from '@angular/common/http';

const API_URL = 'https://pokeapi.co/api/v2/';

@Injectable({ providedIn: 'root' })
export class PokedexService {
  private http = inject(HttpClient);

  allPokemons = signal<PokemonApp[]>([]); // Lista base de todos los Pokémon
  shownPokemons = signal<PokemonApp[]>([]); // Lista de Pokémon mostrados
  private pokemonRequests: Observable<PokemonApp>[] = []; // Lista compartida de peticiones

  shinyMode = signal<boolean>(false); // Rastrea estado del checkbox
  legendaryMode = signal<boolean>(false);

  //--------------------- Computed de filtrado ----------------------------------

  //Computed permite crear valores derivados de otro signal (trendingPokemon)
  filteredPokemons = computed(() => {
    // Filtrar por modo legendario
    let filtered = this.shownPokemons(); // Lista actual de Pokémon
    if (this.legendaryMode()) {
      filtered = filtered.filter((pokemon) => pokemon.isLegendary);
    }

    // Filtrar por modo shiny
    if (this.shinyMode()) {
      filtered = filtered.filter((pokemon) => pokemon.isShiny);
    }

    return filtered; // Devuelve la lista filtrada según los modos activados
  });

  //--------------------- Métodos de Busqueda ----------------------------------

  /**
   * Carga todos los Pokémon desde la API y los almacena en las propiedades `allPokemons` y `shownPokemons`.
   * Realiza una petición inicial para obtener una lista general de Pokémon y luego realiza peticiones
   * individuales para obtener los detalles de cada Pokémon.
   */
  loadAllPokemons(): void {
    this.http
      .get<PokeGeneralResponse>(`${API_URL}pokemon`, {
        params: { limit: 70 },
      })
      .subscribe((respuesta) => {
        // Llenamos la lista compartida de peticiones
        this.pokemonRequests = respuesta.results.map((pokemon) =>
          this.http.get<PokemonApp>(pokemon.url)
        );

        // Llamamos al método para procesar las peticiones
        this.processPokemonRequests();
      });
  }

    /**
   * Busca Pokémon por tipo utilizando la API.
   * Realiza una petición para obtener todos los Pokémon de un tipo específico y luego
   * procesa las peticiones para obtener los detalles de cada Pokémon.
   * @param query - El tipo de Pokémon a buscar.
   */
  searchPokemonsByType(query: string) {
    this.http
      .get<PokeResponse>(`${API_URL}type/${query}`)
      .subscribe((respuesta) => {
        // Llenamos la lista compartida de peticiones
        this.pokemonRequests = respuesta.pokemon.map((pokemon) =>
          this.http.get<PokemonApp>(pokemon.pokemon.url)
        );
        // Llamamos al método para procesar las peticiones
        this.processPokemonRequests();
      });
  }

  searchPokemonByName(query: string) {
    const filteredPokemons = this.shownPokemons().filter((pokemon) =>
      pokemon.name.toLowerCase().includes(query.toLowerCase())
    );
    // Actualizamos la lista de Pokémon mostrados con los resultados filtrados
    this.shownPokemons.set(filteredPokemons);
  }

  //--------------------- Métodos auxiliares Para tratar la Data----------------------------------

   /**
   * Procesa las peticiones almacenadas en `pokemonRequests` para obtener los detalles
   * de los Pokémon y enriquecerlos con información adicional (como si son legendarios).
   * Luego, mapea los datos obtenidos y los almacena en las propiedades `allPokemons` y `shownPokemons`.
   */
  private processPokemonRequests(): void {
    if (this.pokemonRequests.length === 0) {
      console.warn('No hay peticiones en pokemonRequests para procesar.');
      return;
    }

    forkJoin(this.pokemonRequests)
      .pipe(
        switchMap((detailedPokemons: PokemonApp[]) => {
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
        // Guardamos la lista completa en allPokemons
        this.allPokemons.set(pokemonApps);
        // Inicializamos trendingPokemons con todos los Pokémon
        this.shownPokemons.set(pokemonApps);
      });
  }


  /**
   * Realiza una petición a la API para obtener información adicional sobre una especie de Pokémon,
   * como si es legendario o no.
   * @param name - El nombre de la especie del Pokémon.
   * @returns Un observable que emite un objeto con la propiedad `is_legendary`.
   */
  private fetchPokemonSpecies(
    name: string
  ): Observable<{ is_legendary: boolean }> {
    // Si el nombre contiene un '-', tomamos solo la parte antes del guion
    return this.http.get<{ is_legendary: boolean }>(
      `${API_URL}pokemon-species/${name}`
    );
  }
}
