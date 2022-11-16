import { Length, Weight } from '../enum/Units';

export interface WeightType {
  unit: Weight;
  value: string;
}

export interface LengthType {
  unit: Length;
  value: string;
}
