import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ListComponent } from "../../components/list/list.component";
import { PokedexService } from '../../services/pokedex.service';
import { PokemonApp } from '../../interface/pokemon.interface';

 const Pokemons: PokemonApp[] = [
   {
    'name': 'Pikachu',
    'imgUrl': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    'url': 'ALAN',
   },
   {
    'name': 'Pikachu',
    'imgUrl': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    'url': 'ALAN',
   },
   {
    'name': 'Pikachu',
    'imgUrl': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    'url': 'ALAN',
   },
   {
    'name': 'Pikachu',
    'imgUrl': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    'url': 'ALAN',
   },
   {
    'name': 'Pikachu',
    'imgUrl': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    'url': 'ALAN',
   },
   {
    'name': 'Pikachu',
    'imgUrl': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    'url': 'ALAN',
   },
   {
    'name': 'Pikachu',
    'imgUrl': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    'url': 'ALAN',
   },

 ];

@Component({
  selector: 'app-trending',
  imports: [ListComponent],
  templateUrl: './trending.component.html',
})
export default class TrendingComponent {

  //Inyectamos dependencia
  pokedexService = inject(PokedexService);

  //Importante instanciar dentro de la clase lo que queremos pasar como parametro al hijo
  pokemonsPrueba = signal(Pokemons);

 }
