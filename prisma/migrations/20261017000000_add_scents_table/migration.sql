-- CreateEnum
CREATE TYPE "ScentLayer" AS ENUM ('top', 'heart', 'base');

-- CreateTable
CREATE TABLE "scents" (
    "id" TEXT NOT NULL,
    "layer" "ScentLayer" NOT NULL,
    "name_ar" TEXT NOT NULL,
    "name_en" TEXT,
    "icon" TEXT NOT NULL DEFAULT '🌸',
    "description" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#FFE066',
    "glow_color" TEXT NOT NULL DEFAULT 'rgba(255, 224, 102, 0.5)',
    "boost_sillage" INTEGER,
    "boost_longevity" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "scents_layer_is_active_sort_order_idx" ON "scents"("layer", "is_active", "sort_order");
