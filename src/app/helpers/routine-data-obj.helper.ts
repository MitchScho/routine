/*************************************************************************************************
 ** Imports                                                                                      **
 **************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
//-- **Services/Helpers** -----------------------------------------------------------------------//
import { FirebaseHelper } from '../helpers/firebase.helper';
import * as dateHelper from '../helpers/date.helper';
//-- **Data Models** ----------------------------------------------------------------------------//
import { routineFieldsToDeleteOnServerSend } from './../models/routine.model';
import { RoutineLastEventIdentifierFields } from './../models/routine.model';
import { eventOperationOptions } from '../models/event.model';
import { environment } from '../../environments/environment';
import { routineDatabaseName } from './../models/routine.model';
import { initialEventDb } from '../models/event.model';
import { routineDataVersion } from './../models/routine.model';
import { initialRoutineDb } from './../models/routine.model';
import { routineEvents } from './../models/routine.model';
import { EventDb } from '../models/event.model';
import { UserDb } from '../models/user.model';
import { RoutineDb } from '../models/routine.model';

@Injectable({
  providedIn: 'root',
})

/*************************************************************************************************
 **  Enriches Data For Api Calls/Actions                                                         **
 **************************************************************************************************/
export class RoutineDataObjHelper {
  constructor(private firebaseHelper: FirebaseHelper) {}

  createRoutine(routine: RoutineDb, user?: UserDb) {
    let stateUpdates: { routineObj: RoutineDb } = {
      routineObj: initialRoutineDb,
    };

    //-- Identifier Fields --------------------------------------------------->
    const routineId = routine?.id ?? this.firebaseHelper.generateFirebaseId();
    const eventCorrelationId = this.firebaseHelper.generateFirebaseId();
    const eventId = this.firebaseHelper.generateFirebaseId();

    //--- Routine Obj ------------------------->
    const routineObj: RoutineDb = {
      ...initialRoutineDb,
      ...routine,
      id: routineId,
      lastEvent: {
        ...routine?.lastEvent,
        ids: {
          ...initialRoutineDb?.lastEvent?.ids,
          ...routine?.lastEvent?.ids,
          routineId,
          eventId,
          eventCorrelationId,
          //add additional id's here
        },
      },
    };

    //-- Generate LastEvent Object ---------------------------------------->
    const lastEvent: EventDb<RoutineLastEventIdentifierFields> = {
      ...initialEventDb,
      id: eventId,
      ids: routineObj?.lastEvent?.ids,
      context: null,
      who: {
        id: user?.id ?? environment.appName,
        name: user?.name ?? environment.appName,
      },
      what: {
        ...initialEventDb?.what,
        event: routineEvents.create,
        databaseName: routineDatabaseName,
        operation: eventOperationOptions.create,
        dataVersion: routineDataVersion,
      },
      when: dateHelper.getTimeFromDateTimestamp(new Date()),
    };

    //-- Routine Insert ----------------------------------------->
    const routineInsert: RoutineDb = {
      ...routineObj,
      lastEvent,
      createdBy: {
        id: user?.id ?? environment.appName,
        name: user?.name ?? environment.appName,
      },
      createdAt: dateHelper.getTimeFromDateTimestamp(new Date()),
    };

    //-- Delete Fields Before Sending To Server ------------------>
    routineFieldsToDeleteOnServerSend.forEach((fieldToDelete) => {
      try {
        delete routineInsert?.[fieldToDelete];
      } catch (error) {
        return;
      }
    });

    //-- Event Insert ---------------------------------------------->
    const eventInsert: EventDb<RoutineLastEventIdentifierFields> = {
      ...routineObj.lastEvent,
      what: {
        ...routineObj.lastEvent.what,
        obj: { ...routineInsert },
      },
    };

    //-- State Updates ---------->
    stateUpdates.routineObj = {
      ...routineInsert,
    };

    return {
      eventInsert,
      routineInsert,
      stateUpdates,
    };
  }

