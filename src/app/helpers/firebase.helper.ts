//---------------CORE--------------------------------------//
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseHelper {
  constructor(private fireStoreDB: AngularFirestore) {}

  enrichFirebaseRes(serverResponse: any) {
    if (serverResponse?.docs) {
      return serverResponse.docs.map((doc) => {
        return {
          ...doc.data(),
        };
      });
    }
    //---- Only Single Document Exists ------------------------------------------------->
    else {
      return serverResponse.map((item) => {
        return {
          ...item?.payload.doc.data(),
        };
      });
    }
  }

  hasPropertyField(obj, prop) {
    var proto = obj.__proto__ || obj.constructor.prototype;
    return prop in obj && (!(prop in proto) || proto[prop] !== obj[prop]);
  }

  enrichDocument(serverResponse: any) {
    //-- Check to see if 'lastEvent' field exists in order to enrich date fields -->
    const hasLastEventField = this.hasPropertyField(
      serverResponse?.data(),
      'lastEvent'
    );
    const hastCreatedAtField = this.hasPropertyField(
      serverResponse?.data(),
      'createdAt'
    );

    //-- Has LastEvent Field ------------------------------------------------->
    if (hasLastEventField && hastCreatedAtField) {
      const createdAt = {
        ...serverResponse.data()?.createdAt,
        timestamp:
          serverResponse.data()?.createdAt?.timestamp?.toDate() ?? null,
      };

      //-- Enrich Last Event Date + Set Last Event Obj --------------------->
      const lastEvent = {
        ...serverResponse.data()?.lastEvent,
        when: {
          ...serverResponse.data()?.lastEvent?.when,
          timestamp:
            serverResponse.data()?.lastEvent?.when?.timestamp?.toDate() ?? null,
        },
      };

      return {
        ...serverResponse.data(),
        lastEvent,
        createdAt,
      };
    }
    //-- No LastEvent Field -->
    else {
      return {
        ...serverResponse.data(),
      };
    }
  }

  generateFirebaseId() {
    return this.fireStoreDB.createId();
  }

  mockObservable() {
    return of(null);
  }
}
