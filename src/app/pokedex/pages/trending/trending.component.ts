import { Component, inject } from '@angular/core';
import { ListComponent } from "../../components/list/list.component";
import { PokedexService } from '../../services/pokedex.service';


@Component({
  selector: 'app-trending',
  imports: [ListComponent],
  templateUrl: './trending.component.html',
})
export default class TrendingComponent {

  //Inyectamos dependencia
  pokedexService = inject(PokedexService);


 }
