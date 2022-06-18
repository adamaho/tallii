-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "avatar_background" TEXT NOT NULL DEFAULT E'#F6B67A',
    "avatar_emoji" TEXT NOT NULL DEFAULT E'0x1F355',
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "refresh_token_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("refresh_token_id")
);

-- CreateTable
CREATE TABLE "Match" (
    "match_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "game_type" TEXT NOT NULL,
    "creator_user_id" INTEGER NOT NULL,
    "winning_team_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("match_id")
);

-- CreateTable
CREATE TABLE "MatchAdmin" (
    "match_admin_id" SERIAL NOT NULL,
    "match_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "MatchAdmin_pkey" PRIMARY KEY ("match_admin_id")
);

-- CreateTable
CREATE TABLE "Team" (
    "team_id" SERIAL NOT NULL,
    "match_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("team_id")
);

-- CreateTable
CREATE TABLE "TeamPlayer" (
    "team_player_id" SERIAL NOT NULL,
    "team_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "TeamPlayer_pkey" PRIMARY KEY ("team_player_id")
);

-- CreateTable
CREATE TABLE "Game" (
    "game_id" SERIAL NOT NULL,
    "match_id" INTEGER NOT NULL,
    "name" TEXT,
    "winning_team_id" INTEGER,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("game_id")
);

-- CreateTable
CREATE TABLE "GameScores" (
    "team_id" INTEGER NOT NULL,
    "game_id" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "GameScores_pkey" PRIMARY KEY ("team_id","game_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_user_id_key" ON "RefreshToken"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Match_winning_team_id_key" ON "Match"("winning_team_id");

-- CreateIndex
CREATE UNIQUE INDEX "Game_winning_team_id_key" ON "Game"("winning_team_id");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_creator_user_id_fkey" FOREIGN KEY ("creator_user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_winning_team_id_fkey" FOREIGN KEY ("winning_team_id") REFERENCES "Team"("team_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchAdmin" ADD CONSTRAINT "MatchAdmin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchAdmin" ADD CONSTRAINT "MatchAdmin_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "Match"("match_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "Match"("match_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamPlayer" ADD CONSTRAINT "TeamPlayer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamPlayer" ADD CONSTRAINT "TeamPlayer_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "Match"("match_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_winning_team_id_fkey" FOREIGN KEY ("winning_team_id") REFERENCES "Team"("team_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameScores" ADD CONSTRAINT "GameScores_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameScores" ADD CONSTRAINT "GameScores_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("game_id") ON DELETE RESTRICT ON UPDATE CASCADE;
