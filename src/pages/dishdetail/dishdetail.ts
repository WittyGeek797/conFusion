import { Component,Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Dish } from '../../shared/dish'
import { Comment } from '../../shared/comment'
import { FavoriteProvider } from '../../providers/favorite/favorite'
import { CommentPage } from '../../pages/comment/comment'
import { SocialSharing } from '@ionic-native/social-sharing';

/**
 * Generated class for the DishdetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dishdetail',
  templateUrl: 'dishdetail.html',
})
export class DishdetailPage {
  dish:Dish;
  errMess: string;
  avgstars: string;
  numcomments: number;
  favorite:boolean = false;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
    @Inject('BaseURL') private BaseURL,
    private favoriteService: FavoriteProvider,
    private toastCtrl: ToastController,
    private actionCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private storage: Storage,
    private socialSharing: SocialSharing) {
      this.dish = navParams.get('dish');
      this.favorite = this.favoriteService.isFavorite(this.dish.id)
      this.numcomments = this.dish.comments.length;
      let total = 0;
      this.dish.comments.forEach(comment => total+= comment.rating)
      this.avgstars = (total/this.numcomments).toFixed(2);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DishdetailPage');
  }

  addToFavorites(){
    console.log('Adding to Favorites',this.dish.id);
    this.favorite = this.favoriteService.addFavorite(this.dish.id)
    this.toastCtrl.create({
      message: 'Dish '+this.dish.id+' added as a favorite successfully!',
      position: 'middle',
      duration: 3000
    }).present();
    this.favoriteService.getFavorites()
      .subscribe(favorites => this.storage.set('favorites',favorites),
        errMess => console.log('Could not save favorites for future!'))
  }

  openActions(){
    let modal = this.modalCtrl.create(CommentPage,{ dish: this.dish })
    let actionSheet = this.actionCtrl.create({
      title:'Select Actions',
      buttons:[
        {
          text:'Add to Favorites',
          handler: () => this.addToFavorites()
        },
        {
          text:'Add Comment',
          handler: () => {
            modal.present();
          }
        },
        {
          text:'Share via Facebook',
          handler: () => {
            this.socialSharing.shareViaFacebook(
              this.dish.name+' --- '+this.dish.descirption,
              this.BaseURL+this.dish.image,
              ''
            )
            .then(() => console.log('Post successfully to Facebook'))
            .catch(() => console.log('Failed to post to Facebook'));
          }
        },
        {
          text:'Share via Twitter',
          handler: () => {
            this.socialSharing.shareViaTwitter(
              this.dish.name+' --- '+this.dish.descirption,
              this.BaseURL+this.dish.image,
              ''
            )
            .then(() => console.log('Post successfully to Twitter'))
            .catch(() => console.log('Failed to post to Twitter'));
          }
        },
        {
          text:'Cancel',
          role:'cancel',
          handler: () => {
            console.log('Cancelled the Action!');
          }
        }
      ]
    });
    modal.onDidDismiss(dish => this.dish = dish)
    actionSheet.present();
  }

}
