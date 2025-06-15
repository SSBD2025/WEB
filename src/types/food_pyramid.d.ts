export interface FoodPyramid {
  id: string
  averageRating: number
  name: string;
  kcal: number;
  fat: number;
  saturatedFattyAcids: number;
  carbohydrates: number;
  sugar: number;
  protein: number;
  a: number
  d: number
  e: number
  k: number
  b1: number
  b2: number
  b3: number
  b5: number
  b6: number
  b7: number
  b9: number
  b12: number
  c: number
  potassium: number
  calcium: number
  phosphorus: number
  magnesium: number
  iron: number
  zinc: number
  fluorine: number
  manganese: number
  copper: number
  iodine: number
  selenium: number
  molybdenum: number
  chromium: number
}

export type ClientFoodPyramid = {
  foodPyramid: {
    id: string;
    version: number;
    averageRating: number;
    a: number;
    potassium: number;
    phosphorus: number;
    magnesium: number;
    manganese: number;
    molybdenum: number;
    selenium: number;
    chromium: number;
    fluorine: number;
    c: number;
    b3: number;
    copper: number;
    b2: number;
    b9: number;
    b5: number;
    k: number;
    iron: number;
    iodine: number;
    b6: number;
    b12: number;
    zinc: number;
    calcium: number;
    e: number;
    b1: number;
    b7: number;
    d: number;
    feedbacks: string;
    clientFoodPyramids: Array<{
      id: {
        clientId: string;
        foodPyramidId: string;
      };
      timestamp: string;
      version: number;
    }>;
  };
  timestamp: string;
  active: boolean;
  clientFeedback?: Feedback;
};

export interface Feedback {
  id: string;
  rating: number;
  description: string;
  timestamp: string;
  clientId: string;
  foodPyramidId: string;
  lockToken?: string;
}

export interface Client {
  id: string,
  firstName: string;
  lastName: string;
  email: string;
}

export interface FoodPyramidResponse {
  foodPyramid: FoodPyramid;
  feedbacks: Feedback[];
  clients: Client[];
}