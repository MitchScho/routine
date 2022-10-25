/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
import { from, of } from 'rxjs';
import { take, tap, switchMap, catchError, withLatestFrom } from 'rxjs/operators';
//-- **Data Models** ----------------------------------------------------------------------------//
import { EventDb } from '../models/event.model';
import { ActivityDb, ActivityLastEventIdentifierFields } from './../models/activity.model';
//-- **Services/Helpers** ------------------------------------------------------------------------//
import { ActivityDataObjHelper } from './../helpers/activity-data-obj.helper';
import { UiHelper } from '../helpers/ui.helper';
import { ActivityState } from '../state/activity.state';
import { ActivityService } from '../services/activity.service';

@Injectable({
  providedIn: 'root',
})
export class ActivityActions {
  constructor(
    private activityService: ActivityService,
    private activityState: ActivityState,
    private activityDataObjHelper: ActivityDataObjHelper,
    private uiHelper: UiHelper
  ) {}

  createActivity(activityObj: ActivityDb) {
    return of(activityObj).pipe(
      tap(() => {
        this.uiHelper.showLoader('Loading...');
      }),
      withLatestFrom(this.activityState.getActivityListObs()),
      switchMap(([activityObj, oldActivityList]) => {
        const dataObj = this.activityDataObjHelper.createActivity(
          activityObj,
          oldActivityList
        );
        const activityInsert = dataObj.activityInsert;
        const eventInsert = dataObj.eventInsert;
        const stateUpdates = dataObj.stateUpdates;
        return this.activityService
          .createActivity(activityInsert, eventInsert)
          .pipe(
            take(1),
            switchMap((res) => {
              this.activityState.setActivityListObs(stateUpdates.activityList);
              // this.navctrl.pop
              return of();
            }),
            //-- Catch Error -------------------------------->
            catchError((error) => {
              console.log('error in Create Activity', error);
              this.uiHelper.hideLoader();
              this.uiHelper.displayErrorAlert(error.message);

              // return this.errorActions.createError(error, insertIntoErrorDbFlag: true)
              return of();
            })
          );
      })
    );
  }

  getAllActivities() {
    return of(null).pipe(
      tap(() => {
        this.uiHelper.showLoader('Loading...');
      }),
      switchMap(() => {
        return this.activityService.getAllActivities().pipe(
          take(1), // only take first response from api and close connection to prevent memory leaks
          switchMap((responseFromServer) => {
            console.log('server response ---', responseFromServer);
            const enrichedActivities =
              this.activityDataObjHelper.enrichActivityServerResponse(
                responseFromServer
              );

            console.log('enrichedActivities', enrichedActivities);
            //-- Set new ActivityList state Variables ----------->
            this.activityState.setActivityListObs(enrichedActivities);
            this.uiHelper.hideLoader();
            return of();
          }),
          //-- Catch Error -------------------------------->
          catchError((error) => {
            console.log('error in createActivity$', error);
            this.uiHelper.hideLoader();
            this.uiHelper.displayErrorAlert(error.message);

            // return this.errorActions.createError(error, insertIntoErrorDbFlag: true)
            return of();
          })
        );
      })
    );
  }

  updateActivity(activityObj: ActivityDb) {
    return of(activityObj).pipe(
      tap(() => {
        this.uiHelper.showLoader('Loading...');
      }),
      withLatestFrom(
        this.activityState.getActivityItemObs(),
        this.activityState.getActivityListObs()
      ),
      switchMap(([activityObj, originalActivityObj, oldActivityList]) => {
        const dataObj = this.activityDataObjHelper.updateActivity(
          activityObj,
          originalActivityObj,
          oldActivityList
        );
        const activityUpdate = dataObj.activityUpdate;
        const eventInsert = dataObj.eventInsert;
        const stateUpdates = dataObj.stateUpdates;
        return this.activityService
          .updateActivity(activityUpdate, eventInsert)
          .pipe(
            take(1),
            switchMap((res) => {
              this.activityState.setActivityItem(stateUpdates.activityObj);
              this.activityState.setActivityListObs(stateUpdates.activityList);
              return of();
            }),
            //-- Catch Error -------------------------------->
            catchError((error) => {
              console.log('error in Update Activity', error);
              this.uiHelper.hideLoader();
              this.uiHelper.displayErrorAlert(error.message);

              // return this.errorActions.createError(error, insertIntoErrorDbFlag: true)
              return of();
            })
          );
      })
    );
  }
}
