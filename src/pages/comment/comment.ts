import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { Validators,FormBuilder, FormGroup } from '@angular/forms'
import { Dish } from '../../shared/dish';

/**
 * Generated class for the CommentPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-comment',
  templateUrl: 'comment.html',
})
export class CommentPage {

  comments: FormGroup
  dish: Dish

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController,
    private formBuilder: FormBuilder) {
      this.dish = this.navParams.get('dish')
      this.comments = this.formBuilder.group({
        name:['',Validators.required],
        rating:5,
        comment:['',Validators.required],
        date: ''
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentPage');
  }

  dismiss(){
    this.viewCtrl.dismiss(this.dish);
  }
  
  onSubmit(){
    let temp = new Date();
    this.comments.value.date = temp.toISOString();
    console.log(this.comments.value);
    this.dish.comments.push(this.comments.value);
    this.viewCtrl.dismiss(this.dish);
  }

}
