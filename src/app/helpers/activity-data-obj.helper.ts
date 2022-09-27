       /*************************************************************************************************
 ** Imports                                                                                      **
 **************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
//-- **Services/Helpers** -----------------------------------------------------------------------//
import { FirebaseHelper } from '../helpers/firebase.helper';
import * as dateHelper from '../helpers/date.helper';
//-- **Data Models** ----------------------------------------------------------------------------//
import { activityFieldsToDeleteOnServerSend } from './../models/activity.model';
import { ActivityLastEventIdentifierFields } from './../models/activity.model';
import { eventOperationOptions } from '../models/event.model';
import { environment } from '../../environments/environment';
import { activityDatabaseName } from './../models/activity.model';
import { initialEventDb } from '../models/event.model';
import { activityDataVersion } from './../models/activity.model';
import { initialActivityDb } from './../models/activity.model';
import { activityEvents } from './../models/activity.model';
import { EventDb } from '../models/event.model';
import { UserDb } from '../models/user.model';
import { ActivityDb } from '../models/activity.model';

@Injectable({
  providedIn: 'root',
})

/*************************************************************************************************
 **  Enriches Data For Api Calls/Actions                                                         **
 **************************************************************************************************/
export class ActivityDataObjHelper {
  constructor(private firebaseHelper: FirebaseHelper) {}

  createActivity(activity: ActivityDb, user?: UserDb) {
    let stateUpdates: { activityObj: ActivityDb } = {
      activityObj: initialActivityDb,
    };

    //-- Identifier Fields --------------------------------------------------->
    const activityId = activity?.id ?? this.firebaseHelper.generateFirebaseId();
    const eventCorrelationId = this.firebaseHelper.generateFirebaseId();
    const eventId = this.firebaseHelper.generateFirebaseId();

    //--- Activity Obj ------------------------->
    const activityObj: ActivityDb = {
      ...initialActivityDb,
      ...activity,
      id: activityId,
      lastEvent: {
        ...activity?.lastEvent,
        ids: {
          ...initialActivityDb?.lastEvent?.ids,
          ...activity?.lastEvent?.ids,
          activityId,
          eventId,
          eventCorrelationId,
          //add additional id's here
        },
      },
    };

    //-- Generate LastEvent Object ---------------------------------------->
    const lastEvent: EventDb<ActivityLastEventIdentifierFields> = {
      ...initialEventDb,
      id: eventId,
      ids: activityObj?.lastEvent?.ids,
      context: null,
      who: {
        id: user?.id ?? environment.appName,
        name: user?.name ?? environment.appName,
      },
      what: {
        ...initialEventDb?.what,
        event: activityEvents.create,
        databaseName: activityDatabaseName,
        operation: eventOperationOptions.create,
        dataVersion: activityDataVersion,
      },
      when: dateHelper.getTimeFromDateTimestamp(new Date()),
    };

    //-- Activity Insert ----------------------------------------->
    const activityInsert: ActivityDb = {
      ...activityObj,
      lastEvent,
      createdBy: {
        id: user?.id ?? environment.appName,
        name: user?.name ?? environment.appName,
      },
      createdAt: dateHelper.getTimeFromDateTimestamp(new Date()),
    };

    //-- Delete Fields Before Sending To Server ------------------>
    activityFieldsToDeleteOnServerSend.forEach((fieldToDelete) => {
      try {
        delete activityInsert?.[fieldToDelete];
      } catch (error) {
        return;
      }
    });

    //-- Event Insert ---------------------------------------------->
    const eventInsert: EventDb<ActivityLastEventIdentifierFields> = {
      ...activityObj.lastEvent,
      what: {
        ...activityObj.lastEvent.what,
        obj: { ...activityInsert },
      },
    };

    //-- State Updates ---------->
    stateUpdates.activityObj = {
      ...activityInsert,
    };

    return {
      eventInsert,
      activityInsert,
      stateUpdates,
    };
  }

  //-- Update activity --------------------------------------------------------------//
  updateActivity(
    activity: ActivityDb,
    originalFeatureObj: ActivityDb,
    user?: UserDb
  ) {
    let stateUpdates: { activityObj: ActivityDb } = {
      activityObj: initialActivityDb,
    };

    //-- Identifier Fields --------------------------------------------------->
    const eventId = this.firebaseHelper.generateFirebaseId();
    const eventCorrelationId = this.firebaseHelper.generateFirebaseId();

    //--- Activity Obj -------------------------->
    const activityObj: ActivityDb = {
      ...initialActivityDb,
      ...activity,
      lastEvent: {
        ...activity?.lastEvent,
        ids: {
          ...initialActivityDb?.lastEvent?.ids,
          ...originalFeatureObj?.lastEvent?.ids,
          eventId,
          eventCorrelationId,
          //add additional id's here
        },
      },
    };

    //-- Generate LastEvent Object -------------------------------->
    const lastEvent: EventDb<ActivityLastEventIdentifierFields> = {
      ...initialEventDb,
      id: eventId,
      ids: activityObj?.lastEvent?.ids,
      context: null,
      who: {
        id: user?.id ?? environment.appName,
        name: user?.name ?? environment.appName,
      },
      what: {
        ...initialEventDb?.what,
        event: activityEvents.update,
        databaseName: activityDatabaseName,
        operation: eventOperationOptions.update,
        dataVersion: activityDataVersion,
      },
      when: dateHelper.getTimeFromDateTimestamp(new Date()),
    };

    //-- Activity Update ------------->
    const activityUpdate: ActivityDb = {
      ...activityObj,
      lastEvent,
    };

    //-- Delete Fields Before Sending To Server ------------------>
    activityFieldsToDeleteOnServerSend.forEach((fieldToDelete) => {
      try {
        delete activityUpdate?.[fieldToDelete];
      } catch (error) {
        return;
      }
    });

    //-- Event Insert ---------------------------------------------->
    const eventInsert: EventDb<ActivityLastEventIdentifierFields> = {
      ...activityObj.lastEvent,
      what: {
        ...activityObj.lastEvent.what,
        obj: { ...activityUpdate },
      },
    };

    //-- State Updates ---------->
    stateUpdates.activityObj = {
      ...activityUpdate,
    };

    return {
      eventInsert,
      activityUpdate,
      stateUpdates,
    };
  }

