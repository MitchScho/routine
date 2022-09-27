==-====
EventDb
userDb
   - activityDb
    - routineDb
    - sessionDb
Vlad Florian — Today at 12:38 PM
export interface RoutineDb {
    id: string;
    activityIds: string[]; //ALL ACTIVITES OF ROUTINE
    name: string;
    description: string;
    schedule: {
        dayNumber: number //
        activityIds: string[];  //Activites for particular day
        activitiesConfig: {
            activityId: string;
            startTime: any;
            endTime: any;
            reps: {
                setNumber: number;
                weightType: string;      //**weightType */  body weight | dumbell wieght
                weight: number;
                time: number;
                distance: number;
                repNumber: number
                extraInstructions: string;
            } []
        } []
    } []
}


export interface SessionDb {
    id: string;
    userId: string;
    routineId: string;
    activityIds: string[];
    completedActivityIds: [1, 2, 3, 4]
    notCompletedActivityIds: [5, 6, 7, 8, 9];
}

// alert should be sent when stuff not started
export const activityStatusTypeObj = {
    notStarted: 'Not Started',
    completed: 'Completed',
    notCompleted: 'Not Completed',
}

export const activityGoalWeightTypeObj = {
    rep: "rep",
    distance: "distance",
    time: "time"
}

export const activityGoalWeightTypeArray = [
    activityGoalWeightTypeObj.rep,
    activityGoalWeightTypeObj.distance,
    activityGoalWeightTypeObj.time,
]



export const activityGoalTypeObj = {
    rep: "rep",
    distance: "distance",
    time: "time"
}

export const activityGoalTypeArray = [
    activityGoalTypeObj.rep,
    activityGoalTypeObj.distance,
    activityGoalTypeObj.time,
]


export interface UserDb {
    id: string;
    name: string;
}


// activity.model.ts===============================
export interface ActivityDb {
    id: string;
    name: string;
    description: string;
    type: string //see **activityTypeObj**
    trackingConfig: {
        distance: boolean;
        time: boolean;
        weight: boolean;
    }
    steps:

}

export const activityTypeObj = {
    physical: "physical",
    mental: "mental",
    intellectual: "intellectual"
}


export const activityRepTypeObj = {
    endurance: "endurance",
    strength: "strength",

}

export const activityRepTypeArray = [
    activityRepTypeObj.endurance,
    activityRepTypeObj.strength
]



export const activityTypeArray = [
    activityTypeObj.physical,
    activityTypeObj.mental,
    activityTypeObj.intellectual
]
