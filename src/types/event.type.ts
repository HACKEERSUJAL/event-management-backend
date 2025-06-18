import { CategoryType } from "./categories.type";
import { UserType } from "./userType";

export interface EventType {
  title: string;
  description: string;
  banner: string;
  categories: CategoryType[];
  createdBy: UserType;
  bannerPublicId: string;
  createdAt?: string;
  updatedAt?: string;
}
