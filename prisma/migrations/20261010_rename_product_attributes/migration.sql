-- Rename product attribute columns to match frontend expectations
-- Frontend uses singular names: skinType, concern, hairType, budget
-- Schema had plural names: skinTypes, concerns, hairTypes, budgetTier

ALTER TABLE "products" RENAME COLUMN "skin_types" TO "skin_type";
ALTER TABLE "products" RENAME COLUMN "concerns" TO "concern";
ALTER TABLE "products" RENAME COLUMN "hair_types" TO "hair_type";
ALTER TABLE "products" RENAME COLUMN "budget_tier" TO "budget";
