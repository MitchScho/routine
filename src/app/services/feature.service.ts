/*************************************************************************************************
 ** Imports                                                                                      **
 **************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
//-- **Data Models** ----------------------------------------------------------------------------//
import { EventDb } from '../models/event.model';
import {
  FeatureDb,
  FeatureLastEventIdentifierFields,
} from './../models/feature.model';
//-- **Firebase** -------------------------------------------------------------------------------//
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})

/*************************************************************************************************
 **  API Service Calls                                                                           **
 **************************************************************************************************/
export class FeatureService {
  constructor(public fireStoreDB: AngularFirestore) {}

  //-- Get All API Call ------------------------------------------->
  getAllFeature() {
    return this.fireStoreDB.collection<FeatureDb>('feature').get();
  }

  //-- Get API Call --------------------------------------------------------------------------------------->
  getFeature(featureId: string) {
    return this.fireStoreDB
      .collection<FeatureDb>('feature', (ref) =>
        ref.where('id', '==', featureId)
      )
      .get();
  }

  //-- Create API Call ---------------------------------------------------------------------------->
  createFeature(
    featureInsert: FeatureDb,
    eventInsert: EventDb<FeatureLastEventIdentifierFields>
  ) {
    const batch = this.fireStoreDB.firestore.batch();

    //-- Insert Feature ----------------------------------------------------------------------------------->
    const featureInsertDbRef = this.fireStoreDB
      .collection<FeatureDb>('feature')
      .doc(featureInsert.id).ref;
    batch.set(featureInsertDbRef, featureInsert);

    //-- Event Insert -------------------------------------------------------------------------------------------------------------->
    const eventInsertDbRef = this.fireStoreDB
      .collection<EventDb<FeatureLastEventIdentifierFields>>('event')
      .doc(eventInsert.id).ref;
    batch.set(eventInsertDbRef, eventInsert);

    return from(batch.commit());
  }

  //-- Update API Call ----------------------------------------------------------------------------->
  updateFeature(
    featureUpdate: FeatureDb,
    eventUpdate: EventDb<FeatureLastEventIdentifierFields>
  ) {
    const batch = this.fireStoreDB.firestore.batch();

    //-- Update Feature ---------------------------------------------------------------------------------->
    const featureUpdateDbRef = this.fireStoreDB
      .collection<FeatureDb>('feature')
      .doc(featureUpdate.id).ref;
    batch.set(featureUpdateDbRef, featureUpdate);

    //-- Event Insert -------------------------------------------------------------------------------------------------------------->
    const eventUpdateDbRef = this.fireStoreDB
      .collection<EventDb<FeatureLastEventIdentifierFields>>('event')
      .doc(eventUpdate.id).ref;
    batch.set(eventUpdateDbRef, eventUpdate);

    return from(batch.commit());
  }

  //-- Delete API Call ---------------------------------------------------------------------->
  deleteFeature(
    featureId: string,
    eventDelete: EventDb<FeatureLastEventIdentifierFields>
  ) {
    const batch = this.fireStoreDB.firestore.batch();

    //-- Delete Feature ----------------------------------------------------------------->
    const featureDeleteDbRef = this.fireStoreDB
      .collection('feature')
      .doc(featureId).ref;
    batch.delete(featureDeleteDbRef);

    //-- Event Insert -------------------------------------------------------------------->
    const eventDeleteDbRef = this.fireStoreDB
      .collection('event')
      .doc(eventDelete.id).ref;
    batch.set(eventDeleteDbRef, eventDelete);

    return from(batch.commit());
  }
}
