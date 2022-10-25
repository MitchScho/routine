// //**********************************************************************************************/
// //****** User User/Database (user.model.ts) *************************************************/
// //**********************************************************************************************/

// //------------------------------------------------------------------------------------------------>
// //--- ***IMPORTANT*** ---------------------------------------------------------------------------->
// //--- Update data version whenever data schema change occurs ------------------------------------->
// //------------------------------------------------------------------------------------------------>
// export const userDataVersion = 0;
// export const userDatabaseName = 'user';
// export const userEvents = {
//   create: '[User]-Create-user',
//   update: '[User]-Update-user',
// };

// export interface UserDb {
//   id: string;
//   ids: {
//     //this can be used later to query all databases regardless of type based on unique keys
//     userId: string;
//     eventId: string; //every user (insert/update/delete) action must have an eventId corresponding to the eventDb associated with it
//     eventCorrelationId: string; //if an event/action has multiple database operations associated with the the original event an eventCorelationId will be shared among all events
//   };
//   //*** Main Fields *************************************************************************************/
//   name: string;
//   photoUrl: string;
//   //**************************************************************************************************** */
//   //** GLOBAL FIELDS ALL database inserts will have *****************************************************/
//   // every user Insert/Update/Delete will always include these fields lastEvent, createdBy, createdAt, ids,
//   // When performing any insert/update/delete actions always insert the lastEvent obj into the eventDb,
//   // MAKE SURE to include the whole user insert/update/delete object(i,e, userInsert) under lastEvent.what.obj when inserting into eventDb
//   // Make Sure to leave lastEvent.what.obj empty when inserting the user insert/update/delete object into it's user database and only include it in eventDb Insert
//   lastEvent: {
//     who?: {
//       id?: string;
//       name?: string;
//     };
//     what?: {
//       event?: string;
//       obj?: any; // this is empty on inserts/updates/deletes on single user document however when inserting into eventDB user document will exist here
//       databaseName?: string;
//       operation?: 'create' | 'update' | 'delete'; // **eventOperationOptions** *
//       dataVersion?: number;
//       dataStatus?: any; //this field can be used for migrating data later from one format to another
//       appName?: string; //this should be set in env folds as a variable
//       appVersion?: number; //this should be set in env folds as a variable
//     };
//     when?: {
//       week?: number;
//       month?: number;
//       year?: number;
//       quarter?: number;
//       day?: number;
//       timestamp?: any; //this is firebase timestamp
//     };
//   };
//   createdBy?: {
//     id?: string;
//     name?: string;
//   };
//   createdAt?: {
//     week?: number;
//     month?: number;
//     year?: number;
//     quarter?: number;
//     day?: number;
//     timestamp?: any;
//   };
// }
/*************************************************************************************************
 ** Imports                                                                                      **
 **************************************************************************************************/
//-- **Data Models** ----------------------------------------------------------------------------//
import { EventDb } from '../models/event.model';
import { initialEventDb } from '../models/event.model';
//------------------------------------------------------------------------------------------------>
//--- ***IMPORTANT*** ---------------------------------------------------------------------------->
//--- Update data version whenever data schema change occurs ------------------------------------->
//------------------------------------------------------------------------------------------------>
export const userDataVersion = 0;
export const userDatabaseName = 'user';
export const userEvents = {
  create: '[User]-Create-User',
  update: '[User]-Update-User',
  delete: '[User]-Delete-User',
};

//-- LastEvent Identifier Fields ------------------>
export interface UserLastEventIdentifierFields {
  userId?: string;
  eventId?: string;
  eventCorrelationId?: string;
}

//--- User Db Model -------------------------------------------------->
export interface UserDb {
  id?: string;
  //--- Main Database Fields --------------------------------------------->
  firstName?: string;
  lastName?: string;
  name?: string;
  password?: string;
  photoUrl?: string;

  //---------------------------------------------------------------------->
  _display?: any; //-- Local front end display(get deleted on server send)
  lastEvent?: EventDb<UserLastEventIdentifierFields>;
  createdBy?: {
    id?: string;
    name?: string;
  };
  createdAt?: {
    week?: number;
    month?: number;
    year?: number;
    quarter?: number;
    day?: number;
    timestamp?: any;
  };
}

//--- List of fields to delete when calling server -------->
export const userFieldsToDeleteOnServerSend = ['_display'];

export const initialUserLastEventIdentifierFields = {
  userId: null,
  eventId: null,
  eventCorrelationId: null,
};

export const initialUserLastEvent: EventDb<UserLastEventIdentifierFields> = {
  ...initialEventDb,
  ids: { ...initialUserLastEventIdentifierFields },
  what: {
    ...initialEventDb,
    databaseName: userDatabaseName,
  },
};

export const initialUserDb: UserDb = {
  id: null,
  //--- Main Database Fields --------------------------------------------->
  name: null,
  photoUrl: null,
  //----------------------------------------------------------------------->
  _display: null, //-- Local front end display(get deleted on server send)
  lastEvent: { ...initialUserLastEvent },
  createdBy: {
    id: null,
    name: null,
  },
  createdAt: {
    week: null,
    month: null,
    year: null,
    quarter: null,
    day: null,
    timestamp: null,
  },
};
