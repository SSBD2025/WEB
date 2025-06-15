export interface PeriodicSurvey {
    weight: number;
    bloodPressure: string;
    bloodSugarLevel: number;
}

export interface GetPeriodicSurvey {
    id: string;
    weight: number;
    bloodPressure: string;
    bloodSugarLevel: number;
    measurementDate: Date;
    lockToken: string;
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
    since?: string;
    before?: string;
    sort?: string;
}

export interface EditPeriodicSurvey {
    weight: number;
    bloodPressure: string;
    bloodSugarLevel: number;
    lockToken: string;
}