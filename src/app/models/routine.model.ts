// //**********************************************************************************************/
// //****** Routine Routine/Database (routine.model.ts) *******************************************/
// //**********************************************************************************************/

// //------------------------------------------------------------------------------------------------>
// //--- ***IMPORTANT*** ---------------------------------------------------------------------------->
// //--- Update data version whenever data schema change occurs ------------------------------------->
// //------------------------------------------------------------------------------------------------>
// export const routineDataVersion = 0;
// export const routineDatabaseName = 'routine';
// export const routineEvents = {
//   create: '[Routine]-Create-Routine',
//   update: '[Routine]-Update-Routine',
//   delete: '[Routine]-Delete-Routine',
// };

// export interface RoutineDb {
//   id: string;
//   ids: {
//     //this can be used later to query all databases based on unique keys
//     eventId: string; //every routine (insert/update/delete) action must have an eventId corresponding to the eventDb associated with it
//     eventCorrelationId: string; //if an event/action has multiple database operations associated with the the original event an eventCorelationId will be shared among all events
//     routineId: string;
//     userId: string;
//     activityIds: string[]; //ALL Activities OF ROUTINE
//   };
//   //*** Main Fields *************************************************************************************/
//   name: string;
//   description: string;
//   schedule: {
//     dayOfWeek: number; //Monday = 1, Sunday = 7
//     activityIds: string[]; //Activites for particular day
//     activitiesConfig: {
//       activityId: string;
//       startTime: any;
//       endTime: any;
//       reps: {
//         setNumber: number;
//         weightType: string; //See **repWeightType */  bodyWeight | dumbbellWeight
//         weight: number;
//         time: number;
//         distance: number;
//         repNumber: number;
//         extraInstructions: string;
//       }[];
//     }[];
//   }[];
//   //**************************************************************************************************** */
//   //** GLOBAL FIELDS ALL database inserts will have *****************************************************/
//   // every routine Insert/Update/Delete will always include these fields lastEvent, createdBy, createdAt, ids,
//   // When performing any insert/update/delete actions always insert the lastEvent obj into the eventDb,
//   // MAKE SURE to include the whole routine insert/update/delete object(i,e, userInsert) under lastEvent.what.obj when inserting into eventDb
//   // Make Sure to leave lastEvent.what.obj empty when inserting the routine insert/update/delete object into it's routine database and only include it in eventDb Insert
//   lastEvent: {
//     who?: {
//       id?: string;
//       name?: string;
//     };
//     what?: {
//       event?: string;
//       obj?: any; // this is empty on inserts/updates/deletes on single routine document however when inserting into eventDB routine document will exist here
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

// //-- Rep Weight Type ----------------------------------------------------------------------->
// export const repWeightType = {
//   bodyWeight: 'Body Weight',
//   dumbbellWeight: 'Dumbbell Weight',
// };
// export const repWeightTypeArray = [
//   repWeightType.bodyWeight,
//   repWeightType.dumbbellWeight,
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
export const routineDataVersion = 0;
export const routineDatabaseName = 'routine';
export const routineEvents = {
  create: '[Routine]-Create-Routine',
  update: '[Routine]-Update-Routine',
  delete: '[Routine]-Delete-Routine',
};

//-- LastEvent Identifier Fields ------------------>
export interface RoutineLastEventIdentifierFields {
  routineId?: string;
  eventId?: string;
  eventCorrelationId?: string;
}

//--- Routine Db Model -------------------------------------------------->
export interface RoutineDb {
  id?: string;
  //--- Main Database Fields --------------------------------------------->
  name: string;
    description: string;
    schedule: {
      dayOfWeek: number; //Monday = 1, Sunday = 7
      activityIds: string[]; //Activites for particular day
      activitiesConfig: {
        activityId: string;
        startTime: any;
        endTime: any;
        reps: {
          setNumber: number;
          weightType: string; //See **repWeightType */  bodyWeight | dumbbellWeight
          weight: number;
          time: number;
          distance: number;
          repNumber: number;
          extraInstructions: string;
        }[];
      }[];
    }[];

  //---------------------------------------------------------------------->
  _display?: any; //-- Local front end display(get deleted on server send)
  lastEvent?: EventDb<RoutineLastEventIdentifierFields>;
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
export const routineFieldsToDeleteOnServerSend = ['_display'];

export const initialRoutineLastEventIdentifierFields = {
 routineId: null,
  eventId: null,
  eventCorrelationId: null,
};

export const initialRoutineLastEvent: EventDb<RoutineLastEventIdentifierFields> =
  {
    ...initialEventDb,
    ids: { ...initialRoutineLastEventIdentifierFields },
    what: {
      ...initialEventDb,
      databaseName: routineDatabaseName,
    },
  };

export const initialRoutineDb = {
  id: null,
  //--- Main Database Fields --------------------------------------------->
  name: null,
  //----------------------------------------------------------------------->
  _display: null, //-- Local front end display(get deleted on server send)
  lastEvent: { ...initialRoutineLastEvent },
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
