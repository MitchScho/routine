/*************************************************************************************************
 ** Imports                                                                                      **
 **************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
//-- **Services/Helpers** -----------------------------------------------------------------------//
import { FirebaseHelper } from './firebase.helper';
import * as dateHelper from './date.helper';
//-- **Data Models** ----------------------------------------------------------------------------//
import { sessionFieldsToDeleteOnServerSend } from '../models/session.model';
import { SessionLastEventIdentifierFields } from '../models/session.model';
import { eventOperationOptions } from '../models/event.model';
import { environment } from '../../environments/environment';
import { sessionDatabaseName } from '../models/session.model';
import { initialEventDb } from '../models/event.model';
import { sessionDataVersion } from '../models/session.model';
import { initialSessionDb } from '../models/session.model';
import { sessionEvents } from '../models/session.model';
import { EventDb } from '../models/event.model';
import { UserDb } from '../models/user.model';
import { SessionDb } from '../models/session.model';

@Injectable({
  providedIn: 'root',
})

/*************************************************************************************************
 **  Enriches Data For Api Calls/Actions                                                         **
 **************************************************************************************************/
export class SessionDataObjHelper {
  constructor(
    private firebaseHelper: FirebaseHelper) { }

  createSession(session: SessionDb, user?: UserDb) {
    let stateUpdates: { sessionObj: SessionDb } = {
      sessionObj: initialSessionDb,
    };

    //-- Identifier Fields --------------------------------------------------->
    const sessionId = session?.id ?? this.firebaseHelper.generateFirebaseId();
    const eventCorrelationId = this.firebaseHelper.generateFirebaseId();
    const eventId = this.firebaseHelper.generateFirebaseId();

    //--- Session Obj ------------------------->
    const sessionObj: SessionDb = {
      ...initialSessionDb,
      ...session,
      id: sessionId,
      lastEvent: {
        ...session?.lastEvent,
        ids: {
          ...initialSessionDb?.lastEvent?.ids,
          ...session?.lastEvent?.ids,
          sessionId,
          eventId,
          eventCorrelationId,
          //add additional id's here
        },
      },
    };

    //-- Generate LastEvent Object ---------------------------------------->
    const lastEvent: EventDb<SessionLastEventIdentifierFields> = {
      ...initialEventDb,
      id: eventId,
      ids: sessionObj?.lastEvent?.ids,
      context: null,
      who: {
        id: user?.id ?? environment.appName,
        name: user?.name ?? environment.appName,
      },
      what: {
        ...initialEventDb?.what,
        event: sessionEvents.create,
        databaseName: sessionDatabaseName,
        operation: eventOperationOptions.create,
        dataVersion: sessionDataVersion,
      },
      when: dateHelper.getTimeFromDateTimestamp(new Date()),
    };

    //-- Session Insert ----------------------------------------->
    const sessionInsert: SessionDb = {
      ...sessionObj,
      lastEvent,
      createdBy: {
        id: user?.id ?? environment.appName,
        name: user?.name ?? environment.appName,
      },
      createdAt: dateHelper.getTimeFromDateTimestamp(new Date()),
    };

    //-- Delete Fields Before Sending To Server ------------------>
    sessionFieldsToDeleteOnServerSend.forEach((fieldToDelete) => {
      try {
        delete sessionInsert?.[fieldToDelete];
      } catch (error) {
        return;
      }
    });

    //-- Event Insert ---------------------------------------------->
    const eventInsert: EventDb<SessionLastEventIdentifierFields> = {
      ...sessionObj.lastEvent,
      what: {
        ...sessionObj.lastEvent.what,
        obj: { ...sessionInsert },
      },
    };

    //-- State Updates ---------->
    stateUpdates.sessionObj = {
      ...sessionInsert,
    };

    return {
      eventInsert,
      sessionInsert,
      stateUpdates,
    };
  }

