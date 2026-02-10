-- CreateTable
CREATE TABLE "Save" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "goodId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Save_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Save_userId_goodId_key" ON "Save"("userId", "goodId");

-- AddForeignKey
ALTER TABLE "Save" ADD CONSTRAINT "Save_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Save" ADD CONSTRAINT "Save_goodId_fkey" FOREIGN KEY ("goodId") REFERENCES "Good"("id") ON DELETE CASCADE ON UPDATE CASCADE;
