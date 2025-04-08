//la idea de este mapper es que recibamos el objeto que
//viene de la API de Giphy y regresemos un objeto basado en nuestra interfaz

import { Pokemon, PokeResponse } from "../interface/pokeapi.interfaces";
import { PokemonApp } from "../interface/pokemon.interface";

export class PokemonMapper {

  static mapDetailedPokemonToPokemonApp(detailedPokemon: any): PokemonApp {

    return{
      name: detailedPokemon.name,
      type: detailedPokemon.types[0].type.name,
      isShiny: detailedPokemon.sprites.front_shiny != null ? true : false ,
      url: detailedPokemon.url,
      imgUrl: detailedPokemon.sprites.front_default, // Asignamos la URL de la imagen
      shinyImgUrl: detailedPokemon.sprites.front_shiny != null ? detailedPokemon.sprites.front_shiny : '', // Asignamos la URL de la imagen
      // shinyImgUrl: detailedPokemon.sprites.front_shiny ?? 'No shiny', // Asignamos la URL de la imagen
    };
  }

  static mapDetailedPokemonsToPokemonAppArray(detailedPokemons: any[]): PokemonApp[] {
    // el .map actua sobre cada elemento pasado en un array y lo convierte dependiendo del mapper que se le indique
    // después devuelve un array con todos los elementos convertidos
    return detailedPokemons.map(this.mapDetailedPokemonToPokemonApp);
  }

}
