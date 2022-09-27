/*************************************************************************************************
 ** Imports                                                                                      **
 **************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
//-- **Data Models** ----------------------------------------------------------------------------//
import { EventDb } from '../models/event.model';
import {
  SessionDb,
  SessionLastEventIdentifierFields,
} from '../models/session.model';
//-- **Firebase** -------------------------------------------------------------------------------//
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})

/*************************************************************************************************
 **  API Service Calls                                                                           **
 **************************************************************************************************/
export class SessionService {
  constructor(public fireStoreDB: AngularFirestore) {}

  getSessionArray() {
    return this.fireStoreDB.collection<SessionDb>('session').get();
  }

  getSession(sessionId: string) {
    return this.fireStoreDB
      .collection<SessionDb>('session', (ref) =>
        ref.where('id', '==', sessionId)
      )
      .get();
  }

  createSession(
    sessionInsert: SessionDb,
    eventInsert: EventDb<SessionLastEventIdentifierFields>
  ) {
    const batch = this.fireStoreDB.firestore.batch();

    //-- Insert Session ----------------------------------------------------------------------------------->
    const sessionInsertDbRef = this.fireStoreDB
      .collection<SessionDb>('session')
      .doc(sessionInsert.id).ref;
    batch.set(sessionInsertDbRef, sessionInsert);

    //-- Event Insert -------------------------------------------------------------------------------------------------------------->
    const eventInsertDbRef = this.fireStoreDB
      .collection<EventDb<SessionLastEventIdentifierFields>>('event')
      .doc(eventInsert.id).ref;
    batch.set(eventInsertDbRef, eventInsert);

    return from(batch.commit());
  }

  updateSession(
    sessionUpdate: SessionDb,
    eventUpdate: EventDb<SessionLastEventIdentifierFields>
  ) {
    const batch = this.fireStoreDB.firestore.batch();

    //-- Update Session ---------------------------------------------------------------------------------->
    const sessionUpdateDbRef = this.fireStoreDB
      .collection<SessionDb>('session')
      .doc(sessionUpdate.id).ref;
    batch.set(sessionUpdateDbRef, sessionUpdate);

    //-- Event Insert -------------------------------------------------------------------------------------------------------------->
    const eventUpdateDbRef = this.fireStoreDB
      .collection<EventDb<SessionLastEventIdentifierFields>>('event')
      .doc(eventUpdate.id).ref;
    batch.set(eventUpdateDbRef, eventUpdate);

    return from(batch.commit());
  }

  deleteSession(
    sessionId: string,
    eventDelete: EventDb<SessionLastEventIdentifierFields>
  ) {
    const batch = this.fireStoreDB.firestore.batch();

    //-- Delete Session ----------------------------------------------------------------->
    const sessionDeleteDbRef = this.fireStoreDB
      .collection('session')
      .doc(sessionId).ref;
    batch.delete(sessionDeleteDbRef);

    //-- Event Insert -------------------------------------------------------------------->
    const eventDeleteDbRef = this.fireStoreDB
      .collection('event')
      .doc(eventDelete.id).ref;
    batch.set(eventDeleteDbRef, eventDelete);

    return from(batch.commit());
  }
}
