export enum BloodParameter {
    HGB = "HGB",
    HCT = "HCT",
    RBC = "RBC",
    MCV = "MCV",
    MCH = "MCH",
    MCHC = "MCHC",
    RDW = "RDW",
    WBC = "WBC",
    EOS = "EOS",
    BASO = "BASO",
    LYMPH = "LYMPH",
    MONO = "MONO",
    PLT = "PLT",
    MPV = "MPV",
    PDW = "PDW",
    PCT = "PCT",
    P_LCR = "P_LCR",
    IRON = "IRON",
    FERRITIN = "FERRITIN",
    B9 = "B9",
    D = "D",
    B12 = "B12",
    GLUCOSE = "GLUCOSE",
    INSULIN = "INSULIN",
    CHOL = "CHOL",
    CA = "CA",
    ZN = "ZN",
    LDL = "LDL",
    HDL = "HDL",
    OH_D = "OH_D",
    B6 = "B6",
}

export interface BloodTestOrder {
    clientId: string;
    description: string;
    parameters: BloodParameter[];
}
