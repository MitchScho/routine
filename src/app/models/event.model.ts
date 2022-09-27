//**********************************************************************************************/
//****** Event Feature/Database (event.model.ts) *******************************************/
//**********************************************************************************************/
// Anytime anyone inserts/updates/delete from ANY database (i.e. User Create, User Update)
// an event object will be inserted into the eventDb to be used as logs.  this can be derived from
// the lastEvent Obj that exists globally on every database along with createdBy, createdAt, and ids
// I.E.
// If you want to add a new document such as 'user insert' you must also insert the
// lastEvent from the userInsert obj into the event database. eventId + corelationId
// must exist on all objects
//------------------------------------------------------------------------------------------------>
//--- ***IMPORTANT*** ---------------------------------------------------------------------------->
//--- Update data version whenever data schema change occurs ------------------------------------->
//------------------------------------------------------------------------------------------------>
export const eventDataVersion = 0;
export const eventDatabaseName = 'event';
export const eventEvents = {
  create: '[event]-Create-event',
};

/*************************************************************************************************
 ** Imports                                                                                      **
 **************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { environment } from '../../environments/environment';

export interface EventDb<Type> {
  id?: string;
  ids?: Type; //  See **EventIdentifierFields** For all possible options
  context?: any;
  who?: {
    id?: string;
    name?: string;
  };
  what?: {
    event?: string;
    obj?: any;
    databaseName?: string;
    operation?: string; // **eventOperationOptions***
    dataVersion?: number;
    dataStatus?: any;
    appName?: string;
    appVersion?: number;
  };
  when?: {
    week?: number;
    month?: number;
    year?: number;
    quarter?: number;
    day?: number;
    timestamp?: any;
  };
}

export const initialEventDb = {
  id: null,
  ids: null,
  context: null,
  who: {
    id: null,
    name: null,
  },
  what: {
    event: null,
    objType: null,
    obj: null,
    operation: null,
    dataVersion: 0,
    dataStatus: null,
    appName: environment.appName,
    appVersion: environment.appVersion,
  },
  when: {
    week: null,
    month: null,
    year: null,
    quarter: null,
    day: null,
    timestamp: null,
  },
};

export const initialWhenEvent = {
  week: null,
  month: null,
  year: null,
  quarter: null,
  day: null,
  timestamp: null,
};

export const eventOperationOptions = {
  create: 'create',
  update: 'update',
  delete: 'delete',
};
