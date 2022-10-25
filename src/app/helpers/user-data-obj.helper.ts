/*************************************************************************************************
 ** Imports                                                                                      **
 **************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
//-- **Services/Helpers** -----------------------------------------------------------------------//
import { FirebaseHelper } from '../helpers/firebase.helper';
import * as dateHelper from '../helpers/date.helper';
//-- **Data Models** ----------------------------------------------------------------------------//
import { userFieldsToDeleteOnServerSend } from './../models/user.model';
import { UserLastEventIdentifierFields } from './../models/user.model';
import { eventOperationOptions } from '../models/event.model';
import { environment } from '../../environments/environment';
import { userDatabaseName } from './../models/user.model';
import { initialEventDb } from '../models/event.model';
import { userDataVersion } from './../models/user.model';
import { initialUserDb } from './../models/user.model';
import { userEvents } from './../models/user.model';
import { EventDb } from '../models/event.model';
import { UserDb } from '../models/user.model';


@Injectable({
  providedIn: 'root',
})

/*************************************************************************************************
 **  Enriches Data For Api Calls/Actions                                                         **
 **************************************************************************************************/
export class UserDataObjHelper {
  constructor(private firebaseHelper: FirebaseHelper) {}

  createUser(user: UserDb) {
    let stateUpdates: { userObj: UserDb } = {
      userObj: initialUserDb,
    };

    //-- Identifier Fields --------------------------------------------------->
    const userId = user?.id ?? this.firebaseHelper.generateFirebaseId();
    const eventCorrelationId = this.firebaseHelper.generateFirebaseId();
    const eventId = this.firebaseHelper.generateFirebaseId();

    //--- User Obj ------------------------->
    const userObj: UserDb = {
      ...initialUserDb,
      ...user,
      id: userId,
      lastEvent: {
        ...user?.lastEvent,
        ids: {
          ...initialUserDb?.lastEvent?.ids,
          ...user?.lastEvent?.ids,
          userId,
          eventId,
          eventCorrelationId,
          //add additional id's here
        },
      },
    };

    //-- Generate LastEvent Object ---------------------------------------->
    const lastEvent: EventDb<UserLastEventIdentifierFields> = {
      ...initialEventDb,
      id: eventId,
      ids: userObj?.lastEvent?.ids,
      context: null,
      who: {
        id: user?.id ?? environment.appName,
        name: user?.name ?? environment.appName,
      },
      what: {
        ...initialEventDb?.what,
        event: userEvents.create,
        databaseName: userDatabaseName,
        operation: eventOperationOptions.create,
        dataVersion: userDataVersion,
      },
      when: dateHelper.getTimeFromDateTimestamp(new Date()),
    };

    //-- User Insert ----------------------------------------->
    const userInsert: UserDb = {
      ...userObj,
      lastEvent,
      createdBy: {
        id: user?.id ?? environment.appName,
        name: user?.name ?? environment.appName,
      },
      createdAt: dateHelper.getTimeFromDateTimestamp(new Date()),
    };

    //-- Delete Fields Before Sending To Server ------------------>
    userFieldsToDeleteOnServerSend.forEach((fieldToDelete) => {
      try {
        delete userInsert?.[fieldToDelete];
      } catch (error) {
        return;
      }
    });

    //-- Event Insert ---------------------------------------------->
    const eventInsert: EventDb<UserLastEventIdentifierFields> = {
      ...userObj.lastEvent,
      what: {
        ...userObj.lastEvent.what,
        obj: { ...userInsert },
      },
    };

    //-- State Updates ---------->
    stateUpdates.userObj = {
      ...userInsert,
    };

    return {
      eventInsert,
      userInsert,
      stateUpdates,
    };
  }

