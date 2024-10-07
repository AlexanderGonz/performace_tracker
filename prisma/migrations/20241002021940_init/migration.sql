-- CreateTable
CREATE TABLE "Athlete" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "team" TEXT NOT NULL,

    CONSTRAINT "Athlete_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Metric" (
    "id" TEXT NOT NULL,
    "athleteId" TEXT NOT NULL,
    "metricType" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Metric_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Metric" ADD CONSTRAINT "Metric_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- Insert initial data
INSERT INTO "Athlete" (id, name, age, team) VALUES
('1', 'John Doe', 25, 'Team A'),
('2', 'Jane Smith', 30, 'Team B'),
('3', 'Alice Johnson', 28, 'Team C');

INSERT INTO "Metric" (id, "athleteId", "metricType", value, unit, timestamp)
VALUES (
  '123e4567-e89b-12d3-a456-426614174001',
  '1',
  'Speed',
  5.7,
  'm/s',
  CURRENT_TIMESTAMP
);
