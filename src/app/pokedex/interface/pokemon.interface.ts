export interface PokemonApp {
  name: string;
  type: string;
  base_experience: number;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
  isLegendary: boolean;
  isShiny: boolean;
  imgUrl: string;
  shinyImgUrl: string;
  url: string;
}