  //-- Update user --------------------------------------------------------------//
  updateUser(
    user: UserDb,
    originalUserObj: UserDb

  ) {
    let stateUpdates: { userObj: UserDb } = {
      userObj: initialUserDb,
    };

    //-- Identifier Fields --------------------------------------------------->
    const eventId = this.firebaseHelper.generateFirebaseId();
    const eventCorrelationId = this.firebaseHelper.generateFirebaseId();

    //--- User Obj -------------------------->
    const userObj: UserDb = {
      ...initialUserDb,
      ...user,
      lastEvent: {
        ...user?.lastEvent,
        ids: {
          ...initialUserDb?.lastEvent?.ids,
          ...originalUserObj?.lastEvent?.ids,
          eventId,
          eventCorrelationId,
          //add additional id's here
        },
      },
    };

    //-- Generate LastEvent Object -------------------------------->
    const lastEvent: EventDb<UserLastEventIdentifierFields> = {
      ...initialEventDb,
      id: eventId,
      ids: userObj?.lastEvent?.ids,
      context: null,
      who: {
        id: user?.id ?? environment.appName,
        name: user?.name ?? environment.appName,
      },
      what: {
        ...initialEventDb?.what,
        event: userEvents.update,
        databaseName: userDatabaseName,
        operation: eventOperationOptions.update,
        dataVersion: userDataVersion,
      },
      when: dateHelper.getTimeFromDateTimestamp(new Date()),
    };

    //-- User Update ------------->
    const userUpdate: UserDb = {
      ...userObj,
      lastEvent,
    };

    //-- Delete Fields Before Sending To Server ------------------>
    userFieldsToDeleteOnServerSend.forEach((fieldToDelete) => {
      try {
        delete userUpdate?.[fieldToDelete];
      } catch (error) {
        return;
      }
    });

    //-- Event Insert ---------------------------------------------->
    const eventInsert: EventDb<UserLastEventIdentifierFields> = {
      ...userObj.lastEvent,
      what: {
        ...userObj.lastEvent.what,
        obj: { ...userUpdate },
      },
    };

    //-- State Updates ---------->
    stateUpdates.userObj = {
      ...userUpdate,
    };

    return {
      eventInsert,
      userUpdate,
      stateUpdates,
    };
  }

  //-- Delete user --------------------------------------------------------//
  deleteUser( user?: UserDb) {
    let stateUpdates: { userObj: UserDb } = { userObj: null };

    //-- Identifier Fields --------------------------------------------------->
    const eventId = this.firebaseHelper.generateFirebaseId();
    const eventCorrelationId = this.firebaseHelper.generateFirebaseId();

    //--- User Obj -------------------------->
    const userObj: UserDb = {
      ...initialUserDb,
      ...user,
      lastEvent: {
        ...user?.lastEvent,
        ids: {
          ...initialUserDb?.lastEvent?.ids,
          ...user?.lastEvent?.ids,
          eventId,
          eventCorrelationId,
          //add additional id's here
        },
      },
    };

    //-- Generate LastEvent Object -------------------------------->
    const lastEvent: EventDb<UserLastEventIdentifierFields> = {
      ...initialEventDb,
      id: eventId,
      ids: userObj?.lastEvent?.ids,
      context: null,
      who: {
        id: user?.id ?? environment.appName,
        name: user?.name ?? environment.appName,
      },
      what: {
        ...initialEventDb?.what,
        event: userEvents.delete,
        databaseName: userDatabaseName,
        operation: eventOperationOptions.delete,
        dataVersion: userDataVersion,
      },
      when: dateHelper.getTimeFromDateTimestamp(new Date()),
    };

    //-- User Delete -------------->
    const userDelete: UserDb = {
      ...userObj,
      lastEvent,
    };

    //-- Delete Fields Before Sending To Server ------------------>
    userFieldsToDeleteOnServerSend.forEach((fieldToDelete) => {
      try {
        delete userDelete?.[fieldToDelete];
      } catch (error) {
        return;
      }
    });

    //-- Event Insert ---------------------------------------------->
    const eventInsert: EventDb<UserLastEventIdentifierFields> = {
      ...userObj.lastEvent,
      what: {
        ...userObj.lastEvent.what,
        obj: { ...userDelete },
      },
    };

    //-- State Updates ------------------------------->
    stateUpdates.userObj = {
      ...userDelete,
    };

    return {
      eventInsert,
      stateUpdates,
    };
  }

  enrichUserServerResponse(serverResponse: any) {
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
