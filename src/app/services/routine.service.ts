/*************************************************************************************************
 ** Imports                                                                                      **
 **************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
//-- **Data Models** ----------------------------------------------------------------------------//
import { EventDb } from '../models/event.model';
import {
  RoutineDb,
  RoutineLastEventIdentifierFields,
} from './../models/routine.model';
//-- **Firebase** -------------------------------------------------------------------------------//
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})

/*************************************************************************************************
 **  API Service Calls                                                                           **
 **************************************************************************************************/
export class RoutineService {
  constructor(public fireStoreDB: AngularFirestore) {}

  //-- Get All API Call ------------------------------------------->
  getAllRoutines() {
    return this.fireStoreDB.collection<RoutineDb>('routine').get();
  }

  //-- Get API Call --------------------------------------------------------------------------------------->
  getRoutine(routineId: string) {
    return this.fireStoreDB
      .collection<RoutineDb>('routine', (ref) =>
        ref.where('id', '==', routineId)
      )
      .get();
  }

  //-- Create API Call ---------------------------------------------------------------------------->
  createRoutine(
    routineInsert: RoutineDb,
    eventInsert: EventDb<RoutineLastEventIdentifierFields>
  ) {
    const batch = this.fireStoreDB.firestore.batch();

    //-- Insert Routine ----------------------------------------------------------------------------------->
    const routineInsertDbRef = this.fireStoreDB
      .collection<RoutineDb>('routine')
      .doc(routineInsert.id).ref;
    batch.set(routineInsertDbRef, routineInsert);

    //-- Event Insert -------------------------------------------------------------------------------------------------------------->
    const eventInsertDbRef = this.fireStoreDB
      .collection<EventDb<RoutineLastEventIdentifierFields>>('event')
      .doc(eventInsert.id).ref;
    batch.set(eventInsertDbRef, eventInsert);

    return from(batch.commit());
  }

  //-- Update API Call ----------------------------------------------------------------------------->
  updateRoutine(
    routineUpdate: RoutineDb,
    eventUpdate: EventDb<RoutineLastEventIdentifierFields>
  ) {
    const batch = this.fireStoreDB.firestore.batch();

    //-- Update Routine ---------------------------------------------------------------------------------->
    const routineUpdateDbRef = this.fireStoreDB
      .collection<RoutineDb>('routine')
      .doc(routineUpdate.id).ref;
    batch.set(routineUpdateDbRef, routineUpdate);

    //-- Event Insert -------------------------------------------------------------------------------------------------------------->
    const eventUpdateDbRef = this.fireStoreDB
      .collection<EventDb<RoutineLastEventIdentifierFields>>('event')
      .doc(eventUpdate.id).ref;
    batch.set(eventUpdateDbRef, eventUpdate);

    return from(batch.commit());
  }

  //-- Delete API Call ---------------------------------------------------------------------->
  deleteRoutine(
    routineId: string,
    eventDelete: EventDb<RoutineLastEventIdentifierFields>
  ) {
    const batch = this.fireStoreDB.firestore.batch();

    //-- Delete Routine ----------------------------------------------------------------->
    const routineDeleteDbRef = this.fireStoreDB
      .collection('routine')
      .doc(routineId).ref;
    batch.delete(routineDeleteDbRef);

    //-- Event Insert -------------------------------------------------------------------->
    const eventDeleteDbRef = this.fireStoreDB
      .collection('event')
      .doc(eventDelete.id).ref;
    batch.set(eventDeleteDbRef, eventDelete);

    return from(batch.commit());
  }
}
