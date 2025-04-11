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
const SESSION_STORAGE_KEY = 'pokemons';

@Injectable({ providedIn: 'root' })
export class PokedexService {
  private http = inject(HttpClient);
  
  private requestedTypes = new Set<string>(); // Rastrea los tipos ya solicitados

  allPokemons = signal<PokemonApp[]>(this.loadFromSessionStorage()); // Carga inicial desde sessionStorage
  shownPokemons = signal<PokemonApp[]>([]); // Lista de Pokémon mostrados
  private pokemonRequests: Observable<PokemonApp>[] = []; // Lista compartida de peticiones

  selectedType = signal<string>(''); // Tipo seleccionado por defecto
  shinyMode = signal<boolean>(false); // Rastrea estado del checkbox
  legendaryMode = signal<boolean>(false);

  //--------------------- Computed de filtrado ----------------------------------

  filteredPokemons = computed(() => {
    let filtered = this.shownPokemons(); // Lista actual de Pokémon

    // Filtra por tipo seleccionado
    if (this.selectedType && this.selectedType() !== 'all') {
      filtered = filtered.filter((pokemon) =>
        pokemon.types.includes(this.selectedType())
      );
    }

    if (this.legendaryMode()) {
      filtered = filtered.filter((pokemon) => pokemon.isLegendary);
    }
    if (this.shinyMode()) {
      filtered = filtered.filter((pokemon) => pokemon.isShiny);
    }
    return filtered;
  });

  //--------------------- Métodos de Búsqueda ----------------------------------

  /**
   * Carga todos los Pokémon desde la API y los almacena en `allPokemons` sin repeticiones.
   */
  loadAllPokemons(): void {
    if (this.requestedTypes.has('all')) {
      this.shownPokemons.set(this.allPokemons());
      return;
    }

    this.http
      .get<PokeGeneralResponse>(`${API_URL}pokemon`, { params: { limit: 100 } })
      .subscribe((respuesta) => {
        this.pokemonRequests = respuesta.results.map((pokemon) =>
          this.http.get<PokemonApp>(pokemon.url)
        );

        this.processPokemonRequests((pokemonApps) => {
          const uniquePokemons = this.mergeUniquePokemons(
            this.allPokemons(),
            pokemonApps
          );
          this.allPokemons.set(uniquePokemons);
          this.shownPokemons.set(uniquePokemons);
          this.requestedTypes.add('all');
          this.saveToSessionStorage(uniquePokemons); // Guarda en sessionStorage
        });
      });
  }

  /**
   * Busca Pokémon por tipo utilizando la API o los datos ya cargados.
   * @param query - El tipo de Pokémon a buscar.
   */
  searchPokemonsByType(query: string): void {

    if (this.requestedTypes.has(query)) {
      // Filtra los Pokémon por tipo desde la lista `allPokemons`
      const filteredByType = this.allPokemons().filter((pokemon) =>
        pokemon.types.includes(query)
      );
      this.shownPokemons.set(filteredByType);
      return;
    }

    this.http
      .get<PokeResponse>(`${API_URL}type/${query}`)
      .subscribe((respuesta) => {
        this.pokemonRequests = respuesta.pokemon.map((pokemon) =>
          this.http.get<PokemonApp>(pokemon.pokemon.url)
        );

        this.processPokemonRequests((pokemonApps) => {
          const uniquePokemons = this.mergeUniquePokemons(
            this.allPokemons(),
            pokemonApps
          );
          this.allPokemons.set(uniquePokemons);
          const filteredByType = uniquePokemons.filter((pokemon) =>
            respuesta.pokemon.some((poke) => poke.pokemon.name === pokemon.name)
          );
          this.shownPokemons.set(filteredByType);
          this.requestedTypes.add(query);
          this.saveToSessionStorage(uniquePokemons); // Guarda en sessionStorage
        });
      });
  }

  //--------------------- Métodos auxiliares ----------------------------------

  /**
   * Procesa las peticiones almacenadas en `pokemonRequests` para obtener los detalles
   * de los Pokémon y enriquecerlos con información adicional.
   * @param callback - Función opcional que se ejecuta después de procesar los Pokémon.
   */
  private processPokemonRequests(
    callback?: (pokemonApps: PokemonApp[]) => void
  ): void {
    if (this.pokemonRequests.length === 0) {
      console.warn('No hay peticiones en pokemonRequests para procesar.');
      return;
    }

    forkJoin(this.pokemonRequests)
      .pipe(
        switchMap((detailedPokemons: PokemonApp[]) => {
          const speciesRequests = detailedPokemons.map((pokemon: any) =>
            this.fetchPokemonSpecies(pokemon.species.name).pipe(
              map((speciesData) => ({
                ...pokemon,
                isLegendary: speciesData.is_legendary,
              }))
            )
          );

          return forkJoin(speciesRequests);
        })
      )
      .subscribe((enhancedPokemons) => {
        const pokemonApps =
          PokemonMapper.mapDetailedPokemonsToPokemonAppArray(enhancedPokemons);

        if (callback) {
          callback(pokemonApps);
        }
      });
  }

  /**
   * Realiza una petición a la API para obtener información adicional sobre una especie de Pokémon.
   * @param name - El nombre de la especie del Pokémon.
   * @returns Un observable que emite un objeto con la propiedad `is_legendary`.
   */
  private fetchPokemonSpecies(
    name: string
  ): Observable<{ is_legendary: boolean }> {
    return this.http.get<{ is_legendary: boolean }>(
      `${API_URL}pokemon-species/${name}`
    );
  }

  /**
   * Combina dos listas de Pokémon eliminando duplicados.
   * Asegura que los duplicados se eliminen basándose en la propiedad (name)
   * @param existing - Lista existente de Pokémon.
   * @param incoming - Nueva lista de Pokémon.
   * @returns Lista combinada sin duplicados.
   */
  private mergeUniquePokemons(
    existing: PokemonApp[],
    incoming: PokemonApp[]
  ): PokemonApp[] {
    const existingNames = new Set(existing.map((pokemon) => pokemon.name));
    const uniqueIncoming = incoming.filter(
      (pokemon) => !existingNames.has(pokemon.name)
    );
    return [...existing, ...uniqueIncoming];
  }

  //--------------------- Métodos de SessionStorage ----------------------------------

  /**
   * Guarda la lista de Pokémon en sessionStorage.
   * @param pokemons - Lista de Pokémon a guardar.
   */
  private saveToSessionStorage(pokemons: PokemonApp[]): void {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(pokemons));
  }

  /**
   * Carga la lista de Pokémon desde sessionStorage.
   * @returns Lista de Pokémon o un array vacío si no hay datos.
   */
  private loadFromSessionStorage(): PokemonApp[] {
    const storedPokemons = sessionStorage.getItem(SESSION_STORAGE_KEY);
    return storedPokemons ? JSON.parse(storedPokemons) : [];
  }
}
