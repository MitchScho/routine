//**********************************************************************************************/
//****** Activity Activity/Database (activity.model.ts) *****************************************/
//**********************************************************************************************/

//------------------------------------------------------------------------------------------------>
//--- ***IMPORTANT*** ---------------------------------------------------------------------------->
//--- Update data version whenever data schema change occurs ------------------------------------->
//------------------------------------------------------------------------------------------------>
// export const activityDataVersion = 0;
// export const activityDatabaseName = 'activity';
// export const activityEvents = {
//   create: '[Activity]-Create-Activity',
//   update: '[Activity]-Update-Activity',
//   delete: '[Activity]-Delete-Activity',
// };

// export interface ActivityDb {
//   id: string;
//   ids: {
//     //this can be used later to query all databases regardless of type based on unique keys
//     eventId: string; //every activity (insert/update/delete) action must have an eventId corresponding to the eventDb associated with it
//     eventCorrelationId: string; //if an event/action has multiple database operations associated with the the original event an eventCorelationId will be shared among all events
//     activityId: string;
//     userId: string;
//   };
//   //*** Main Fields *************************************************************************************/
//   name: string;
//   description: string;
//   instructionVideo: string;
//   type: string; //see **activityTypeObj**
//   trackingConfig: {
//     distance: boolean;
//     time: boolean;
//     weight: boolean;
//   };
//   steps: {
//     name: string;
//     description?: string;
//   }[];
//   //**************************************************************************************************** */
//   //** GLOBAL FIELDS ALL database inserts will have *****************************************************/
//   // every activity Insert/Update/Delete will always include these fields lastEvent, createdBy, createdAt, ids,
//   // When performing any insert/update/delete actions always insert the lastEvent obj into the eventDb,
//   // MAKE SURE to include the whole activity insert/update/delete object(i,e, userInsert) under lastEvent.what.obj when inserting into eventDb
//   // Make Sure to leave lastEvent.what.obj empty when inserting the activity insert/update/delete object into it's activity database and only include it in eventDb Insert
//   lastEvent: {
//     who?: {
//       id?: string;
//       name?: string;
//     };
//     what?: {
//       event?: string;
//       obj?: any; // this is empty on inserts/updates/deletes on single activity document however when inserting into eventDB activity document will exist here
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

// //-- Activity Type ------------------>
// export const activityTypeObj = {
//   physical: 'physical',
//   mental: 'mental',
//   intellectual: 'intellectual',
// };
// export const activityTypeArray = [
//   activityTypeObj.physical,
//   activityTypeObj.mental,
//   activityTypeObj.intellectual,
// ];
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
export const activityDataVersion = 0;
export const activityDatabaseName = 'activity';
export const activityEvents = {
  create: '[Activity]-Create-Activity',
  update: '[Activity]-Update-Activity',
  delete: '[Activity]-Delete-Activity',
};

//-- LastEvent Identifier Fields ------------------>
export interface ActivityLastEventIdentifierFields {
  activityId?: string;
  eventId?: string;
  eventCorrelationId?: string;
}

//--- Activity Db Model -------------------------------------------------->
export interface ActivityDb {
  id?: string;
  //--- Main Database Fields --------------------------------------------->
  name: string;
  description: string;
  type: string; //see **activityTypeObj**
  trackingConfig: {
    distance: boolean;
    time: boolean;
    weight: boolean;
  };
  steps: {
    name: string;
    description?: string;
    instructionVideo?: string;
  }[];

  //---------------------------------------------------------------------->
  _display?: any; //-- Local front end display(get deleted on server send)
  lastEvent?: EventDb<ActivityLastEventIdentifierFields>;
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
export const activityFieldsToDeleteOnServerSend = ['_display'];

export const initialActivityLastEventIdentifierFields = {
  activityId: null,
  eventId: null,
  eventCorrelationId: null,
};

export const initialActivityLastEvent: EventDb<ActivityLastEventIdentifierFields> =
  {
    ...initialEventDb,
    ids: { ...initialActivityLastEventIdentifierFields },
    what: {
      ...initialEventDb,
      databaseName: activityDatabaseName,
    },
  };

export const initialActivityDb = {
  id: null,
  //--- Main Database Fields --------------------------------------------->
  name: null,
  //----------------------------------------------------------------------->
  _display: null, //-- Local front end display(get deleted on server send)
  lastEvent: { ...initialActivityLastEvent },
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

