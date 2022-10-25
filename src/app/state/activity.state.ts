/*************************************************************************************************
 ** Imports                                                                                      **
 **************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { Observable } from 'rxjs';

//-- **Data Models** ----------------------------------------------------------------------------//
import { ActivityDb, initialActivityDb } from '../models/activity.model';


@Injectable({
  providedIn: 'root',
})
export class ActivityState {
  //--------variables ---------
  // private activityList$: BehaviorSubject<ActivityDb[]> = new BehaviorSubject(
  //   []
  // );

  // private activityItem$: BehaviorSubject<ActivityDb> = new BehaviorSubject({
  //   ...initialActivityDb,
  // });

  activity$ = new BehaviorSubject<ActivityDb>({ ...initialActivityDb });
  activityList$ = new BehaviorSubject<ActivityDb[]>([]);

  constructor() {}

  // getActivityListObs(): Observable<ActivityDb[]> {
  //   return this.activityList$.asObservable();
  // }

  // setActivityListObs(activityList: ActivityDb[]) {
  //   this.activityList$.next(activityList);
  // }

  // getActivityList(): ActivityDb[] {
  //   return this.activityList$.getValue();
  // }

  // getActivityItemObs(): Observable<ActivityDb> {
  //   return this.activityItem$.asObservable();
  // }

  // setActivityItem(activityItem: ActivityDb) {
  //   this.activityItem$.next(activityItem);
  // }

  // getActivityItem(): ActivityDb {
  //   return this.activityItem$.getValue();
  // }

  setActivity(activity: ActivityDb) {
    this.activity$.next(activity);
  }

  setActivityList(activityList: ActivityDb[]) {
    this.activityList$.next([activityList]);
  }

  //-- Get Last emitted Value of observable --------------------->
  getActivityList() {
    const currentItemValue = this.activityList$.getValue();

    return [...currentItemValue];
  }

  //-- Get observable --------->
  getActivityList$() {
    return this.activityList$;
  }

  //-- Get Last emitted Value of observable --------------------->
  getActivity() {
    const currentItemValue = this.activity$.getValue();

    return { ...currentItemValue };
  }

  //-- Get observable ------->
  getActivity$() {
    return this.activity$;
  }

  //-------------------------------------------------------------------------------------------------------------------------->
  //--- ALL OF these are common methods used to add item/items to list, remove item/items from list, update Item/Items in list
  addItemToList(activityToAdd: ActivityDb) {
    //-- .getValue() gets last emited value on observable only works with BehaviorSubject
    const oldList = [...this.activityList$.getValue()];

    const updatedList = [...oldList, { ...activityToAdd }];

    //--- Set updated Activity list ----------------->
    this.activityList$.next([...updatedList]);
  }

  updateItemInList(activityUpdate: ActivityDb) {
    //-- .getValue() gets last emited value on observable only works with BehaviorSubject
    const oldList = [...this.activityList$.getValue()];

    //-- Find and replace old activity item with new one + Set updated list -------------------------->
    const updatedList = oldList.map((activityItem) => {
      //--IF  Id matches the id of activity that needs to be updated return updated activity instead ->
      const itemNeedsToBeUpdatedFlag = activityItem?.id == activityUpdate.id;
      if (itemNeedsToBeUpdatedFlag) {
        return {
          ...activityUpdate,
        };
      } else {
        return {
          ...activityItem,
        };
      }
    });
    //-- Set new activityList ------------------------->
    this.activityList$.next([...updatedList]);
  }

  //-------------------------------------------------->
  //--- Remove one item from list -------------------->
  removeItemInList(activityToRemove: ActivityDb) {
    //-- .getValue() gets last emited value on observable only works with BehaviorSubject
    const oldList = [...this.activityList$.getValue()];

    //-- Filter out the items that do not match the activityToRemove.id ------------->
    const updatedList = oldList.filter((activityItem) => {
      const shouldBeRemovedFromListFlag =
        activityItem?.id == activityToRemove?.id;
      //-- Filter out items that do not match the id to be removed
      if (!shouldBeRemovedFromListFlag) {
        return { ...activityItem };
      }
    });

    //-- Set new activityList ------------------------->
    this.activityList$.next([...updatedList]);
  }

  //-------------------------------------------------------------
  //YOU don't need these because not as common but if you do -----

  addMultipleItemsToList(itemsToAdd: ActivityDb[]) {
    //-- .getValue() gets last emited value on observable only works with BehaviorSubject
    const oldList = [...this.activityList$.getValue()];

    const updatedList = [...oldList, ...itemsToAdd];

    //--- Set updated Activity list ----------------->
    this.activityList$.next([...updatedList]);
  }

  updateMultipleItemsInList(itemsToBeUpdated: ActivityDb[]) {
    const oldList = [...this.activityList$.getValue()];
    const idsToUpdate = oldList.map((item) => item.id);

    //-- find items that need to be updated and update those items only --------------------->
    const updatedList = oldList.map((activityItem) => {
      const itemNeedsToBeUpdatedFlag = idsToUpdate.includes(activityItem?.id);

      if (itemNeedsToBeUpdatedFlag) {
        const itemUpdate = itemsToBeUpdated.filter(
          (item) => item.id == activityItem.id
        )[0];
        return {
          ...itemUpdate,
        };
      } else {
        return {
          ...activityItem,
        };
      }
    });

    //--- Set updated list ----------------->
    this.activityList$.next([...updatedList]);
  }

  removeMultipleItemsInList(itemsToRemove: ActivityDb[]) {
    //-- extract only the ids into an array/alternatively you could pass it an array of ids in method argument instead of itemsToRemove you could do activityIdsToRemove
    const idsToRemove = itemsToRemove.map((item) => item.id);
    const oldList = [...this.activityList$.getValue()];

    //-- Filter out the items that exist in the idsToRemove array ----------------------------->
    const updatedList = oldList.filter((activityItem) =>
      idsToRemove.includes(activityItem?.id)
    );

    //--- Set updated list ----------------->
    this.activityList$.next([...updatedList]);
  }
}
