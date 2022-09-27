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
export const featureDataVersion = 0;
export const featureDatabaseName = 'feature';
export const featureEvents = {
  create: '[Feature]-Create-Feature',
  update: '[Feature]-Update-Feature',
  delete: '[Feature]-Delete-Feature',
};

//-- LastEvent Identifier Fields ------------------>
export interface FeatureLastEventIdentifierFields {
  featureId?: string;
  eventId?: string;
  eventCorrelationId?: string;
}

//--- Feature Db Model -------------------------------------------------->
export interface FeatureDb {
  id?: string;
  //--- Main Database Fields --------------------------------------------->
  name?: string;

  //---------------------------------------------------------------------->
  _display?: any; //-- Local front end display(get deleted on server send)
  lastEvent?: EventDb<FeatureLastEventIdentifierFields>;
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
export const featureFieldsToDeleteOnServerSend = ['_display'];

export const initialFeatureLastEventIdentifierFields = {
  featureId: null,
  eventId: null,
  eventCorrelationId: null,
};

export const initialFeatureLastEvent: EventDb<FeatureLastEventIdentifierFields> =
  {
    ...initialEventDb,
    ids: { ...initialFeatureLastEventIdentifierFields },
    what: {
      ...initialEventDb,
      databaseName: featureDatabaseName,
    },
  };

export const initialFeatureDb = {
  id: null,
  //--- Main Database Fields --------------------------------------------->
  name: null,
  //----------------------------------------------------------------------->
  _display: null, //-- Local front end display(get deleted on server send)
  lastEvent: { ...initialFeatureLastEvent },
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
