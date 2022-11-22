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
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ActivityActions {
  constructor(
    private activityService: ActivityService,
    private activityState: ActivityState,
    private activityDataObjHelper: ActivityDataObjHelper,
    private uiHelper: UiHelper,
    private navController: NavController
  ) {}

  createActivity(
    activityObj: ActivityDb,
    navigationRoute?: string,
    navDirection?: 'back' | 'forward'
  ) {
    return of(activityObj).pipe(
      tap(() => {
        this.uiHelper.showLoader('Loading...');
      }),
      switchMap((activityObj) => {
        const dataObj = this.activityDataObjHelper.createActivity(activityObj);
        const activityInsert = dataObj.activityInsert;
        const eventInsert = dataObj.eventInsert;
        const stateUpdates = dataObj.stateUpdates;
        return this.activityService
          .createActivity(activityInsert, eventInsert)
          .pipe(
            take(1),
            switchMap((res) => {
              this.activityState.addItemToList(stateUpdates.activityObj);
              this.uiHelper.hideLoader();
              this.uiHelper.displayToast(
                'Activity Added Successfully!',
                2000,
                'bottom'
              );
              if (navigationRoute && navDirection) {
                if (navDirection == 'back') {
                  this.navController.navigateBack(navigationRoute);
                } else {
                  this.navController.navigateForward(navigationRoute);
                }
              }
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
            this.activityState.setActivityList(enrichedActivities);
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

  updateActivity(
    activityObj: ActivityDb,
    navigationRoute?: string,
    navDirection?: 'back' | 'forward'
  ) {
    return of(activityObj).pipe(
      tap(() => {
        this.uiHelper.showLoader('Loading...');
      }),
      withLatestFrom(this.activityState.getActivity$()),
      switchMap(([activityObj, originalActivityObj]) => {
        const dataObj = this.activityDataObjHelper.updateActivity(
          activityObj,
          originalActivityObj
        );
        this.uiHelper.hideLoader();
        this.uiHelper.displayToast(
          'Activity Updated Successfully!',
          2000,
          'bottom'
        );
        const activityUpdate = dataObj.activityUpdate;
        const eventInsert = dataObj.eventInsert;
        const stateUpdates = dataObj.stateUpdates;
        return this.activityService
          .updateActivity(activityUpdate, eventInsert)
          .pipe(
            take(1),
            switchMap((res) => {
              this.activityState.setActivity(stateUpdates.activityObj);
              this.activityState.updateItemInList(stateUpdates.activityObj);
              if (navigationRoute && navDirection) {
                if (navDirection == 'back') {
                  this.navController.navigateBack(navigationRoute);
                } else {
                  this.navController.navigateForward(navigationRoute);
                }
              }
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

  deleteActivity(
    activityObj: ActivityDb,
    navigationRoute?: string,
    navDirection?: 'back' | 'forward'
  ) {
    return of(activityObj).pipe(
      tap(() => {
        this.uiHelper.showLoader('Loading...');
      }),
      switchMap((activityObj) => {
        console.log("activity Obj", activityObj);
        const dataObj = this.activityDataObjHelper.deleteActivity(activityObj);
        console.log("data object", dataObj);
        const eventInsert = dataObj.eventInsert;
        const stateUpdates = dataObj.stateUpdates;
        return this.activityService.deleteActivity(activityObj.id, eventInsert)
          .pipe(
            take(1),
            switchMap((res) => {
              this.activityState.removeItemInList(stateUpdates.activityObj);
              this.uiHelper.hideLoader();
              this.uiHelper.displayToast(
                'Activity Removed Successfully!',
                2000,
                'bottom'
              );
              if (navigationRoute && navDirection) {
                console.log("looking for navigation")
                if (navDirection == 'back') {
                  this.navController.navigateBack(navigationRoute);
                } else {
                  this.navController.navigateForward(navigationRoute);
                }
              }
              return of();
            }),
            //-- Catch Error -------------------------------->
            catchError((error) => {
              console.log('error in Delete Activity', error);
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
