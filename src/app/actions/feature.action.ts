/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { take, tap, switchMap, catchError, withLatestFrom } from 'rxjs/operators';
//-- **Data Models** ----------------------------------------------------------------------------//
import { EventDb } from '../models/event.model';
import { FeatureDb, FeatureLastEventIdentifierFields } from '../models/feature.model';
//-- **Services/Helpers** ------------------------------------------------------------------------//
import { FeatureDataObjHelper } from './../helpers/feature-data-obj.helper';
import { UiHelper } from '../helpers/ui.helper';

@Injectable({
  providedIn: 'root'
})

export class FeatureActions {
  constructor(
    private featureService: FeatureService,
    private featureState: FeatureState,
    private featureDataObjHelper: FeatureDataObjHelper,
    private uiHelper: UiHelper
  ) { }

  createFeature(featureObj: FeatureDb, currentUser: {id:string, name: string}) {
    //-- Enrich Data before sending to backend ------------------------->
    const dataObj = this.featureDataObjHelper.createFeature(featureObj);
    const featureInsert = dataObj.featureInsert;
    const eventInsert = dataObj.eventInsert;

    //--- Call Create Feature Server API ------------------------------------->
    return this.featureService.createFeature(featureInsert, eventInsert).pipe(
      tap(() => {
        //-- Show loader -------------------->
        this.uiHelper.showLoader('Loading...')
      }),
      take(1), // only take first response from api and close connection to prevent memory leaks
      withLatestFrom(this.featureState.featureList$), // grab current state value of old featureList
      switchMap((responseFromServer, oldFeatureList) => {

        //-- On Success update feature list state variable with new featureObj -->
        const updatedFeatureList = [...oldFeatureList, {...featureInsert}];

        //-- Set new FeatureList state Variables ----------->
        this.featureState.setFeatureList(updatedFeatureList)
        this.uiHelper.hideLoader();
      }),
      //-- Catch Error -------------------------------->
      catchError(error => {
        console.log('error in createFeature$', error);
        this.uiHelper.hideLoader();
        this.uiHelper.displayErrorAlert(error.message);

        return this.errorActions.createError(error, insertIntoErrorDbFlag: true)
      })
    )
  }


}
