import { Component, inject } from '@angular/core';
import { NavbarComponent } from "./pokedex/components/navbar/navbar.component";
import TrendingComponent from "./pokedex/pages/trending/trending.component";
import { PokedexService } from './pokedex/services/pokedex.service';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, TrendingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'pokedex-app';
  pokedexService = inject( PokedexService )

}
