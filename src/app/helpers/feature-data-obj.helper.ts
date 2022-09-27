/*************************************************************************************************
 ** Imports                                                                                      **
 **************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
//-- **Services/Helpers** -----------------------------------------------------------------------//
import { FirebaseHelper } from '../helpers/firebase.helper';
import * as dateHelper from '../helpers/date.helper';
//-- **Data Models** ----------------------------------------------------------------------------//
import { featureFieldsToDeleteOnServerSend } from './../models/feature.model';
import { FeatureLastEventIdentifierFields } from './../models/feature.model';
import { eventOperationOptions } from '../models/event.model';
import { environment } from '../../environments/environment';
import { featureDatabaseName } from './../models/feature.model';
import { initialEventDb } from '../models/event.model';
import { featureDataVersion } from './../models/feature.model';
import { initialFeatureDb } from './../models/feature.model';
import { featureEvents } from './../models/feature.model';
import { EventDb } from '../models/event.model';
import { UserDb } from '../models/user.model';
import { FeatureDb } from '../models/feature.model';

@Injectable({
  providedIn: 'root',
})

/*************************************************************************************************
 **  Enriches Data For Api Calls/Actions                                                         **
 **************************************************************************************************/
export class FeatureDataObjHelper {
  constructor(private firebaseHelper: FirebaseHelper) {}

  createFeature(feature: FeatureDb, user?: UserDb) {
    let stateUpdates: { featureObj: FeatureDb } = {
      featureObj: initialFeatureDb,
    };

    //-- Identifier Fields --------------------------------------------------->
    const featureId = feature?.id ?? this.firebaseHelper.generateFirebaseId();
    const eventCorrelationId = this.firebaseHelper.generateFirebaseId();
    const eventId = this.firebaseHelper.generateFirebaseId();

    //--- Feature Obj ------------------------->
    const featureObj: FeatureDb = {
      ...initialFeatureDb,
      ...feature,
      id: featureId,
      lastEvent: {
        ...feature?.lastEvent,
        ids: {
          ...initialFeatureDb?.lastEvent?.ids,
          ...feature?.lastEvent?.ids,
          featureId,
          eventId,
          eventCorrelationId,
          //add additional id's here
        },
      },
    };

    //-- Generate LastEvent Object ---------------------------------------->
    const lastEvent: EventDb<FeatureLastEventIdentifierFields> = {
      ...initialEventDb,
      id: eventId,
      ids: featureObj?.lastEvent?.ids,
      context: null,
      who: {
        id: user?.id ?? environment.appName,
        name: user?.name ?? environment.appName,
      },
      what: {
        ...initialEventDb?.what,
        event: featureEvents.create,
        databaseName: featureDatabaseName,
        operation: eventOperationOptions.create,
        dataVersion: featureDataVersion,
      },
      when: dateHelper.getTimeFromDateTimestamp(new Date()),
    };

    //-- Feature Insert ----------------------------------------->
    const featureInsert: FeatureDb = {
      ...featureObj,
      lastEvent,
      createdBy: {
        id: user?.id ?? environment.appName,
        name: user?.name ?? environment.appName,
      },
      createdAt: dateHelper.getTimeFromDateTimestamp(new Date()),
    };

    //-- Delete Fields Before Sending To Server ------------------>
    featureFieldsToDeleteOnServerSend.forEach((fieldToDelete) => {
      try {
        delete featureInsert?.[fieldToDelete];
      } catch (error) {
        return;
      }
    });

    //-- Event Insert ---------------------------------------------->
    const eventInsert: EventDb<FeatureLastEventIdentifierFields> = {
      ...featureObj.lastEvent,
      what: {
        ...featureObj.lastEvent.what,
        obj: { ...featureInsert },
      },
    };

    //-- State Updates ---------->
    stateUpdates.featureObj = {
      ...featureInsert,
    };

    return {
      eventInsert,
      featureInsert,
      stateUpdates,
    };
  }

