//la idea de este mapper es que recibamos el objeto que
//viene de la API de Giphy y regresemos un objeto basado en nuestra interfaz

import { Pokemon, PokeResponse } from "../interface/pokeapi.interfaces";
import { PokemonApp } from "../interface/pokemon.interface";

export class PokemonMapper {
  static mapPokemonToPokemonApp(pokemon: Pokemon): PokemonApp {
    return {
      name: pokemon.pokemon.name,
      url: pokemon.pokemon.url,
      imgUrl: 'imagenprueba',
    };
  }

  static mapDetailedPokemonToPokemonApp(detailedPokemon: any): PokemonApp {
    return {
      name: detailedPokemon.name,
      url: detailedPokemon.url,
      imgUrl: detailedPokemon.sprites.front_default, // Asignamos la URL de la imagen
    };
  }

  static mapPokemonsToPokemonAppArray(pokemonArray: Pokemon[]): PokemonApp[] {
    // el .map actua sobre cada elemento pasado en un array y lo convierte dependiendo del mapper que se le indique
    // después devuelve un array con todos los elementos convertidos
    return pokemonArray.map(this.mapPokemonToPokemonApp);
  }

  static mapDetailedPokemonsToPokemonAppArray(detailedPokemons: any[]): PokemonApp[] {
    return detailedPokemons.map(this.mapDetailedPokemonToPokemonApp);
  }

}