  //-- Update routine --------------------------------------------------------------//
  updateRoutine(
    routine: RoutineDb,
    originalRoutineObj: RoutineDb,
    user?: UserDb
  ) {
    let stateUpdates: { routineObj: RoutineDb } = {
      routineObj: initialRoutineDb,
    };

    //-- Identifier Fields --------------------------------------------------->
    const eventId = this.firebaseHelper.generateFirebaseId();
    const eventCorrelationId = this.firebaseHelper.generateFirebaseId();

    //--- Routine Obj -------------------------->
    const routineObj: RoutineDb = {
      ...initialRoutineDb,
      ...routine,
      lastEvent: {
        ...routine?.lastEvent,
        ids: {
          ...initialRoutineDb?.lastEvent?.ids,
          ...originalRoutineObj?.lastEvent?.ids,
          eventId,
          eventCorrelationId,
          //add additional id's here
        },
      },
    };

    //-- Generate LastEvent Object -------------------------------->
    const lastEvent: EventDb<RoutineLastEventIdentifierFields> = {
      ...initialEventDb,
      id: eventId,
      ids: routineObj?.lastEvent?.ids,
      context: null,
      who: {
        id: user?.id ?? environment.appName,
        name: user?.name ?? environment.appName,
      },
      what: {
        ...initialEventDb?.what,
        event: routineEvents.update,
        databaseName: routineDatabaseName,
        operation: eventOperationOptions.update,
        dataVersion: routineDataVersion,
      },
      when: dateHelper.getTimeFromDateTimestamp(new Date()),
    };

    //-- Routine Update ------------->
    const routineUpdate: RoutineDb = {
      ...routineObj,
      lastEvent,
    };

    //-- Delete Fields Before Sending To Server ------------------>
    routineFieldsToDeleteOnServerSend.forEach((fieldToDelete) => {
      try {
        delete routineUpdate?.[fieldToDelete];
      } catch (error) {
        return;
      }
    });

    //-- Event Insert ---------------------------------------------->
    const eventInsert: EventDb<RoutineLastEventIdentifierFields> = {
      ...routineObj.lastEvent,
      what: {
        ...routineObj.lastEvent.what,
        obj: { ...routineUpdate },
      },
    };

    //-- State Updates ---------->
    stateUpdates.routineObj = {
      ...routineUpdate,
    };

    return {
      eventInsert,
      routineUpdate,
      stateUpdates,
    };
  }

  //-- Delete routine --------------------------------------------------------//
  deleteRoutine(routine: RoutineDb, user?: UserDb) {
    let stateUpdates: { routineObj: RoutineDb } = { routineObj: null };

    //-- Identifier Fields --------------------------------------------------->
    const eventId = this.firebaseHelper.generateFirebaseId();
    const eventCorrelationId = this.firebaseHelper.generateFirebaseId();

    //--- Routine Obj -------------------------->
    const routineObj: RoutineDb = {
      ...initialRoutineDb,
      ...routine,
      lastEvent: {
        ...routine?.lastEvent,
        ids: {
          ...initialRoutineDb?.lastEvent?.ids,
          ...routine?.lastEvent?.ids,
          eventId,
          eventCorrelationId,
          //add additional id's here
        },
      },
    };

    //-- Generate LastEvent Object -------------------------------->
    const lastEvent: EventDb<RoutineLastEventIdentifierFields> = {
      ...initialEventDb,
      id: eventId,
      ids: routineObj?.lastEvent?.ids,
      context: null,
      who: {
        id: user?.id ?? environment.appName,
        name: user?.name ?? environment.appName,
      },
      what: {
        ...initialEventDb?.what,
        event: routineEvents.delete,
        databaseName: routineDatabaseName,
        operation: eventOperationOptions.delete,
        dataVersion: routineDataVersion,
      },
      when: dateHelper.getTimeFromDateTimestamp(new Date()),
    };

    //-- Routine Delete -------------->
    const routineDelete: RoutineDb = {
      ...routineObj,
      lastEvent,
    };

    //-- Delete Fields Before Sending To Server ------------------>
    routineFieldsToDeleteOnServerSend.forEach((fieldToDelete) => {
      try {
        delete routineDelete?.[fieldToDelete];
      } catch (error) {
        return;
      }
    });

    //-- Event Insert ---------------------------------------------->
    const eventInsert: EventDb<RoutineLastEventIdentifierFields> = {
      ...routineObj.lastEvent,
      what: {
        ...routineObj.lastEvent.what,
        obj: { ...routineDelete },
      },
    };

    //-- State Updates ---------->
    stateUpdates.routineObj = {
      ...routineDelete,
    };

    return {
      eventInsert,
      stateUpdates,
    };
  }

  enrichRoutineServerResponse(serverResponse: any) {
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
