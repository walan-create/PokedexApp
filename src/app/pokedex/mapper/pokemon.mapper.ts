//la idea de este mapper es que recibamos el objeto que
//viene de la API de Giphy y regresemos un objeto basado en nuestra interfaz

import { PokemonApp } from '../interface/pokemon.interface';

export class PokemonMapper {
  static mapDetailedPokemonToPokemonApp(pokemon: any): PokemonApp {
    return {
      name: pokemon.name,
      types: pokemon.types.map((typeInfo: any) => typeInfo.type.name), // Convertimos los tipos en una lista de strings
      base_experience: pokemon.base_experience,
      stats: {
        hp: pokemon.stats[0].base_stat,
        attack: pokemon.stats[1].base_stat,
        defense: pokemon.stats[2].base_stat,
        speed: pokemon.stats[5].base_stat,
      },
      isLegendary: pokemon.isLegendary, //Aqui hay que meter la info
      //Ojo a la verificacion de si es shiny
      isShiny:
        pokemon.sprites.other['official-artwork'].front_shiny != null
          ? true
          : false,
      url: pokemon.url,
      imgUrl:
        pokemon.sprites.other['official-artwork'].front_default != null
          ? // ? pokemon.sprites.front_default
            // ? pokemon.sprites.other['showdown'].front_default
            pokemon.sprites.other['official-artwork'].front_default
          : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhInCrk0waR4AJjMAcQ8_XV7v9AYNChOA3Pw&s', // Asignamos la URL de la imagen
      shinyImgUrl:
        pokemon.sprites.other['official-artwork'].front_shiny != null
          ? // ? pokemon.sprites.front_shiny
            // ? pokemon.sprites.other['showdown'].front_shiny
            pokemon.sprites.other['official-artwork'].front_shiny
          : '', // Asignamos la URL de la imagen shiny
    };
  }

  static mapDetailedPokemonsToPokemonAppArray(Pokemons: any[]): PokemonApp[] {
    // el .map actua sobre cada elemento pasado en un array y lo convierte dependiendo del mapper que se le indique
    // después devuelve un array con todos los elementos convertidos
    return Pokemons.map(this.mapDetailedPokemonToPokemonApp);
  }
}
