/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { take, tap, switchMap, catchError, withLatestFrom } from 'rxjs/operators';
//-- **Data Models** ----------------------------------------------------------------------------//
import { EventDb } from '../models/event.model';
import { RoutineDb, RoutineLastEventIdentifierFields } from '../models/routine.model';
//-- **Services/Helpers** ------------------------------------------------------------------------//
import { RoutineDataObjHelper } from '../helpers/routine-data-obj.helper';
import { UiHelper } from '../helpers/ui.helper';

@Injectable({
  providedIn: 'root'
})

export class RoutineActions {
  constructor(
    private routineService: RoutineService,
    private routineState: RoutineState,
    private routineDataObjHelper: RoutineDataObjHelper,
    private uiHelper: UiHelper
  ) { }

  createRoutine(routineObj: RoutineDb, currentUser: {id:string, name: string}) {
    //-- Enrich Data before sending to backend ------------------------->
    const dataObj = this.routineDataObjHelper.createRoutine(routineObj);
    const routineInsert = dataObj.routineInsert;
    const eventInsert = dataObj.eventInsert;

    //--- Call Create Routine Server API ------------------------------------->
    return this.routineService.createRoutine(routineInsert, eventInsert).pipe(
      tap(() => {
        //-- Show loader -------------------->
        this.uiHelper.showLoader('Loading...')
      }),
      take(1), // only take first response from api and close connection to prevent memory leaks
      withLatestFrom(this.routineState.routineList$), // grab current state value of old routineList
      switchMap((responseFromServer, oldRoutineList) => {

        //-- On Success update routine list state variable with new routineObj -->
        const updatedRoutineList = [...oldRoutineList, {...routineInsert}];

        //-- Set new RoutineList state Variables ----------->
        this.routineState.setRoutineList(updatedRoutineList)
        this.uiHelper.hideLoader();
      }),
      //-- Catch Error -------------------------------->
      catchError(error => {
        console.log('error in createRoutine$', error);
        this.uiHelper.hideLoader();
        this.uiHelper.displayErrorAlert(error.message);

        return this.errorActions.createError(error, insertIntoErrorDbFlag: true)
      })
    )
  }


}
