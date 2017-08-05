import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Dish } from '../../shared/dish'
import { DishProvider } from '../../providers/dish/dish'
import { Observable } from 'rxjs/Observable'
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

/*
  Generated class for the FavoriteProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class FavoriteProvider {
  
  favorites: Array<any>;

  constructor(public http: Http,
    private dishService: DishProvider,
    private storage: Storage) {
    console.log('Hello FavoriteProvider Provider');
    this.favorites = [];
    this.storage.get('favorites').then(favorites => {
      if(favorites){
        favorites.forEach(element => {
          this.favorites.push(element.id)
        });
      }
    });
  }

  addFavorite(id: number):boolean {
    if(!this.isFavorite(id))
      this.favorites.push(id);
    return true;
  }

  isFavorite(id:number):boolean {
    return this.favorites.some(el => el === id);
  }

  getFavorites(): Observable<Dish[]>{
    return this.dishService.getDishes()
      .map(dishes => dishes.filter(dish => this.favorites.some(el => el === dish.id)))
  }

  deleteFavorite(id:number): Observable<Dish[]>{
    let index = this.favorites.indexOf(id);
    if(index >= 0){
      this.favorites.splice(index,1)
      return this.getFavorites();
    }
    else{
      console.log('Deleting non-existing favorite',id)
      return Observable.throw('Deleting non-existing favorite '+id)
    }
  } 

}