  //-- Update session --------------------------------------------------------------//
  updateSession(
    session: SessionDb,
    originalSessionObj: SessionDb,
    user?: UserDb
  ) {
    let stateUpdates: { sessionObj: SessionDb } = {
      sessionObj: initialSessionDb,
    };

    //-- Identifier Fields --------------------------------------------------->
    const eventId = this.firebaseHelper.generateFirebaseId();
    const eventCorrelationId = this.firebaseHelper.generateFirebaseId();

    //--- Session Obj -------------------------->
    const sessionObj: SessionDb = {
      ...initialSessionDb,
      ...session,
      lastEvent: {
        ...session?.lastEvent,
        ids: {
          ...initialSessionDb?.lastEvent?.ids,
          ...originalSessionObj?.lastEvent?.ids,
          eventId,
          eventCorrelationId,
          //add additional id's here
        },
      },
    };

    //-- Generate LastEvent Object -------------------------------->
    const lastEvent: EventDb<SessionLastEventIdentifierFields> = {
      ...initialEventDb,
      id: eventId,
      ids: sessionObj?.lastEvent?.ids,
      context: null,
      who: {
        id: user?.id ?? environment.appName,
        name: user?.name ?? environment.appName,
      },
      what: {
        ...initialEventDb?.what,
        event: sessionEvents.update,
        databaseName: sessionDatabaseName,
        operation: eventOperationOptions.update,
        dataVersion: sessionDataVersion,
      },
      when: dateHelper.getTimeFromDateTimestamp(new Date()),
    };

    //-- Session Update ------------->
    const sessionUpdate: SessionDb = {
      ...sessionObj,
      lastEvent,
    };

    //-- Delete Fields Before Sending To Server ------------------>
    sessionFieldsToDeleteOnServerSend.forEach((fieldToDelete) => {
      try {
        delete sessionUpdate?.[fieldToDelete];
      } catch (error) {
        return;
      }
    });

    //-- Event Insert ---------------------------------------------->
    const eventInsert: EventDb<SessionLastEventIdentifierFields> = {
      ...sessionObj.lastEvent,
      what: {
        ...sessionObj.lastEvent.what,
        obj: { ...sessionUpdate },
      },
    };

    //-- State Updates ---------->
    stateUpdates.sessionObj = {
      ...sessionUpdate,
    };

    return {
      eventInsert,
      sessionUpdate,
      stateUpdates,
    };
  }

  //-- Delete session --------------------------------------------------------//
  deleteSession(session: SessionDb, user?: UserDb) {
    let stateUpdates: { sessionObj: SessionDb } = { sessionObj: null };

    //-- Identifier Fields --------------------------------------------------->
    const eventId = this.firebaseHelper.generateFirebaseId();
    const eventCorrelationId = this.firebaseHelper.generateFirebaseId();

    //--- Session Obj -------------------------->
    const sessionObj: SessionDb = {
      ...initialSessionDb,
      ...session,
      lastEvent: {
        ...session?.lastEvent,
        ids: {
          ...initialSessionDb?.lastEvent?.ids,
          ...session?.lastEvent?.ids,
          eventId,
          eventCorrelationId,
          //add additional id's here
        },
      },
    };

    //-- Generate LastEvent Object -------------------------------->
    const lastEvent: EventDb<SessionLastEventIdentifierFields> = {
      ...initialEventDb,
      id: eventId,
      ids: sessionObj?.lastEvent?.ids,
      context: null,
      who: {
        id: user?.id ?? environment.appName,
        name: user?.name ?? environment.appName,
      },
      what: {
        ...initialEventDb?.what,
        event: sessionEvents.delete,
        databaseName: sessionDatabaseName,
        operation: eventOperationOptions.delete,
        dataVersion: sessionDataVersion,
      },
      when: dateHelper.getTimeFromDateTimestamp(new Date()),
    };

    //-- Session Delete -------------->
    const sessionDelete: SessionDb = {
      ...sessionObj,
      lastEvent,
    };

    //-- Delete Fields Before Sending To Server ------------------>
    sessionFieldsToDeleteOnServerSend.forEach((fieldToDelete) => {
      try {
        delete sessionDelete?.[fieldToDelete];
      } catch (error) {
        return;
      }
    });

    //-- Event Insert ---------------------------------------------->
    const eventInsert: EventDb<SessionLastEventIdentifierFields> = {
      ...sessionObj.lastEvent,
      what: {
        ...sessionObj.lastEvent.what,
        obj: { ...sessionDelete },
      },
    };

    //-- State Updates ---------->
    stateUpdates.sessionObj = {
      ...sessionDelete,
    };

    return {
      eventInsert,
      stateUpdates,
    };
  }

  enrichSessionServerResponse(serverResponse: any) {
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
