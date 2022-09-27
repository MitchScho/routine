// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { routineDatabaseName } from "src/app/models/routine.model";

export const environment = {
  production: false,
  appName: 'routine',
  appVersion: 0.1,
  firebase: {
    apiKey: 'AIzaSyDRmbOLzPXQbtTFMsLs_jdzqM52iozalec',
    authDomain: 'dogswalk-fd7cb.firebaseapp.com',
    projectId: 'dogswalk-fd7cb',
    storageBucket: 'dogswalk-fd7cb.appspot.com',
    messagingSenderId: '1047328134609',
    appId: '1:1047328134609:web:f2d231586a39d3e941fcf0',
    measurementId: 'G-FF2759SX5C',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
