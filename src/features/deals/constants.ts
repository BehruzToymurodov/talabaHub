import type { DealCategory } from "../../types";

export const dealCategories: DealCategory[] = [
  "Food & Drink",
  "Telecom",
  "Ride/Delivery",
  "Fashion",
  "Books & Education",
  "Fitness",
  "Electronics",
  "Travel",
];

export const categoryLabelKeys: Record<DealCategory, string> = {
  "Food & Drink": "category.foodDrink",
  Telecom: "category.telecom",
  "Ride/Delivery": "category.rideDelivery",
  Fashion: "category.fashion",
  "Books & Education": "category.booksEducation",
  Fitness: "category.fitness",
  Electronics: "category.electronics",
  Travel: "category.travel",
};

export const sortOptions = [
  { value: "trending", labelKey: "sort.trending" },
  { value: "new", labelKey: "sort.new" },
  { value: "expiring", labelKey: "sort.expiring" },
];