  //-- Delete activity --------------------------------------------------------//
  deleteFeature(activity: ActivityDb, user?: UserDb) {
    let stateUpdates: { activityObj: ActivityDb } = { activityObj: null };

    //-- Identifier Fields --------------------------------------------------->
    const eventId = this.firebaseHelper.generateFirebaseId();
    const eventCorrelationId = this.firebaseHelper.generateFirebaseId();

    //--- Activity Obj -------------------------->
    const activityObj: ActivityDb = {
      ...initialActivityDb,
      ...activity,
      lastEvent: {
        ...activity?.lastEvent,
        ids: {
          ...initialActivityDb?.lastEvent?.ids,
          ...activity?.lastEvent?.ids,
          eventId,
          eventCorrelationId,
          //add additional id's here
        },
      },
    };

    //-- Generate LastEvent Object -------------------------------->
    const lastEvent: EventDb<ActivityLastEventIdentifierFields> = {
      ...initialEventDb,
      id: eventId,
      ids: activityObj?.lastEvent?.ids,
      context: null,
      who: {
        id: user?.id ?? environment.appName,
        name: user?.name ?? environment.appName,
      },
      what: {
        ...initialEventDb?.what,
        event: activityEvents.delete,
        databaseName: activityDatabaseName,
        operation: eventOperationOptions.delete,
        dataVersion: activityDataVersion,
      },
      when: dateHelper.getTimeFromDateTimestamp(new Date()),
    };

    //-- Activity Delete -------------->
    const activityDelete: ActivityDb = {
      ...activityObj,
      lastEvent,
    };

    //-- Delete Fields Before Sending To Server ------------------>
    activityFieldsToDeleteOnServerSend.forEach((fieldToDelete) => {
      try {
        delete activityDelete?.[fieldToDelete];
      } catch (error) {
        return;
      }
    });

    //-- Event Insert ---------------------------------------------->
    const eventInsert: EventDb<ActivityLastEventIdentifierFields> = {
      ...activityObj.lastEvent,
      what: {
        ...activityObj.lastEvent.what,
        obj: { ...activityDelete },
      },
    };

    //-- State Updates ---------->
    stateUpdates.activityObj = {
      ...activityDelete,
    };

    return {
      eventInsert,
      stateUpdates,
    };
  }

  enrichActivityServerResponse(serverResponse: any) {
    if (serverResponse?.docs) {
      return serverResponse.docs.map((doc) => {
        //-- Check to see if 'lastEvent' field exists in order to enrich date fields -->
        const hasLastEventField = this.hasPropertyField(
          doc?.data(),
          'lastEvent'
        );
        const hasCreatedAtField = this.hasPropertyField(
          doc?.data(),
          'createdAt'
        );
        //-- Has LastEvent Field ------------------------------------------------->
        if (hasLastEventField && hasCreatedAtField) {
          const createdAt = {
            ...doc.data()?.createdAt,
            timestamp: doc.data()?.createdAt?.timestamp?.toDate() ?? null,
          };

          //-- Enrich Last Event Date + Set Last Event Obj --------------------->
          const lastEvent = {
            ...doc.data()?.lastEvent,
            when: {
              ...doc.data()?.lastEvent?.when,
              timestamp:
                doc.data()?.lastEvent?.when?.timestamp?.toDate() ?? null,
            },
          };

          return {
            ...doc.data(),
            lastEvent,
            createdAt,
          };
        }
        //-- No LastEvent Field -->
        else {
          return {
            ...doc.data(),
          };
        }
      });
    }
    //---- Only Single Document Exists -------------------------------------------------------->
    else {
      return serverResponse.map((item) => {
        const hasLastEventField = this.hasPropertyField(
          item?.payload.doc.data(),
          'lastEvent'
        );
        const hasCreatedAtField = this.hasPropertyField(
          item?.payload.doc.data(),
          'createdAt'
        );

        if (hasLastEventField && hasCreatedAtField) {
          const createdAt = {
            ...item?.payload.doc.data()?.createdAt,
            timestamp:
              item?.payload.doc.data()?.createdAt?.timestamp?.toDate() ?? null,
          };

          //-- Enrich Last Event Date + Set Last Event Obj ----------------------------------->
          const lastEvent = {
            ...item?.payload.doc.data()?.lastEvent,
            when: {
              ...item?.payload.doc.data()?.lastEvent?.when,
              timestamp:
                item?.payload.doc
                  .data()
                  ?.lastEvent?.when?.timestamp?.toDate() ?? null,
            },
          };

          return {
            ...item?.payload.doc.data(),
            lastEvent,
            createdAt,
          };
        } else {
          return {
            ...item?.payload.doc.data(),
          };
        }
      });
    }
  }

  hasPropertyField(obj, prop) {
    const proto = obj.__proto__ || obj.constructor.prototype;
    return prop in obj && (!(prop in proto) || proto[prop] !== obj[prop]);
  }
}
