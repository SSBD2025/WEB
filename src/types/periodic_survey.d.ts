export interface PeriodicSurvey {
    weight: number;
    bloodPressure: string;
    bloodSugarLevel: number;
}

export interface GetPeriodicSurvey {
    weight: number;
    bloodPressure: string;
    bloodSugarLevel: number;
    measurementDate: Date;
}

export type AllPeriodicSurveys = {
    content: GetPeriodicSurvey[];
    last: boolean;
    first: boolean;
    number: number;
    totalPages: number;
    totalElements: number;
}

export interface PeriodicSurveyQueryParams {
    page?: number;
    size?: number;
}