export interface BloodParameter {
    name: string;
    description: string;
    unit: string;
    standardMin: number;
    standardMax: number;
}

export interface BloodTestResult {
    lockToken: string;
    result: string;
    bloodParameter: BloodParameter;
}

export interface BloodTestReport {
    lockToken: string;
    timestamp: string;
    results: BloodTestResult[];
}

export interface SubmitBloodTestReport {
    results: {
        result: number,
        bloodParameter: {
            name: string;
        }
    }[];
}

export interface BloodTestEntry {
    id: string;
    parameterName: string;
    result: string;
    errors?: { parameterName?: string; result?: string };
}

export interface ParameterWithResult {
    parameter: BloodParameter;
    result: string;
}