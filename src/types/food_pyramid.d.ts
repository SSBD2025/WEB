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
};
