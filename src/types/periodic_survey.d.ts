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
    _embedded: {
        periodicSurveyDTOList: GetPeriodicSurvey[];
    };
    _links: {
        first?: { href: string };
        self: { href: string };
        next?: { href: string };
        last?: { href: string };
        prev?: { href: string };
    };
    page: {
        size: number;
        totalElements: number;
        totalPages: number;
        number: number;
    };
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