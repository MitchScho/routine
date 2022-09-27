/*************************************************************************************************
 ** Imports                                                                                      **
 **************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
//-- **Services/Helpers** -----------------------------------------------------------------------//
import { FirebaseHelper } from '../helpers/firebase.helper';
import * as dateHelper from '../helpers/date.helper';
//-- **Data Models** ----------------------------------------------------------------------------//
import { errorFieldsToDeleteOnServerSend } from './../models/error.model';
import { environment } from '../../environments/environment';
import { initialErrorDb } from './../models/error.model';
import { ErrorDb } from '../models/error.model';

@Injectable({
  providedIn: 'root',
})

/*************************************************************************************************
 **  Enriches Data For Api Calls/Actions                                                         **
 **************************************************************************************************/
export class ErrorDataObjHelper {
  constructor(private firebaseHelper: FirebaseHelper) {}

  createError(error: any, actionType: string, payload: any, extraDetails?: any) {
    //-- Identifier Fields --------------------------------------------------->
    const errorId = error?.id ?? this.firebaseHelper.generateFirebaseId();
    const eventCorrelationId =
      payload?.lastEvent?.ids?.eventCorrelationId ??
      this.firebaseHelper.generateFirebaseId();
    const eventId = this.firebaseHelper.generateFirebaseId();

    const createdBy = payload?.lastEvent?.createdBy?.id != null
      ? { ...payload?.lastEvent?.createdBy }
      : { id: environment?.appName, name: environment?.appName };

    //--- Error Insert ------------------------->
    const errorInsert: ErrorDb = {
      ...initialErrorDb,
      ...error,
      id: errorId,
    //---- Main Flieds ------
      actionType,
      payload,
      errorMessage: error?.message,
      errorStack: error,
      extraDetails: extraDetails ?? null,
      lastEvent: {
        ...error?.lastEvent,
        ...payload?.lastEvent,
        ids: {
          ...initialErrorDb?.lastEvent?.ids,
          ...error?.lastEvent?.ids,
          ...payload?.lastEvent?.ids,
          errorId,
          eventId,
          eventCorrelationId,

          //add additional id's here
        },
        createdBy,
        createdAt: dateHelper.getTimeFromDateTimestamp(new Date()),
      },
    };

    //-- Delete Fields Before Sending To Server ------------------>
    errorFieldsToDeleteOnServerSend.forEach((fieldToDelete) => {
      try {
        delete errorInsert?.[fieldToDelete];
      } catch (error) {
        return;
      }
    });


    return {
      errorInsert,
    };
  }
}
