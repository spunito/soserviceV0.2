import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { getAuth } from "firebase/auth";
import { AuthenticationService } from '../common/services/authentication.service';
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { Observable , of } from "rxjs";
import { map } from "rxjs/operators";
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
  
  misTrabajos$: Observable<any[]>;

  constructor(
    private navCtrl: NavController,
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.getTrabajosCreadosPorUsuario();
  }
  
  getTrabajosCreadosPorUsuario() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.misTrabajos$ = this.db.list('trabajosPosteados').valueChanges().pipe(
          map((trabajos: any[]) => trabajos.filter(trabajo => trabajo.creadorId === user.uid))
        );
      } else {
        this.misTrabajos$ = of([]);
      }
    });
  }

  goBack() {
    this.navCtrl.back();
  }

}
