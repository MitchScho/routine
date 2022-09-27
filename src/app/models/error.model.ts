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
export const errorDataVersion = 0;
export const errorDatabaseName = 'error';
export const errorEvents = {
  create: '[Error]-Create-Error',
  update: '[Error]-Update-Error',
  delete: '[Error]-Delete-Error',
};

//-- LastEvent Identifier Fields ------------------>
export interface ErrorLastEventIdentifierFields {
  errorId?: string;
  eventId?: string;
  eventCorrelationId?: string;
}

//--- Error Db Model -------------------------------------------------->
export interface ErrorDb {
  id?: string;
//--- Main Db Fields ----------------------------------
  actionType?: any;
  payload?: any;
  errorMessage?: any;
  errorStack?: any;
  extraDetails?: any;
  //---------------------------------------------------------------------->
  _display?: any; //-- Local front end display(get deleted on server send)
  lastEvent?: EventDb<ErrorLastEventIdentifierFields>;
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
export const errorFieldsToDeleteOnServerSend = ['_display'];

export const initialErrorLastEventIdentifierFields = {
  errorId: null,
  eventId: null,
  eventCorrelationId: null,
};

export const initialErrorLastEvent: EventDb<ErrorLastEventIdentifierFields> =
  {
    ...initialEventDb,
    ids: { ...initialErrorLastEventIdentifierFields },
    what: {
      ...initialEventDb,
      databaseName: errorDatabaseName,
    },
  };

export const initialErrorDb = {
  id: null,
  //--- Main Database Fields --------------------------------------------->
  actionType: null,
    payload: null,
    errorMessage: null,
    errorStack: null,
    extraDetails: null,
  //----------------------------------------------------------------------->
  _display: null, //-- Local front end display(get deleted on server send)
  lastEvent: { ...initialErrorLastEvent },
  createdBy: {
    id: null,
    name: null,},
  createdAt: {
    week: null,
    month: null,
    year: null,
    quarter: null,
    day: null,
    timestamp: null,
  },
};

