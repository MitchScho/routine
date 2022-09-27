//--------------- Core -------------------------------------//
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, throwError, pipe } from 'rxjs';
import { filter, map } from 'rxjs/operators';
//---------------FIREBASE----------------------------------//
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/compat/firestore';
//----------------- Helpers ----------------------------------//
import { UiHelper } from '../helpers/ui.helper';
import { FirebaseHelper } from '../helpers/firebase.helper';
//---------------- Data Models --------------------------------//


@Injectable({
  providedIn: 'root',
})
export class DogService {
  constructor(
    public uiHelper: UiHelper,
    public http: HttpClient,
    public fireStoreDb: AngularFirestore,
    public fireBaseHelper: FirebaseHelper,
  ) {}

  addDog(dog: any) {
    const id = this.fireBaseHelper.generateFirebaseId();
    const dogInsert = {
      id: id,
      ...dog
    }
    return from(
      this.fireStoreDb
        .collection('dog')
        .doc(dogInsert.id)
        .set(dogInsert)
    );
  }

  getAllDogs() {
    return this.fireStoreDb.collection("dog").snapshotChanges().pipe(
      map((res) => {
        const enrichedDogServerResponse = this.fireBaseHelper.enrichFirebaseRes(res);
        return enrichedDogServerResponse;
    })
  )
}

}
