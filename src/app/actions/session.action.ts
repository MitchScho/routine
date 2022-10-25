/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { take, tap, switchMap, catchError, withLatestFrom } from 'rxjs/operators';
//-- **Data Models** ----------------------------------------------------------------------------//
import { EventDb } from '../models/event.model';
import { SessionDb, SessionLastEventIdentifierFields } from '../models/session.model';
//-- **Services/Helpers** ------------------------------------------------------------------------//
import { SessionDataObjHelper } from './../helpers/session-data-obj.helper';
import { UiHelper } from '../helpers/ui.helper';
import { SessionService } from '../services/session.service';

@Injectable({
  providedIn: 'root'
})

export class SessionActions {
  constructor(
    private sessionService: SessionService,
    private sessionState: SessionState,
    private sessionDataObjHelper: SessionDataObjHelper,
    private uiHelper: UiHelper
  ) { }

  createSession(sessionObj: SessionDb, currentUser: {id:string, name: string}) {
    //-- Enrich Data before sending to backend ------------------------->
    const dataObj = this.sessionDataObjHelper.createSession(sessionObj);
    const sessionInsert = dataObj.sessionInsert;
    const eventInsert = dataObj.eventInsert;

    //--- Call Create Session Server API ------------------------------------->
    return this.sessionService.createSession(sessionInsert, eventInsert).pipe(
      tap(() => {
        //-- Show loader -------------------->
        this.uiHelper.showLoader('Loading...')
      }),
      take(1), // only take first response from api and close connection to prevent memory leaks
      withLatestFrom(this.sessionState.sessionList$), // grab current state value of old sessionList
      switchMap((responseFromServer, oldSessionList) => {

        //-- On Success update session list state variable with new sessionObj -->
        const updatedSessionList = [...oldSessionList, {...sessionInsert}];

        //-- Set new SessionList state Variables ----------->
        this.sessionState.setSessionList(updatedSessionList)
        this.uiHelper.hideLoader();
      }),
      //-- Catch Error -------------------------------->
      catchError(error => {
        console.log('error in createSession$', error);
        this.uiHelper.hideLoader();
        this.uiHelper.displayErrorAlert(error.message);

        return this.errorActions.createError(error, insertIntoErrorDbFlag: true)
      })
    )
  }


}
