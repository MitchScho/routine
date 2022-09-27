/*************************************************************************************************
 ** Imports                                                                                      **
 **************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
//-- **Data Models** ----------------------------------------------------------------------------//
import { EventDb } from '../models/event.model';
import { ActivityDb, ActivityLastEventIdentifierFields } from './../models/activity.model';
//-- **Firebase** -------------------------------------------------------------------------------//
import { AngularFirestore } from '@angular/fire/compat/firestore';

//----------------- Helpers ----------------------------------//
import { UiHelper } from '../helpers/ui.helper';
import { FirebaseHelper } from '../helpers/firebase.helper';
@Injectable({
  providedIn: 'root',
})

/*************************************************************************************************
 **  API Service Calls                                                                           **
 **************************************************************************************************/
export class ActivityService {
  constructor(
    public uiHelper: UiHelper,
    public http: HttpClient,
    public fireStoreDb: AngularFirestore,
    public fireBaseHelper: FirebaseHelper
  ) {}

  //-- Get All API Call ------------------------------------------->
  // getAllActivities() {
  //   return this.fireStoreDB.collection<ActivityDb>('activity').get();
  // }

  getAllActivities() {
    return this.fireStoreDb
      .collection('activity')
      .snapshotChanges()
      .pipe(
        map((res) => {
          const enrichedActivityServerResponse =
            this.fireBaseHelper.enrichFirebaseRes(res);
          return enrichedActivityServerResponse;
        })
      );
  }

  //-- Get API Call --------------------------------------------------------------------------------------->
  getActivity(activityId: string) {
    return this.fireStoreDB
      .collection<ActivityDb>('activity', (ref) =>
        ref.where('id', '==', activityId)
      )
      .get();
  }

  //---- Add Activity ------------------------------------------------------------------------------->
  addActivity(activity: any) {
    const id = this.fireBaseHelper.generateFirebaseId();
    const activityInsert = {
      id: id,
      ...activity,
    };
    return from(
      this.fireStoreDb
        .collection('activity')
        .doc(activityInsert.id)
        .set(activityInsert)
    );
  }

  //-- Create API Call ---------------------------------------------------------------------------->
  createActivity(
    activityInsert: ActivityDb,
    eventInsert: EventDb<ActivityLastEventIdentifierFields>
  ) {
    const batch = this.fireStoreDB.firestore.batch();

    //-- Insert Activity ----------------------------------------------------------------------------------->
    const activityInsertDbRef = this.fireStoreDB
      .collection<ActivityDb>('activity')
      .doc(activityInsert.id).ref;
    batch.set(activityInsertDbRef, activityInsert);

    //-- Event Insert -------------------------------------------------------------------------------------------------------------->
    const eventInsertDbRef = this.fireStoreDB
      .collection<EventDb<ActivityLastEventIdentifierFields>>('event')
      .doc(eventInsert.id).ref;
    batch.set(eventInsertDbRef, eventInsert);

    return from(batch.commit());
  }

  //-- Update API Call ----------------------------------------------------------------------------->
  updateActivity(
    activityUpdate: ActivityDb,
    eventUpdate: EventDb<ActivityLastEventIdentifierFields>
  ) {
    const batch = this.fireStoreDB.firestore.batch();

    //-- Update Activity ---------------------------------------------------------------------------------->
    const activityUpdateDbRef = this.fireStoreDB
      .collection<ActivityDb>('activity')
      .doc(activityUpdate.id).ref;
    batch.set(activityUpdateDbRef, activityUpdate);

    //-- Event Insert -------------------------------------------------------------------------------------------------------------->
    const eventUpdateDbRef = this.fireStoreDB
      .collection<EventDb<ActivityLastEventIdentifierFields>>('event')
      .doc(eventUpdate.id).ref;
    batch.set(eventUpdateDbRef, eventUpdate);

    return from(batch.commit());
  }

  //-- Delete API Call ---------------------------------------------------------------------->
  deleteActivity(
    activityId: string,
    eventDelete: EventDb<ActivityLastEventIdentifierFields>
  ) {
    const batch = this.fireStoreDB.firestore.batch();

    //-- Delete Activity ----------------------------------------------------------------->
    const activityDeleteDbRef = this.fireStoreDB
      .collection('activity')
      .doc(activityId).ref;
    batch.delete(activityDeleteDbRef);

    //-- Event Insert -------------------------------------------------------------------->
    const eventDeleteDbRef = this.fireStoreDB
      .collection('event')
      .doc(eventDelete.id).ref;
    batch.set(eventDeleteDbRef, eventDelete);

    return from(batch.commit());
  }
}


