import { Injectable,inject } from '@angular/core';
import { collectionData, Firestore,collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private firestore: Firestore = inject(Firestore); 

  constructor() { }

  getCollectionChanges<tipo>(path: string){
    const refCollection = collection(this.firestore, path);
    return collectionData(refCollection) as Observable<tipo[]>;
  }
}
