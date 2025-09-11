export interface IBanner {
  title: string;
  image: string;
  link?: string;
  active: boolean;
  startDate?: Date;
  endDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
