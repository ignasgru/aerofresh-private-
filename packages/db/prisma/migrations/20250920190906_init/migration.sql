-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aircraft" (
    "tail" TEXT NOT NULL,
    "serial" TEXT,
    "make" TEXT,
    "model" TEXT,
    "typeCode" TEXT,
    "year" INTEGER,
    "engine" TEXT,
    "seats" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Aircraft_pkey" PRIMARY KEY ("tail")
);

-- CreateTable
CREATE TABLE "Owner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "state" TEXT,
    "country" TEXT,
    "redacted" BOOLEAN,

    CONSTRAINT "Owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AircraftOwner" (
    "tail" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),

    CONSTRAINT "AircraftOwner_pkey" PRIMARY KEY ("tail","ownerId")
);

-- CreateTable
CREATE TABLE "AdDirective" (
    "id" SERIAL NOT NULL,
    "makeModelKey" TEXT NOT NULL,
    "ref" TEXT NOT NULL,
    "summary" TEXT,
    "effectiveDate" TIMESTAMP(3),
    "status" TEXT,
    "severity" TEXT,

    CONSTRAINT "AdDirective_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Accident" (
    "id" SERIAL NOT NULL,
    "tail" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "severity" TEXT,
    "lat" DOUBLE PRECISION,
    "lon" DOUBLE PRECISION,
    "narrative" TEXT,
    "injuries" INTEGER,
    "fatalities" INTEGER,
    "phase" TEXT,

    CONSTRAINT "Accident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventLive" (
    "id" SERIAL NOT NULL,
    "tail" TEXT NOT NULL,
    "ts" TIMESTAMP(3) NOT NULL,
    "lat" DOUBLE PRECISION,
    "lon" DOUBLE PRECISION,
    "alt" DOUBLE PRECISION,
    "src" TEXT,
    "speed" DOUBLE PRECISION,
    "heading" DOUBLE PRECISION,

    CONSTRAINT "EventLive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Airport" (
    "icao" TEXT NOT NULL,
    "iata" TEXT,
    "name" TEXT,
    "lat" DOUBLE PRECISION,
    "lon" DOUBLE PRECISION,
    "elevation" INTEGER,
    "timezone" TEXT,

    CONSTRAINT "Airport_pkey" PRIMARY KEY ("icao")
);

-- CreateTable
CREATE TABLE "WeatherMetar" (
    "id" SERIAL NOT NULL,
    "icao" TEXT NOT NULL,
    "ts" TIMESTAMP(3) NOT NULL,
    "raw" TEXT,
    "parsed" TEXT,

    CONSTRAINT "WeatherMetar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "Aircraft_make_idx" ON "Aircraft"("make");

-- CreateIndex
CREATE INDEX "Aircraft_model_idx" ON "Aircraft"("model");

-- CreateIndex
CREATE INDEX "Aircraft_year_idx" ON "Aircraft"("year");

-- CreateIndex
CREATE UNIQUE INDEX "Owner_name_key" ON "Owner"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AdDirective_ref_key" ON "AdDirective"("ref");

-- CreateIndex
CREATE INDEX "AdDirective_makeModelKey_idx" ON "AdDirective"("makeModelKey");

-- CreateIndex
CREATE INDEX "AdDirective_status_idx" ON "AdDirective"("status");

-- CreateIndex
CREATE INDEX "Accident_tail_idx" ON "Accident"("tail");

-- CreateIndex
CREATE INDEX "Accident_date_idx" ON "Accident"("date");

-- CreateIndex
CREATE INDEX "Accident_severity_idx" ON "Accident"("severity");

-- CreateIndex
CREATE INDEX "EventLive_tail_idx" ON "EventLive"("tail");

-- CreateIndex
CREATE INDEX "EventLive_ts_idx" ON "EventLive"("ts");

-- CreateIndex
CREATE UNIQUE INDEX "EventLive_tail_ts_key" ON "EventLive"("tail", "ts");

-- CreateIndex
CREATE INDEX "Airport_iata_idx" ON "Airport"("iata");

-- CreateIndex
CREATE INDEX "WeatherMetar_icao_idx" ON "WeatherMetar"("icao");

-- AddForeignKey
ALTER TABLE "AircraftOwner" ADD CONSTRAINT "AircraftOwner_tail_fkey" FOREIGN KEY ("tail") REFERENCES "Aircraft"("tail") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AircraftOwner" ADD CONSTRAINT "AircraftOwner_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Accident" ADD CONSTRAINT "Accident_tail_fkey" FOREIGN KEY ("tail") REFERENCES "Aircraft"("tail") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventLive" ADD CONSTRAINT "EventLive_tail_fkey" FOREIGN KEY ("tail") REFERENCES "Aircraft"("tail") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeatherMetar" ADD CONSTRAINT "WeatherMetar_icao_fkey" FOREIGN KEY ("icao") REFERENCES "Airport"("icao") ON DELETE RESTRICT ON UPDATE CASCADE;
