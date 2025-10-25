-- Better Auth Database Schema for MySQL
-- Run this script on your MySQL database to create the required tables

CREATE TABLE IF NOT EXISTS `user` (
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `emailVerified` BOOLEAN NOT NULL DEFAULT FALSE,
  `image` TEXT,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `session` (
  `id` VARCHAR(255) PRIMARY KEY,
  `userId` VARCHAR(255) NOT NULL,
  `expiresAt` TIMESTAMP NOT NULL,
  `token` VARCHAR(255) NOT NULL UNIQUE,
  `ipAddress` VARCHAR(255),
  `userAgent` TEXT,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `account` (
  `id` VARCHAR(255) PRIMARY KEY,
  `accountId` VARCHAR(255) NOT NULL,
  `providerId` VARCHAR(255) NOT NULL,
  `userId` VARCHAR(255) NOT NULL,
  `accessToken` TEXT,
  `refreshToken` TEXT,
  `expiresAt` TIMESTAMP,
  `scope` TEXT,
  `password` VARCHAR(255),
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `verification` (
  `id` VARCHAR(255) PRIMARY KEY,
  `identifier` VARCHAR(255) NOT NULL,
  `value` VARCHAR(255) NOT NULL,
  `expiresAt` TIMESTAMP NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_session_userId ON `session`(`userId`);
CREATE INDEX idx_session_token ON `session`(`token`);
CREATE INDEX idx_account_userId ON `account`(`userId`);
CREATE INDEX idx_account_providerId ON `account`(`providerId`);
CREATE INDEX idx_verification_identifier ON `verification`(`identifier`);
