-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('APPARTEMENT', 'MAISON', 'TERRAIN', 'LOCAL_COMMERCIAL', 'BUREAU');

-- CreateEnum
CREATE TYPE "HeatingType" AS ENUM ('GAZ', 'ELECTRIQUE', 'POMPE_A_CHALEUR', 'FIOUL', 'BOIS', 'COLLECTIF');

-- CreateEnum
CREATE TYPE "KitchenType" AS ENUM ('EQUIPEE', 'AMENAGEE', 'AMERICAINE', 'SEPAREE', 'AUCUNE');

-- CreateEnum
CREATE TYPE "PropertyCondition" AS ENUM ('NEUF', 'EXCELLENT', 'BON', 'A_RENOVER');

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "bathrooms" INTEGER,
ADD COLUMN     "condition" "PropertyCondition",
ADD COLUMN     "elevator" BOOLEAN,
ADD COLUMN     "energyClass" TEXT,
ADD COLUMN     "energyConsumption" INTEGER,
ADD COLUMN     "floor" INTEGER,
ADD COLUMN     "gesClass" TEXT,
ADD COLUMN     "gesEmission" INTEGER,
ADD COLUMN     "heatingType" "HeatingType",
ADD COLUMN     "kitchenType" "KitchenType",
ADD COLUMN     "toilets" INTEGER,
ADD COLUMN     "totalFloors" INTEGER,
ADD COLUMN     "type" "PropertyType",
ADD COLUMN     "yearBuilt" INTEGER;
