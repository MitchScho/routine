//**********************************************************************************************/
//****** Session Feature/Database (session.model.ts) *******************************************/
//**********************************************************************************************/
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
export const sessionDataVersion = 0;
export const sessionDatabaseName = 'session';
export const sessionEvents = {
  create: '[Session]-Create-Session',
  update: '[Session]-Update-Session',
  delete: '[Session]-Delete-Session',
};


//-- LastEvent Identifier Fields ------------------>
export interface SessionLastEventIdentifierFields {
  sessionId?: string;
  eventId?: string; //every user (insert/update/delete) action must have an eventId corresponding to the eventDb associated with it
  eventCorrelationId?: string; //if an event/action has multiple database operations associated with the the original event an eventCorelationId will be shared among all events
  userId: string;
  routineId: string;
  activityIds: string[];
  completedActivityIds: string[];
  notCompletedActivityIds: [];
}

//--- Session Db Model -------------------------------------------------->
export interface SessionDb {
  id?: string;
  //*** Main Fields *************************************************************************************/
  name?: string;
  _display?: any; //-- Local front end display(get deleted on server send)

  //**************************************************************************************************** */
  //** GLOBAL FIELDS ALL database inserts will have *****************************************************/
  // every session Insert/Update/Delete will always include these fields lastEvent, createdBy, createdAt, ids,
  // When performing any insert/update/delete actions always insert the lastEvent obj into the eventDb,
  // MAKE SURE to include the whole session insert/update/delete object(i,e, userInsert) under lastEvent.what.obj when inserting into eventDb
  // Make Sure to leave lastEvent.what.obj empty when inserting the session insert/update/delete object into it's session database and only include it in eventDb Insert
  lastEvent?: EventDb<SessionLastEventIdentifierFields>;
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
export const sessionFieldsToDeleteOnServerSend = ['_display'];

export const initialSessionLastEventIdentifierFields = {
  sessionId: null,
  eventId: null,
  eventCorrelationId: null,
  userId: null,
  routineId: null,
  activityIds: null,
  completedActivityIds: null,
  notCompletedActivityIds: null,
};

export const initialSessionLastEvent: EventDb<SessionLastEventIdentifierFields> = {
  ...initialEventDb,
  ids: { ...initialSessionLastEventIdentifierFields },
  what: {
    ...initialEventDb,
    databaseName: sessionDatabaseName
  }
};

export const initialSessionDb = {
  id: null,
  //-------------------------------------->

  //--------------------------------------->
  lastEvent: { ...initialSessionLastEvent },
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
    timestamp: null
  }
};
