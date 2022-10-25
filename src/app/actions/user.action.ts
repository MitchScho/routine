/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { take, tap, switchMap, catchError, withLatestFrom } from 'rxjs/operators';
//-- **Data Models** ----------------------------------------------------------------------------//
import { EventDb } from '../models/event.model';
import { UserDb, UserLastEventIdentifierFields } from '../models/user.model';
//-- **Services/Helpers** ------------------------------------------------------------------------//
import { UserDataObjHelper } from '../helpers/user-data-obj.helper';
import { UiHelper } from '../helpers/ui.helper';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})

export class UserActions {
  constructor(
    private userService: UserService,
    private userState: UserState,
    private userDataObjHelper: UserDataObjHelper,
    private uiHelper: UiHelper
  ) { }

  createUser(userObj: UserDb, currentUser: {id:string, name: string}) {
    //-- Enrich Data before sending to backend ------------------------->
    const dataObj = this.userDataObjHelper.createUser(userObj);
    const userInsert = dataObj.userInsert;
    const eventInsert = dataObj.eventInsert;

    //--- Call Create User Server API ------------------------------------->
    return this.userService.createUser(userInsert, eventInsert).pipe(
      tap(() => {
        //-- Show loader -------------------->
        this.uiHelper.showLoader('Loading...')
      }),
      take(1), // only take first response from api and close connection to prevent memory leaks
      withLatestFrom(this.userState.userList$), // grab current state value of old userList
      switchMap((responseFromServer, oldUserList) => {

        //-- On Success update user list state variable with new userObj -->
        const updatedUserList = [...oldUserList, {...userInsert}];

        //-- Set new UserList state Variables ----------->
        this.userState.setUserList(updatedUserList)
        this.uiHelper.hideLoader();
      }),
      //-- Catch Error -------------------------------->
      catchError(error => {
        console.log('error in createUser$', error);
        this.uiHelper.hideLoader();
        this.uiHelper.displayErrorAlert(error.message);

        return this.errorActions.createError(error, insertIntoErrorDbFlag: true)
      })
    )
  }


}