  //-- Update feature --------------------------------------------------------------//
  updateFeature(
    feature: FeatureDb,
    originalFeatureObj: FeatureDb,
    user?: UserDb
  ) {
    let stateUpdates: { featureObj: FeatureDb } = {
      featureObj: initialFeatureDb,
    };

    //-- Identifier Fields --------------------------------------------------->
    const eventId = this.firebaseHelper.generateFirebaseId();
    const eventCorrelationId = this.firebaseHelper.generateFirebaseId();

    //--- Feature Obj -------------------------->
    const featureObj: FeatureDb = {
      ...initialFeatureDb,
      ...feature,
      lastEvent: {
        ...feature?.lastEvent,
        ids: {
          ...initialFeatureDb?.lastEvent?.ids,
          ...originalFeatureObj?.lastEvent?.ids,
          eventId,
          eventCorrelationId,
          //add additional id's here
        },
      },
    };

    //-- Generate LastEvent Object -------------------------------->
    const lastEvent: EventDb<FeatureLastEventIdentifierFields> = {
      ...initialEventDb,
      id: eventId,
      ids: featureObj?.lastEvent?.ids,
      context: null,
      who: {
        id: user?.id ?? environment.appName,
        name: user?.name ?? environment.appName,
      },
      what: {
        ...initialEventDb?.what,
        event: featureEvents.update,
        databaseName: featureDatabaseName,
        operation: eventOperationOptions.update,
        dataVersion: featureDataVersion,
      },
      when: dateHelper.getTimeFromDateTimestamp(new Date()),
    };

    //-- Feature Update ------------->
    const featureUpdate: FeatureDb = {
      ...featureObj,
      lastEvent,
    };

    //-- Delete Fields Before Sending To Server ------------------>
    featureFieldsToDeleteOnServerSend.forEach((fieldToDelete) => {
      try {
        delete featureUpdate?.[fieldToDelete];
      } catch (error) {
        return;
      }
    });

    //-- Event Insert ---------------------------------------------->
    const eventInsert: EventDb<FeatureLastEventIdentifierFields> = {
      ...featureObj.lastEvent,
      what: {
        ...featureObj.lastEvent.what,
        obj: { ...featureUpdate },
      },
    };

    //-- State Updates ---------->
    stateUpdates.featureObj = {
      ...featureUpdate,
    };

    return {
      eventInsert,
      featureUpdate,
      stateUpdates,
    };
  }

  //-- Delete feature --------------------------------------------------------//
  deleteFeature(feature: FeatureDb, user?: UserDb) {
    let stateUpdates: { featureObj: FeatureDb } = { featureObj: null };

    //-- Identifier Fields --------------------------------------------------->
    const eventId = this.firebaseHelper.generateFirebaseId();
    const eventCorrelationId = this.firebaseHelper.generateFirebaseId();

    //--- Feature Obj -------------------------->
    const featureObj: FeatureDb = {
      ...initialFeatureDb,
      ...feature,
      lastEvent: {
        ...feature?.lastEvent,
        ids: {
          ...initialFeatureDb?.lastEvent?.ids,
          ...feature?.lastEvent?.ids,
          eventId,
          eventCorrelationId,
          //add additional id's here
        },
      },
    };

    //-- Generate LastEvent Object -------------------------------->
    const lastEvent: EventDb<FeatureLastEventIdentifierFields> = {
      ...initialEventDb,
      id: eventId,
      ids: featureObj?.lastEvent?.ids,
      context: null,
      who: {
        id: user?.id ?? environment.appName,
        name: user?.name ?? environment.appName,
      },
      what: {
        ...initialEventDb?.what,
        event: featureEvents.delete,
        databaseName: featureDatabaseName,
        operation: eventOperationOptions.delete,
        dataVersion: featureDataVersion,
      },
      when: dateHelper.getTimeFromDateTimestamp(new Date()),
    };

    //-- Feature Delete -------------->
    const featureDelete: FeatureDb = {
      ...featureObj,
      lastEvent,
    };

    //-- Delete Fields Before Sending To Server ------------------>
    featureFieldsToDeleteOnServerSend.forEach((fieldToDelete) => {
      try {
        delete featureDelete?.[fieldToDelete];
      } catch (error) {
        return;
      }
    });

    //-- Event Insert ---------------------------------------------->
    const eventInsert: EventDb<FeatureLastEventIdentifierFields> = {
      ...featureObj.lastEvent,
      what: {
        ...featureObj.lastEvent.what,
        obj: { ...featureDelete },
      },
    };

    //-- State Updates ------------------------------->
    stateUpdates.featureObj = {
      ...featureDelete,
    };

    return {
      eventInsert,
      stateUpdates,
    };
  }

  enrichFeatureServerResponse(serverResponse: any) {
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
