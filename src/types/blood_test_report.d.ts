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
