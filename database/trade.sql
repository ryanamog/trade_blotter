-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 27, 2026 at 06:18 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `trade`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `book_id` int(11) NOT NULL,
  `book_name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`book_id`, `book_name`, `description`, `created_at`) VALUES
(1, 'EQUITIES_UK', '', '2026-10-22 05:03:26'),
(2, 'EQUITIES_US', '', '2026-10-22 05:04:40'),
(3, 'TECH GROWTH', NULL, '2026-10-22 05:05:41');

-- --------------------------------------------------------

--
-- Table structure for table `counterparties`
--

CREATE TABLE `counterparties` (
  `counterparty_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `lei` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `counterparties`
--

INSERT INTO `counterparties` (`counterparty_id`, `name`, `lei`, `created_at`) VALUES
(1, 'Goldman Sachs', NULL, '2026-10-22 05:03:26'),
(2, 'JP Morgan', NULL, '2026-10-22 05:04:40'),
(3, 'Morgan Stanley', NULL, '2026-10-22 05:05:41');

-- --------------------------------------------------------

--
-- Table structure for table `instruments`
--

CREATE TABLE `instruments` (
  `symbol` varchar(20) NOT NULL,
  `company_name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `instruments`
--

INSERT INTO `instruments` (`symbol`, `company_name`, `created_at`) VALUES
('AAPL', 'Apple Inc.', '2026-10-22 05:03:26'),
('MSFT', 'Microsoft Corp.', '2026-10-22 05:04:40'),
('NVIDIA', 'NVIDIA Corporation', '2026-10-25 03:01:09'),
('TSLA', 'Tesla Inc.', '2026-10-22 05:05:41');

-- --------------------------------------------------------

--
-- Table structure for table `traders`
--

CREATE TABLE `traders` (
  `trader_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `traders`
--

INSERT INTO `traders` (`trader_id`, `username`, `full_name`, `created_at`) VALUES
(1, 'JSMITH', NULL, '2026-10-22 05:03:26'),
(2, 'ABROWN', NULL, '2026-10-22 05:04:40'),
(3, 'MJONES', NULL, '2026-10-22 05:05:41');

-- --------------------------------------------------------

--
-- Table structure for table `trades`
--

CREATE TABLE `trades` (
  `id` int(11) NOT NULL,
  `trade_id` varchar(50) NOT NULL,
  `symbol` varchar(20) NOT NULL,
  `trader_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `counterparty_id` int(11) NOT NULL,
  `side` enum('BUY','SELL') NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(18,4) NOT NULL,
  `notional_value` decimal(18,4) GENERATED ALWAYS AS (`quantity` * `price`) STORED,
  `trade_timestamp` datetime NOT NULL,
  `status` enum('ACTIVE','CANCELLED','AMENDED') NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trades`
--

INSERT INTO `trades` (`id`, `trade_id`, `symbol`, `trader_id`, `book_id`, `counterparty_id`, `side`, `quantity`, `price`, `trade_timestamp`, `status`, `created_at`) VALUES
(1, 'TDR-F3D3DFFB', 'AAPL', 1, 2, 3, 'BUY', 1000, 1.5000, '2026-10-26 17:19:26', 'AMENDED', '2026-10-26 17:19:26'),
(2, 'TDR-3003F344', 'MSFT', 3, 2, 3, 'SELL', 1002, 20.0000, '2026-10-26 17:22:09', 'ACTIVE', '2026-10-26 17:22:09'),
(3, 'TDR-A80AC3CF', 'TSLA', 3, 2, 2, 'SELL', 2000, 10.0000, '2026-10-26 17:22:40', 'ACTIVE', '2026-10-26 17:22:40'),
(4, 'TDR-9D16B2F4', 'AAPL', 1, 3, 3, 'BUY', 10000, 2.3000, '2026-10-26 17:36:35', 'ACTIVE', '2026-10-26 17:36:35'),
(5, 'TDR-1682FED2', 'NVIDIA', 3, 3, 2, 'SELL', 2000, 10.0000, '2026-10-26 17:36:55', 'ACTIVE', '2026-10-26 17:36:55'),
(6, 'TDR-9C6998B9', 'TSLA', 1, 3, 2, 'BUY', 20000, 10.0000, '2026-10-26 17:37:16', 'ACTIVE', '2026-10-26 17:37:16'),
(7, 'TDR-92A0984B', 'AAPL', 1, 2, 3, 'SELL', 20, 10.0000, '2026-10-26 17:37:40', 'ACTIVE', '2026-10-26 17:37:40'),
(8, 'TDR-1936A620', 'TSLA', 1, 3, 3, 'BUY', 1000, 5.2000, '2026-10-26 17:38:08', 'ACTIVE', '2026-10-26 17:38:08'),
(9, 'TDR-495BD19D', 'NVIDIA', 3, 1, 3, 'BUY', 2000, 20.0000, '2026-10-26 17:38:31', 'ACTIVE', '2026-10-26 17:38:31'),
(10, 'TDR-0D84FF80', 'MSFT', 1, 2, 3, 'BUY', 40000, 0.6000, '2026-10-26 17:38:54', 'ACTIVE', '2026-10-26 17:38:54'),
(11, 'TDR-354ACD67', 'MSFT', 3, 1, 2, 'BUY', 600, 20.0000, '2026-10-26 17:39:12', 'ACTIVE', '2026-10-26 17:39:12'),
(12, 'TDR-61EB76B2', 'AAPL', 1, 1, 3, 'SELL', 100, 10.0000, '2026-10-26 17:39:51', 'ACTIVE', '2026-10-26 17:39:51'),
(13, 'TDR-67786FFE', 'AAPL', 3, 2, 1, 'BUY', 6000, 30.0000, '2026-10-26 17:40:10', 'ACTIVE', '2026-10-26 17:40:10'),
(14, 'TDR-7C8C6FAC', 'MSFT', 3, 3, 3, 'BUY', 7000, 0.2000, '2026-10-26 17:40:31', 'ACTIVE', '2026-10-26 17:40:31'),
(15, 'TDR-76E45FB9', 'MSFT', 1, 3, 3, 'SELL', 300, 50.0000, '2026-10-26 17:40:49', 'ACTIVE', '2026-10-26 17:40:49'),
(16, 'TDR-66F85070', 'NVIDIA', 2, 3, 1, 'SELL', 100000, 6.3000, '2026-10-26 17:41:08', 'ACTIVE', '2026-10-26 17:41:08'),
(17, 'TDR-F89DECDE', 'TSLA', 2, 1, 3, 'BUY', 10000, 9.1000, '2026-10-26 17:41:50', 'ACTIVE', '2026-10-26 17:41:50'),
(18, 'TDR-4B3AAD1C', 'TSLA', 3, 1, 1, 'BUY', 3000, 5.4000, '2026-10-26 17:42:19', 'ACTIVE', '2026-10-26 17:42:19'),
(19, 'TDR-B777E6C6', 'AAPL', 1, 1, 3, 'BUY', 10000, 3.5000, '2026-10-26 17:42:39', 'ACTIVE', '2026-10-26 17:42:39'),
(20, 'TDR-302093E6', 'MSFT', 1, 3, 1, 'BUY', 400, 20.0000, '2026-10-26 17:43:02', 'ACTIVE', '2026-10-26 17:43:02'),
(21, 'TDR-C7C39196', 'NVIDIA', 1, 2, 3, 'SELL', 100, 20.0000, '2026-10-26 17:43:18', 'ACTIVE', '2026-10-26 17:43:18'),
(22, 'TDR-CA44D3E5', 'TSLA', 1, 3, 3, 'SELL', 2000, 20.0000, '2026-10-26 17:43:42', 'ACTIVE', '2026-10-26 17:43:42'),
(23, 'TDR-2FE1F38C', 'NVIDIA', 3, 3, 2, 'BUY', 4000, 10.0000, '2026-10-26 17:44:00', 'ACTIVE', '2026-10-26 17:44:01'),
(24, 'TDR-243A9045', 'NVIDIA', 1, 1, 3, 'BUY', 802, 20.0000, '2026-10-26 17:44:15', 'AMENDED', '2026-10-26 17:44:15'),
(25, 'TDR-619533D8', 'AAPL', 2, 2, 2, 'SELL', 100, 20.0000, '2026-10-26 17:47:08', 'ACTIVE', '2026-10-26 17:47:08'),
(26, 'TDR-0FB146DE', 'NVIDIA', 3, 1, 1, 'BUY', 1000, 20.0000, '2026-10-26 17:47:31', 'ACTIVE', '2026-10-26 17:47:31'),
(27, 'TDR-05DEF709', 'NVIDIA', 2, 2, 2, 'BUY', 2000, 20.0000, '2026-10-26 17:47:49', 'ACTIVE', '2026-10-26 17:47:49'),
(28, 'TDR-148ADF27', 'NVIDIA', 3, 3, 1, 'SELL', 29, 19.0000, '2026-10-26 17:48:06', 'ACTIVE', '2026-10-26 17:48:06'),
(29, 'TDR-2B7DD893', 'AAPL', 1, 1, 3, 'BUY', 100, 2.0000, '2026-10-26 17:48:33', 'ACTIVE', '2026-10-26 17:48:33'),
(30, 'TDR-9F9B9A6B', 'AAPL', 1, 1, 1, 'BUY', 2000, 10.0000, '2026-10-26 17:48:54', 'ACTIVE', '2026-10-26 17:48:55'),
(31, 'TDR-B0012C0C', 'MSFT', 3, 2, 3, 'SELL', 2000, 10.0000, '2026-10-26 17:49:16', 'ACTIVE', '2026-10-26 17:49:16'),
(32, 'TDR-B583F1A1', 'TSLA', 2, 1, 3, 'BUY', 500, 10.0000, '2026-10-26 17:49:38', 'ACTIVE', '2026-10-26 17:49:38'),
(33, 'TDR-46CE10D3', 'TSLA', 1, 2, 1, 'SELL', 20, 100.0000, '2026-10-26 17:49:55', 'ACTIVE', '2026-10-26 17:49:55'),
(34, 'TDR-FC315D5B', 'NVIDIA', 2, 2, 2, 'BUY', 1000000, 7.8000, '2026-10-26 17:50:25', 'ACTIVE', '2026-10-26 17:50:25'),
(35, 'TDR-E6941F79', 'TSLA', 3, 3, 1, 'SELL', 400, 20.0000, '2026-10-26 17:50:50', 'ACTIVE', '2026-10-26 17:50:50'),
(36, 'TDR-7F4421EF', 'AAPL', 1, 3, 3, 'SELL', 200, 10.0000, '2026-10-26 17:51:05', 'ACTIVE', '2026-10-26 17:51:05'),
(37, 'TDR-12EB8565', 'MSFT', 3, 2, 3, 'BUY', 40000, 5.6000, '2026-10-26 17:51:28', 'ACTIVE', '2026-10-26 17:51:28'),
(38, 'TDR-96A12B45', 'AAPL', 2, 2, 1, 'BUY', 8000, 5.4000, '2026-10-26 17:52:28', 'ACTIVE', '2026-10-26 17:52:28'),
(39, 'TDR-A588031B', 'TSLA', 1, 3, 3, 'BUY', 9000, 20.0000, '2026-10-26 17:52:44', 'ACTIVE', '2026-10-26 17:52:44'),
(40, 'TDR-83F8559A', 'MSFT', 3, 3, 1, 'SELL', 1000, 60.0000, '2026-10-26 17:53:02', 'ACTIVE', '2026-10-26 17:53:02'),
(41, 'TDR-E85B2E76', 'AAPL', 1, 3, 3, 'BUY', 20000, 4.3000, '2026-10-26 17:54:00', 'ACTIVE', '2026-10-26 17:54:00'),
(42, 'TDR-18F752D8', 'MSFT', 2, 2, 2, 'BUY', 5000, 6.4000, '2026-10-26 17:54:15', 'ACTIVE', '2026-10-26 17:54:15'),
(43, 'TDR-7066CCC2', 'NVIDIA', 1, 2, 3, 'BUY', 7000, 4.4000, '2026-10-26 17:54:37', 'ACTIVE', '2026-10-26 17:54:37'),
(44, 'TDR-CA9F303C', 'TSLA', 2, 2, 3, 'SELL', 2000, 10.0000, '2026-10-26 17:54:52', 'ACTIVE', '2026-10-26 17:54:52'),
(45, 'TDR-EA6A1314', 'TSLA', 2, 3, 3, 'BUY', 10000, 20.0000, '2026-10-26 17:55:16', 'ACTIVE', '2026-10-26 17:55:16'),
(46, 'TDR-53BCE5DD', 'TSLA', 1, 2, 3, 'BUY', 1000, 0.4000, '2026-10-26 17:55:33', 'ACTIVE', '2026-10-26 17:55:33'),
(47, 'TDR-82CC9E18', 'NVIDIA', 1, 3, 2, 'BUY', 5000, 10.0000, '2026-10-26 17:55:51', 'ACTIVE', '2026-10-26 17:55:51'),
(48, 'TDR-336E03FA', 'AAPL', 1, 2, 3, 'SELL', 3000, 2.5000, '2026-10-26 17:56:17', 'ACTIVE', '2026-10-26 17:56:17'),
(49, 'TDR-EFB7C125', 'NVIDIA', 1, 2, 3, 'BUY', 80000, 5.3000, '2026-10-26 17:56:38', 'ACTIVE', '2026-10-26 17:56:38'),
(50, 'TDR-83B93D01', 'MSFT', 2, 2, 2, 'BUY', 500000, 3.4000, '2026-10-26 17:56:53', 'ACTIVE', '2026-10-26 17:56:53'),
(51, 'TDR-3BDBDECA', 'AAPL', 2, 2, 2, 'BUY', 8300, 4.2000, '2026-10-26 17:57:16', 'ACTIVE', '2026-10-26 17:57:16'),
(52, 'TDR-BAC48684', 'MSFT', 2, 3, 2, 'SELL', 5000, 10.0000, '2026-10-26 17:57:45', 'ACTIVE', '2026-10-26 17:57:45'),
(53, 'TDR-ADEC5FF5', 'MSFT', 1, 2, 3, 'SELL', 2000, 8.9000, '2026-10-26 17:58:32', 'ACTIVE', '2026-10-26 17:58:32'),
(54, 'TDR-65587891', 'NVIDIA', 1, 3, 3, 'BUY', 7300, 2.4000, '2026-10-26 17:58:53', 'ACTIVE', '2026-10-26 17:58:53'),
(55, 'TDR-5927DCD0', 'AAPL', 1, 3, 3, 'SELL', 200, 1000.0000, '2026-10-26 17:59:12', 'ACTIVE', '2026-10-26 17:59:13'),
(56, 'TDR-7E0A2180', 'NVIDIA', 2, 3, 3, 'SELL', 600, 2.3000, '2026-10-26 17:59:34', 'ACTIVE', '2026-10-26 17:59:35'),
(57, 'TDR-B0ED9805', 'AAPL', 3, 2, 1, 'BUY', 20000, 10.0000, '2026-10-26 18:00:33', 'ACTIVE', '2026-10-26 18:00:33'),
(58, 'TDR-5486B911', 'MSFT', 2, 3, 3, 'BUY', 6000, 10.0000, '2026-10-26 18:01:02', 'ACTIVE', '2026-10-26 18:01:02'),
(59, 'TDR-4F2FF872', 'MSFT', 1, 3, 3, 'BUY', 30000, 10.0000, '2026-10-26 18:01:24', 'ACTIVE', '2026-10-26 18:01:24'),
(60, 'TDR-2AFBDC12', 'AAPL', 2, 3, 3, 'BUY', 100000, 3.5000, '2026-10-26 18:01:41', 'ACTIVE', '2026-10-26 18:01:41'),
(61, 'TDR-793F5E9D', 'MSFT', 1, 2, 3, 'BUY', 2000, 1.2000, '2026-10-26 18:02:17', 'ACTIVE', '2026-10-26 18:02:17'),
(62, 'TDR-15B87575', 'NVIDIA', 2, 3, 3, 'SELL', 3000, 20.0000, '2026-10-26 18:02:40', 'ACTIVE', '2026-10-26 18:02:40'),
(63, 'TDR-BCE6987B', 'NVIDIA', 2, 3, 3, 'SELL', 20000, 20.0000, '2026-10-26 18:03:02', 'ACTIVE', '2026-10-26 18:03:02'),
(64, 'TDR-A893A64E', 'TSLA', 2, 3, 3, 'SELL', 300, 10.0000, '2026-10-26 18:03:17', 'ACTIVE', '2026-10-26 18:03:17'),
(65, 'TDR-FA1E9B0E', 'AAPL', 1, 2, 3, 'BUY', 40200, 4.2000, '2026-10-26 18:04:09', 'ACTIVE', '2026-10-26 18:04:09'),
(66, 'TDR-FA168728', 'MSFT', 1, 3, 3, 'BUY', 2200, 6.4000, '2026-10-26 18:04:34', 'ACTIVE', '2026-10-26 18:04:34'),
(67, 'TDR-65232391', 'TSLA', 1, 2, 2, 'BUY', 1200, 3.1000, '2026-10-26 18:04:57', 'ACTIVE', '2026-10-26 18:04:57'),
(68, 'TDR-68B8BD9C', 'MSFT', 3, 2, 3, 'BUY', 30200, 6.3000, '2026-10-26 18:05:18', 'ACTIVE', '2026-10-26 18:05:18'),
(69, 'TDR-4189F42B', 'AAPL', 3, 1, 1, 'BUY', 1003, 20.0000, '2026-10-26 18:05:37', 'ACTIVE', '2026-10-26 18:05:37'),
(70, 'TDR-FA10ACA4', 'TSLA', 2, 3, 1, 'SELL', 700, 4.3000, '2026-10-26 18:06:11', 'ACTIVE', '2026-10-26 18:06:11'),
(71, 'TDR-3C05A6EE', 'MSFT', 3, 3, 3, 'SELL', 700, 20.0000, '2026-10-26 18:06:31', 'ACTIVE', '2026-10-26 18:06:31'),
(72, 'TDR-E5201083', 'NVIDIA', 1, 3, 3, 'SELL', 5004, 200.0000, '2026-10-26 18:06:52', 'ACTIVE', '2026-10-26 18:06:52'),
(73, 'TDR-6531FBE2', 'MSFT', 2, 2, 3, 'SELL', 900, 20.0000, '2026-10-26 18:07:31', 'ACTIVE', '2026-10-26 18:07:32'),
(74, 'TDR-970BC17A', 'MSFT', 2, 3, 2, 'SELL', 7050, 2.4000, '2026-10-26 18:07:57', 'ACTIVE', '2026-10-26 18:07:57'),
(75, 'TDR-F7FDDE63', 'MSFT', 1, 3, 3, 'BUY', 3000, 10.0000, '2026-10-26 18:08:19', 'ACTIVE', '2026-10-26 18:08:19'),
(76, 'TDR-4CE48CEA', 'MSFT', 2, 2, 3, 'SELL', 90, 20.0000, '2026-10-26 18:08:36', 'ACTIVE', '2026-10-26 18:08:36'),
(77, 'TDR-C853BA1E', 'MSFT', 1, 1, 3, 'BUY', 5000, 7.4000, '2026-10-26 18:08:53', 'ACTIVE', '2026-10-26 18:08:53'),
(78, 'TDR-1F36D2E1', 'TSLA', 2, 3, 2, 'SELL', 200, 10.0000, '2026-10-26 18:09:09', 'ACTIVE', '2026-10-26 18:09:09'),
(79, 'TDR-DF22E39E', 'TSLA', 1, 1, 3, 'SELL', 2000, 30.0000, '2026-10-26 18:09:32', 'ACTIVE', '2026-10-26 18:09:32'),
(80, 'TDR-51DAA9C2', 'TSLA', 2, 3, 3, 'BUY', 4200, 10.0000, '2026-10-26 18:09:56', 'ACTIVE', '2026-10-26 18:09:56'),
(81, 'TDR-569C7EA8', 'NVIDIA', 3, 3, 3, 'SELL', 2000, 10.0000, '2026-10-26 18:10:10', 'ACTIVE', '2026-10-26 18:10:10'),
(82, 'TDR-E7B9FB6E', 'AAPL', 3, 3, 3, 'BUY', 10000, 58.0000, '2026-10-26 18:10:44', 'ACTIVE', '2026-10-26 18:10:44'),
(83, 'TDR-C8D1615A', 'MSFT', 2, 3, 3, 'BUY', 600, 200.0000, '2026-10-26 18:10:57', 'ACTIVE', '2026-10-26 18:10:57'),
(84, 'TDR-1705C98E', 'TSLA', 1, 2, 2, 'BUY', 30000, 5.5000, '2026-10-26 18:11:25', 'ACTIVE', '2026-10-26 18:11:25'),
(85, 'TDR-545D19CA', 'NVIDIA', 1, 1, 1, 'BUY', 50000, 4.6000, '2026-10-26 18:11:42', 'ACTIVE', '2026-10-26 18:11:42'),
(86, 'TDR-FCCCEE00', 'TSLA', 2, 2, 2, 'BUY', 70000, 3.4000, '2026-10-26 18:12:01', 'ACTIVE', '2026-10-26 18:12:01'),
(87, 'TDR-EBAA6EDB', 'MSFT', 3, 2, 3, 'BUY', 10000, 20.0000, '2026-10-26 18:12:21', 'ACTIVE', '2026-10-26 18:12:21'),
(88, 'TDR-BE550454', 'TSLA', 1, 3, 3, 'SELL', 2000, 20.0000, '2026-10-26 18:12:38', 'ACTIVE', '2026-10-26 18:12:38'),
(89, 'TDR-B52CCA31', 'AAPL', 2, 2, 2, 'SELL', 1000, 20.0000, '2026-10-26 18:12:52', 'ACTIVE', '2026-10-26 18:12:52'),
(90, 'TDR-9905F036', 'AAPL', 2, 3, 2, 'BUY', 20000, 20.0000, '2026-10-26 18:13:24', 'ACTIVE', '2026-10-26 18:13:24'),
(91, 'TDR-CACADB36', 'MSFT', 3, 3, 3, 'SELL', 1200, 75.0000, '2026-10-26 18:13:51', 'ACTIVE', '2026-10-26 18:13:51'),
(92, 'TDR-4CA98336', 'NVIDIA', 1, 3, 2, 'BUY', 70200, 52.0000, '2026-10-26 18:14:12', 'ACTIVE', '2026-10-26 18:14:12'),
(93, 'TDR-CCF02B47', 'AAPL', 3, 3, 3, 'BUY', 20000, 10.0000, '2026-10-26 18:14:26', 'ACTIVE', '2026-10-26 18:14:26'),
(94, 'TDR-782CCD66', 'NVIDIA', 3, 3, 3, 'SELL', 30000, 20.0000, '2026-10-26 18:14:44', 'ACTIVE', '2026-10-26 18:14:44'),
(95, 'TDR-7722CFCC', 'TSLA', 1, 3, 3, 'SELL', 20000, 7.4000, '2026-10-26 18:15:00', 'ACTIVE', '2026-10-26 18:15:00'),
(96, 'TDR-80E630A2', 'TSLA', 1, 3, 3, 'BUY', 9000, 7.4000, '2026-10-26 18:15:33', 'ACTIVE', '2026-10-26 18:15:33'),
(97, 'TDR-E60DD0D4', 'TSLA', 2, 2, 2, 'BUY', 30000, 75.0000, '2026-10-26 18:16:02', 'ACTIVE', '2026-10-26 18:16:02'),
(98, 'TDR-91965AE8', 'TSLA', 1, 3, 1, 'BUY', 5000, 20.0000, '2026-10-26 18:16:20', 'ACTIVE', '2026-10-26 18:16:20'),
(99, 'TDR-E107264F', 'MSFT', 3, 2, 3, 'SELL', 30000, 20.0000, '2026-10-26 18:16:46', 'ACTIVE', '2026-10-26 18:16:46'),
(100, 'TDR-591CA09D', 'AAPL', 2, 3, 1, 'SELL', 1000, 20.0000, '2026-10-26 18:16:59', 'ACTIVE', '2026-10-26 18:16:59');

--
-- Triggers `trades`
--
DELIMITER $$
CREATE TRIGGER `after_trades_delete` AFTER DELETE ON `trades` FOR EACH ROW BEGIN
    INSERT INTO `trades_audit` (
        `audit_action`, `id`, `trade_id`, `symbol`, `trader_id`, `book_id`, 
        `counterparty_id`, `side`, `quantity`, `price`, `notional_value`, 
        `trade_timestamp`, `status`, `created_at`
    ) VALUES (
        'DELETE', OLD.`id`, OLD.`trade_id`, OLD.`symbol`, OLD.`trader_id`, OLD.`book_id`, 
        OLD.`counterparty_id`, OLD.`side`, OLD.`quantity`, OLD.`price`, OLD.`notional_value`, 
        OLD.`trade_timestamp`, OLD.`status`, OLD.`created_at`
    );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_trades_insert` AFTER INSERT ON `trades` FOR EACH ROW BEGIN
    INSERT INTO `trades_audit` (
        `audit_action`, `id`, `trade_id`, `symbol`, `trader_id`, `book_id`, 
        `counterparty_id`, `side`, `quantity`, `price`, `notional_value`, 
        `trade_timestamp`, `status`, `created_at`
    ) VALUES (
        'INSERT', NEW.`id`, NEW.`trade_id`, NEW.`symbol`, NEW.`trader_id`, NEW.`book_id`, 
        NEW.`counterparty_id`, NEW.`side`, NEW.`quantity`, NEW.`price`, NEW.`notional_value`, 
        NEW.`trade_timestamp`, NEW.`status`, NEW.`created_at`
    );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_trades_update` AFTER UPDATE ON `trades` FOR EACH ROW BEGIN
    INSERT INTO `trades_audit` (
        `audit_action`, `id`, `trade_id`, `symbol`, `trader_id`, `book_id`, 
        `counterparty_id`, `side`, `quantity`, `price`, `notional_value`, 
        `trade_timestamp`, `status`, `created_at`
    ) VALUES (
        'UPDATE', NEW.`id`, NEW.`trade_id`, NEW.`symbol`, NEW.`trader_id`, NEW.`book_id`, 
        NEW.`counterparty_id`, NEW.`side`, NEW.`quantity`, NEW.`price`, NEW.`notional_value`, 
        NEW.`trade_timestamp`, NEW.`status`, NEW.`created_at`
    );
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `trades_audit`
--

CREATE TABLE `trades_audit` (
  `audit_id` int(11) NOT NULL,
  `audit_action` enum('INSERT','UPDATE','DELETE') NOT NULL,
  `audit_timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `audit_user` varchar(100) DEFAULT current_user(),
  `id` int(11) NOT NULL,
  `trade_id` varchar(50) NOT NULL,
  `symbol` varchar(20) NOT NULL,
  `trader_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `counterparty_id` int(11) NOT NULL,
  `side` enum('BUY','SELL') NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(18,4) NOT NULL,
  `notional_value` decimal(18,4) DEFAULT NULL,
  `trade_timestamp` datetime NOT NULL,
  `status` enum('ACTIVE','CANCELLED','AMENDED') NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trades_audit`
--

INSERT INTO `trades_audit` (`audit_id`, `audit_action`, `audit_timestamp`, `audit_user`, `id`, `trade_id`, `symbol`, `trader_id`, `book_id`, `counterparty_id`, `side`, `quantity`, `price`, `notional_value`, `trade_timestamp`, `status`, `created_at`) VALUES
(1, 'INSERT', '2026-10-26 17:19:26', 'root@localhost', 1, 'TDR-F3D3DFFB', 'AAPL', 3, 3, 2, 'BUY', 1000, 1.5000, 1500.0000, '2026-10-26 17:19:26', 'ACTIVE', '2026-10-26 17:19:26'),
(2, 'UPDATE', '2026-10-26 17:20:04', 'root@localhost', 1, 'TDR-F3D3DFFB', 'AAPL', 1, 2, 3, 'BUY', 1000, 1.5000, 1500.0000, '2026-10-26 17:19:26', 'AMENDED', '2026-10-26 17:19:26'),
(3, 'INSERT', '2026-10-26 17:22:09', 'root@localhost', 2, 'TDR-3003F344', 'MSFT', 3, 2, 3, 'SELL', 1002, 20.0000, 20040.0000, '2026-10-26 17:22:09', 'ACTIVE', '2026-10-26 17:22:09'),
(4, 'INSERT', '2026-10-26 17:22:40', 'root@localhost', 3, 'TDR-A80AC3CF', 'TSLA', 3, 2, 2, 'SELL', 2000, 10.0000, 20000.0000, '2026-10-26 17:22:40', 'ACTIVE', '2026-10-26 17:22:40'),
(5, 'INSERT', '2026-10-26 17:36:35', 'root@localhost', 4, 'TDR-9D16B2F4', 'AAPL', 1, 3, 3, 'BUY', 10000, 2.3000, 23000.0000, '2026-10-26 17:36:35', 'ACTIVE', '2026-10-26 17:36:35'),
(6, 'INSERT', '2026-10-26 17:36:55', 'root@localhost', 5, 'TDR-1682FED2', 'NVIDIA', 3, 3, 2, 'SELL', 2000, 10.0000, 20000.0000, '2026-10-26 17:36:55', 'ACTIVE', '2026-10-26 17:36:55'),
(7, 'INSERT', '2026-10-26 17:37:16', 'root@localhost', 6, 'TDR-9C6998B9', 'TSLA', 1, 3, 2, 'BUY', 20000, 10.0000, 200000.0000, '2026-10-26 17:37:16', 'ACTIVE', '2026-10-26 17:37:16'),
(8, 'INSERT', '2026-10-26 17:37:40', 'root@localhost', 7, 'TDR-92A0984B', 'AAPL', 1, 2, 3, 'SELL', 20, 10.0000, 200.0000, '2026-10-26 17:37:40', 'ACTIVE', '2026-10-26 17:37:40'),
(9, 'INSERT', '2026-10-26 17:38:08', 'root@localhost', 8, 'TDR-1936A620', 'TSLA', 1, 3, 3, 'BUY', 1000, 5.2000, 5200.0000, '2026-10-26 17:38:08', 'ACTIVE', '2026-10-26 17:38:08'),
(10, 'INSERT', '2026-10-26 17:38:31', 'root@localhost', 9, 'TDR-495BD19D', 'NVIDIA', 3, 1, 3, 'BUY', 2000, 20.0000, 40000.0000, '2026-10-26 17:38:31', 'ACTIVE', '2026-10-26 17:38:31'),
(11, 'INSERT', '2026-10-26 17:38:54', 'root@localhost', 10, 'TDR-0D84FF80', 'MSFT', 1, 2, 3, 'BUY', 40000, 0.6000, 24000.0000, '2026-10-26 17:38:54', 'ACTIVE', '2026-10-26 17:38:54'),
(12, 'INSERT', '2026-10-26 17:39:12', 'root@localhost', 11, 'TDR-354ACD67', 'MSFT', 3, 1, 2, 'BUY', 600, 20.0000, 12000.0000, '2026-10-26 17:39:12', 'ACTIVE', '2026-10-26 17:39:12'),
(13, 'INSERT', '2026-10-26 17:39:51', 'root@localhost', 12, 'TDR-61EB76B2', 'AAPL', 1, 1, 3, 'SELL', 100, 10.0000, 1000.0000, '2026-10-26 17:39:51', 'ACTIVE', '2026-10-26 17:39:51'),
(14, 'INSERT', '2026-10-26 17:40:10', 'root@localhost', 13, 'TDR-67786FFE', 'AAPL', 3, 2, 1, 'BUY', 6000, 30.0000, 180000.0000, '2026-10-26 17:40:10', 'ACTIVE', '2026-10-26 17:40:10'),
(15, 'INSERT', '2026-10-26 17:40:31', 'root@localhost', 14, 'TDR-7C8C6FAC', 'MSFT', 3, 3, 3, 'BUY', 7000, 0.2000, 1400.0000, '2026-10-26 17:40:31', 'ACTIVE', '2026-10-26 17:40:31'),
(16, 'INSERT', '2026-10-26 17:40:49', 'root@localhost', 15, 'TDR-76E45FB9', 'MSFT', 1, 3, 3, 'SELL', 300, 50.0000, 15000.0000, '2026-10-26 17:40:49', 'ACTIVE', '2026-10-26 17:40:49'),
(17, 'INSERT', '2026-10-26 17:41:08', 'root@localhost', 16, 'TDR-66F85070', 'NVIDIA', 2, 3, 1, 'SELL', 100000, 6.3000, 630000.0000, '2026-10-26 17:41:08', 'ACTIVE', '2026-10-26 17:41:08'),
(18, 'INSERT', '2026-10-26 17:41:50', 'root@localhost', 17, 'TDR-F89DECDE', 'TSLA', 2, 1, 3, 'BUY', 10000, 9.1000, 91000.0000, '2026-10-26 17:41:50', 'ACTIVE', '2026-10-26 17:41:50'),
(19, 'INSERT', '2026-10-26 17:42:19', 'root@localhost', 18, 'TDR-4B3AAD1C', 'TSLA', 3, 1, 1, 'BUY', 3000, 5.4000, 16200.0000, '2026-10-26 17:42:19', 'ACTIVE', '2026-10-26 17:42:19'),
(20, 'INSERT', '2026-10-26 17:42:39', 'root@localhost', 19, 'TDR-B777E6C6', 'AAPL', 1, 1, 3, 'BUY', 10000, 3.5000, 35000.0000, '2026-10-26 17:42:39', 'ACTIVE', '2026-10-26 17:42:39'),
(21, 'INSERT', '2026-10-26 17:43:02', 'root@localhost', 20, 'TDR-302093E6', 'MSFT', 1, 3, 1, 'BUY', 400, 20.0000, 8000.0000, '2026-10-26 17:43:02', 'ACTIVE', '2026-10-26 17:43:02'),
(22, 'INSERT', '2026-10-26 17:43:18', 'root@localhost', 21, 'TDR-C7C39196', 'NVIDIA', 1, 2, 3, 'SELL', 100, 20.0000, 2000.0000, '2026-10-26 17:43:18', 'ACTIVE', '2026-10-26 17:43:18'),
(23, 'INSERT', '2026-10-26 17:43:42', 'root@localhost', 22, 'TDR-CA44D3E5', 'TSLA', 1, 3, 3, 'SELL', 2000, 20.0000, 40000.0000, '2026-10-26 17:43:42', 'ACTIVE', '2026-10-26 17:43:42'),
(24, 'INSERT', '2026-10-26 17:44:01', 'root@localhost', 23, 'TDR-2FE1F38C', 'NVIDIA', 3, 3, 2, 'BUY', 4000, 10.0000, 40000.0000, '2026-10-26 17:44:00', 'ACTIVE', '2026-10-26 17:44:01'),
(25, 'INSERT', '2026-10-26 17:44:15', 'root@localhost', 24, 'TDR-243A9045', 'NVIDIA', 1, 1, 3, 'BUY', 800, 20.0000, 16000.0000, '2026-10-26 17:44:15', 'ACTIVE', '2026-10-26 17:44:15'),
(26, 'UPDATE', '2026-10-26 17:45:14', 'root@localhost', 24, 'TDR-243A9045', 'NVIDIA', 1, 1, 3, 'BUY', 802, 20.0000, 16040.0000, '2026-10-26 17:44:15', 'AMENDED', '2026-10-26 17:44:15'),
(27, 'INSERT', '2026-10-26 17:47:08', 'root@localhost', 25, 'TDR-619533D8', 'AAPL', 2, 2, 2, 'SELL', 100, 20.0000, 2000.0000, '2026-10-26 17:47:08', 'ACTIVE', '2026-10-26 17:47:08'),
(28, 'INSERT', '2026-10-26 17:47:31', 'root@localhost', 26, 'TDR-0FB146DE', 'NVIDIA', 3, 1, 1, 'BUY', 1000, 20.0000, 20000.0000, '2026-10-26 17:47:31', 'ACTIVE', '2026-10-26 17:47:31'),
(29, 'INSERT', '2026-10-26 17:47:49', 'root@localhost', 27, 'TDR-05DEF709', 'NVIDIA', 2, 2, 2, 'BUY', 2000, 20.0000, 40000.0000, '2026-10-26 17:47:49', 'ACTIVE', '2026-10-26 17:47:49'),
(30, 'INSERT', '2026-10-26 17:48:06', 'root@localhost', 28, 'TDR-148ADF27', 'NVIDIA', 3, 3, 1, 'SELL', 29, 19.0000, 551.0000, '2026-10-26 17:48:06', 'ACTIVE', '2026-10-26 17:48:06'),
(31, 'INSERT', '2026-10-26 17:48:33', 'root@localhost', 29, 'TDR-2B7DD893', 'AAPL', 1, 1, 3, 'BUY', 100, 2.0000, 200.0000, '2026-10-26 17:48:33', 'ACTIVE', '2026-10-26 17:48:33'),
(32, 'INSERT', '2026-10-26 17:48:55', 'root@localhost', 30, 'TDR-9F9B9A6B', 'AAPL', 1, 1, 1, 'BUY', 2000, 10.0000, 20000.0000, '2026-10-26 17:48:54', 'ACTIVE', '2026-10-26 17:48:55'),
(33, 'INSERT', '2026-10-26 17:49:16', 'root@localhost', 31, 'TDR-B0012C0C', 'MSFT', 3, 2, 3, 'SELL', 2000, 10.0000, 20000.0000, '2026-10-26 17:49:16', 'ACTIVE', '2026-10-26 17:49:16'),
(34, 'INSERT', '2026-10-26 17:49:38', 'root@localhost', 32, 'TDR-B583F1A1', 'TSLA', 2, 1, 3, 'BUY', 500, 10.0000, 5000.0000, '2026-10-26 17:49:38', 'ACTIVE', '2026-10-26 17:49:38'),
(35, 'INSERT', '2026-10-26 17:49:55', 'root@localhost', 33, 'TDR-46CE10D3', 'TSLA', 1, 2, 1, 'SELL', 20, 100.0000, 2000.0000, '2026-10-26 17:49:55', 'ACTIVE', '2026-10-26 17:49:55'),
(36, 'INSERT', '2026-10-26 17:50:25', 'root@localhost', 34, 'TDR-FC315D5B', 'NVIDIA', 2, 2, 2, 'BUY', 1000000, 7.8000, 7800000.0000, '2026-10-26 17:50:25', 'ACTIVE', '2026-10-26 17:50:25'),
(37, 'INSERT', '2026-10-26 17:50:50', 'root@localhost', 35, 'TDR-E6941F79', 'TSLA', 3, 3, 1, 'SELL', 400, 20.0000, 8000.0000, '2026-10-26 17:50:50', 'ACTIVE', '2026-10-26 17:50:50'),
(38, 'INSERT', '2026-10-26 17:51:05', 'root@localhost', 36, 'TDR-7F4421EF', 'AAPL', 1, 3, 3, 'SELL', 200, 10.0000, 2000.0000, '2026-10-26 17:51:05', 'ACTIVE', '2026-10-26 17:51:05'),
(39, 'INSERT', '2026-10-26 17:51:28', 'root@localhost', 37, 'TDR-12EB8565', 'MSFT', 3, 2, 3, 'BUY', 40000, 5.6000, 224000.0000, '2026-10-26 17:51:28', 'ACTIVE', '2026-10-26 17:51:28'),
(40, 'INSERT', '2026-10-26 17:52:28', 'root@localhost', 38, 'TDR-96A12B45', 'AAPL', 2, 2, 1, 'BUY', 8000, 5.4000, 43200.0000, '2026-10-26 17:52:28', 'ACTIVE', '2026-10-26 17:52:28'),
(41, 'INSERT', '2026-10-26 17:52:44', 'root@localhost', 39, 'TDR-A588031B', 'TSLA', 1, 3, 3, 'BUY', 9000, 20.0000, 180000.0000, '2026-10-26 17:52:44', 'ACTIVE', '2026-10-26 17:52:44'),
(42, 'INSERT', '2026-10-26 17:53:02', 'root@localhost', 40, 'TDR-83F8559A', 'MSFT', 3, 3, 1, 'SELL', 1000, 60.0000, 60000.0000, '2026-10-26 17:53:02', 'ACTIVE', '2026-10-26 17:53:02'),
(43, 'INSERT', '2026-10-26 17:54:00', 'root@localhost', 41, 'TDR-E85B2E76', 'AAPL', 1, 3, 3, 'BUY', 20000, 4.3000, 86000.0000, '2026-10-26 17:54:00', 'ACTIVE', '2026-10-26 17:54:00'),
(44, 'INSERT', '2026-10-26 17:54:15', 'root@localhost', 42, 'TDR-18F752D8', 'MSFT', 2, 2, 2, 'BUY', 5000, 6.4000, 32000.0000, '2026-10-26 17:54:15', 'ACTIVE', '2026-10-26 17:54:15'),
(45, 'INSERT', '2026-10-26 17:54:37', 'root@localhost', 43, 'TDR-7066CCC2', 'NVIDIA', 1, 2, 3, 'BUY', 7000, 4.4000, 30800.0000, '2026-10-26 17:54:37', 'ACTIVE', '2026-10-26 17:54:37'),
(46, 'INSERT', '2026-10-26 17:54:52', 'root@localhost', 44, 'TDR-CA9F303C', 'TSLA', 2, 2, 3, 'SELL', 2000, 10.0000, 20000.0000, '2026-10-26 17:54:52', 'ACTIVE', '2026-10-26 17:54:52'),
(47, 'INSERT', '2026-10-26 17:55:16', 'root@localhost', 45, 'TDR-EA6A1314', 'TSLA', 2, 3, 3, 'BUY', 10000, 20.0000, 200000.0000, '2026-10-26 17:55:16', 'ACTIVE', '2026-10-26 17:55:16'),
(48, 'INSERT', '2026-10-26 17:55:33', 'root@localhost', 46, 'TDR-53BCE5DD', 'TSLA', 1, 2, 3, 'BUY', 1000, 0.4000, 400.0000, '2026-10-26 17:55:33', 'ACTIVE', '2026-10-26 17:55:33'),
(49, 'INSERT', '2026-10-26 17:55:51', 'root@localhost', 47, 'TDR-82CC9E18', 'NVIDIA', 1, 3, 2, 'BUY', 5000, 10.0000, 50000.0000, '2026-10-26 17:55:51', 'ACTIVE', '2026-10-26 17:55:51'),
(50, 'INSERT', '2026-10-26 17:56:17', 'root@localhost', 48, 'TDR-336E03FA', 'AAPL', 1, 2, 3, 'SELL', 3000, 2.5000, 7500.0000, '2026-10-26 17:56:17', 'ACTIVE', '2026-10-26 17:56:17'),
(51, 'INSERT', '2026-10-26 17:56:38', 'root@localhost', 49, 'TDR-EFB7C125', 'NVIDIA', 1, 2, 3, 'BUY', 80000, 5.3000, 424000.0000, '2026-10-26 17:56:38', 'ACTIVE', '2026-10-26 17:56:38'),
(52, 'INSERT', '2026-10-26 17:56:53', 'root@localhost', 50, 'TDR-83B93D01', 'MSFT', 2, 2, 2, 'BUY', 500000, 3.4000, 1700000.0000, '2026-10-26 17:56:53', 'ACTIVE', '2026-10-26 17:56:53'),
(53, 'INSERT', '2026-10-26 17:57:16', 'root@localhost', 51, 'TDR-3BDBDECA', 'AAPL', 2, 2, 2, 'BUY', 8300, 4.2000, 34860.0000, '2026-10-26 17:57:16', 'ACTIVE', '2026-10-26 17:57:16'),
(54, 'INSERT', '2026-10-26 17:57:45', 'root@localhost', 52, 'TDR-BAC48684', 'MSFT', 2, 3, 2, 'SELL', 5000, 10.0000, 50000.0000, '2026-10-26 17:57:45', 'ACTIVE', '2026-10-26 17:57:45'),
(55, 'INSERT', '2026-10-26 17:58:32', 'root@localhost', 53, 'TDR-ADEC5FF5', 'MSFT', 1, 2, 3, 'SELL', 2000, 8.9000, 17800.0000, '2026-10-26 17:58:32', 'ACTIVE', '2026-10-26 17:58:32'),
(56, 'INSERT', '2026-10-26 17:58:53', 'root@localhost', 54, 'TDR-65587891', 'NVIDIA', 1, 3, 3, 'BUY', 7300, 2.4000, 17520.0000, '2026-10-26 17:58:53', 'ACTIVE', '2026-10-26 17:58:53'),
(57, 'INSERT', '2026-10-26 17:59:13', 'root@localhost', 55, 'TDR-5927DCD0', 'AAPL', 1, 3, 3, 'SELL', 200, 1000.0000, 200000.0000, '2026-10-26 17:59:12', 'ACTIVE', '2026-10-26 17:59:13'),
(58, 'INSERT', '2026-10-26 17:59:35', 'root@localhost', 56, 'TDR-7E0A2180', 'NVIDIA', 2, 3, 3, 'SELL', 600, 2.3000, 1380.0000, '2026-10-26 17:59:34', 'ACTIVE', '2026-10-26 17:59:35'),
(59, 'INSERT', '2026-10-26 18:00:33', 'root@localhost', 57, 'TDR-B0ED9805', 'AAPL', 3, 2, 1, 'BUY', 20000, 10.0000, 200000.0000, '2026-10-26 18:00:33', 'ACTIVE', '2026-10-26 18:00:33'),
(60, 'INSERT', '2026-10-26 18:01:02', 'root@localhost', 58, 'TDR-5486B911', 'MSFT', 2, 3, 3, 'BUY', 6000, 10.0000, 60000.0000, '2026-10-26 18:01:02', 'ACTIVE', '2026-10-26 18:01:02'),
(61, 'INSERT', '2026-10-26 18:01:24', 'root@localhost', 59, 'TDR-4F2FF872', 'MSFT', 1, 3, 3, 'BUY', 30000, 10.0000, 300000.0000, '2026-10-26 18:01:24', 'ACTIVE', '2026-10-26 18:01:24'),
(62, 'INSERT', '2026-10-26 18:01:41', 'root@localhost', 60, 'TDR-2AFBDC12', 'AAPL', 2, 3, 3, 'BUY', 100000, 3.5000, 350000.0000, '2026-10-26 18:01:41', 'ACTIVE', '2026-10-26 18:01:41'),
(63, 'INSERT', '2026-10-26 18:02:17', 'root@localhost', 61, 'TDR-793F5E9D', 'MSFT', 1, 2, 3, 'BUY', 2000, 1.2000, 2400.0000, '2026-10-26 18:02:17', 'ACTIVE', '2026-10-26 18:02:17'),
(64, 'INSERT', '2026-10-26 18:02:40', 'root@localhost', 62, 'TDR-15B87575', 'NVIDIA', 2, 3, 3, 'SELL', 3000, 20.0000, 60000.0000, '2026-10-26 18:02:40', 'ACTIVE', '2026-10-26 18:02:40'),
(65, 'INSERT', '2026-10-26 18:03:02', 'root@localhost', 63, 'TDR-BCE6987B', 'NVIDIA', 2, 3, 3, 'SELL', 20000, 20.0000, 400000.0000, '2026-10-26 18:03:02', 'ACTIVE', '2026-10-26 18:03:02'),
(66, 'INSERT', '2026-10-26 18:03:17', 'root@localhost', 64, 'TDR-A893A64E', 'TSLA', 2, 3, 3, 'SELL', 300, 10.0000, 3000.0000, '2026-10-26 18:03:17', 'ACTIVE', '2026-10-26 18:03:17'),
(67, 'INSERT', '2026-10-26 18:04:09', 'root@localhost', 65, 'TDR-FA1E9B0E', 'AAPL', 1, 2, 3, 'BUY', 40200, 4.2000, 168840.0000, '2026-10-26 18:04:09', 'ACTIVE', '2026-10-26 18:04:09'),
(68, 'INSERT', '2026-10-26 18:04:34', 'root@localhost', 66, 'TDR-FA168728', 'MSFT', 1, 3, 3, 'BUY', 2200, 6.4000, 14080.0000, '2026-10-26 18:04:34', 'ACTIVE', '2026-10-26 18:04:34'),
(69, 'INSERT', '2026-10-26 18:04:57', 'root@localhost', 67, 'TDR-65232391', 'TSLA', 1, 2, 2, 'BUY', 1200, 3.1000, 3720.0000, '2026-10-26 18:04:57', 'ACTIVE', '2026-10-26 18:04:57'),
(70, 'INSERT', '2026-10-26 18:05:18', 'root@localhost', 68, 'TDR-68B8BD9C', 'MSFT', 3, 2, 3, 'BUY', 30200, 6.3000, 190260.0000, '2026-10-26 18:05:18', 'ACTIVE', '2026-10-26 18:05:18'),
(71, 'INSERT', '2026-10-26 18:05:37', 'root@localhost', 69, 'TDR-4189F42B', 'AAPL', 3, 1, 1, 'BUY', 1003, 20.0000, 20060.0000, '2026-10-26 18:05:37', 'ACTIVE', '2026-10-26 18:05:37'),
(72, 'INSERT', '2026-10-26 18:06:11', 'root@localhost', 70, 'TDR-FA10ACA4', 'TSLA', 2, 3, 1, 'SELL', 700, 4.3000, 3010.0000, '2026-10-26 18:06:11', 'ACTIVE', '2026-10-26 18:06:11'),
(73, 'INSERT', '2026-10-26 18:06:31', 'root@localhost', 71, 'TDR-3C05A6EE', 'MSFT', 3, 3, 3, 'SELL', 700, 20.0000, 14000.0000, '2026-10-26 18:06:31', 'ACTIVE', '2026-10-26 18:06:31'),
(74, 'INSERT', '2026-10-26 18:06:52', 'root@localhost', 72, 'TDR-E5201083', 'NVIDIA', 1, 3, 3, 'SELL', 5004, 200.0000, 1000800.0000, '2026-10-26 18:06:52', 'ACTIVE', '2026-10-26 18:06:52'),
(75, 'INSERT', '2026-10-26 18:07:32', 'root@localhost', 73, 'TDR-6531FBE2', 'MSFT', 2, 2, 3, 'SELL', 900, 20.0000, 18000.0000, '2026-10-26 18:07:31', 'ACTIVE', '2026-10-26 18:07:32'),
(76, 'INSERT', '2026-10-26 18:07:57', 'root@localhost', 74, 'TDR-970BC17A', 'MSFT', 2, 3, 2, 'SELL', 7050, 2.4000, 16920.0000, '2026-10-26 18:07:57', 'ACTIVE', '2026-10-26 18:07:57'),
(77, 'INSERT', '2026-10-26 18:08:19', 'root@localhost', 75, 'TDR-F7FDDE63', 'MSFT', 1, 3, 3, 'BUY', 3000, 10.0000, 30000.0000, '2026-10-26 18:08:19', 'ACTIVE', '2026-10-26 18:08:19'),
(78, 'INSERT', '2026-10-26 18:08:36', 'root@localhost', 76, 'TDR-4CE48CEA', 'MSFT', 2, 2, 3, 'SELL', 90, 20.0000, 1800.0000, '2026-10-26 18:08:36', 'ACTIVE', '2026-10-26 18:08:36'),
(79, 'INSERT', '2026-10-26 18:08:53', 'root@localhost', 77, 'TDR-C853BA1E', 'MSFT', 1, 1, 3, 'BUY', 5000, 7.4000, 37000.0000, '2026-10-26 18:08:53', 'ACTIVE', '2026-10-26 18:08:53'),
(80, 'INSERT', '2026-10-26 18:09:09', 'root@localhost', 78, 'TDR-1F36D2E1', 'TSLA', 2, 3, 2, 'SELL', 200, 10.0000, 2000.0000, '2026-10-26 18:09:09', 'ACTIVE', '2026-10-26 18:09:09'),
(81, 'INSERT', '2026-10-26 18:09:32', 'root@localhost', 79, 'TDR-DF22E39E', 'TSLA', 1, 1, 3, 'SELL', 2000, 30.0000, 60000.0000, '2026-10-26 18:09:32', 'ACTIVE', '2026-10-26 18:09:32'),
(82, 'INSERT', '2026-10-26 18:09:56', 'root@localhost', 80, 'TDR-51DAA9C2', 'TSLA', 2, 3, 3, 'BUY', 4200, 10.0000, 42000.0000, '2026-10-26 18:09:56', 'ACTIVE', '2026-10-26 18:09:56'),
(83, 'INSERT', '2026-10-26 18:10:10', 'root@localhost', 81, 'TDR-569C7EA8', 'NVIDIA', 3, 3, 3, 'SELL', 2000, 10.0000, 20000.0000, '2026-10-26 18:10:10', 'ACTIVE', '2026-10-26 18:10:10'),
(84, 'INSERT', '2026-10-26 18:10:44', 'root@localhost', 82, 'TDR-E7B9FB6E', 'AAPL', 3, 3, 3, 'BUY', 10000, 58.0000, 580000.0000, '2026-10-26 18:10:44', 'ACTIVE', '2026-10-26 18:10:44'),
(85, 'INSERT', '2026-10-26 18:10:57', 'root@localhost', 83, 'TDR-C8D1615A', 'MSFT', 2, 3, 3, 'BUY', 600, 200.0000, 120000.0000, '2026-10-26 18:10:57', 'ACTIVE', '2026-10-26 18:10:57'),
(86, 'INSERT', '2026-10-26 18:11:25', 'root@localhost', 84, 'TDR-1705C98E', 'TSLA', 1, 2, 2, 'BUY', 30000, 5.5000, 165000.0000, '2026-10-26 18:11:25', 'ACTIVE', '2026-10-26 18:11:25'),
(87, 'INSERT', '2026-10-26 18:11:42', 'root@localhost', 85, 'TDR-545D19CA', 'NVIDIA', 1, 1, 1, 'BUY', 50000, 4.6000, 230000.0000, '2026-10-26 18:11:42', 'ACTIVE', '2026-10-26 18:11:42'),
(88, 'INSERT', '2026-10-26 18:12:01', 'root@localhost', 86, 'TDR-FCCCEE00', 'TSLA', 2, 2, 2, 'BUY', 70000, 3.4000, 238000.0000, '2026-10-26 18:12:01', 'ACTIVE', '2026-10-26 18:12:01'),
(89, 'INSERT', '2026-10-26 18:12:21', 'root@localhost', 87, 'TDR-EBAA6EDB', 'MSFT', 3, 2, 3, 'BUY', 10000, 20.0000, 200000.0000, '2026-10-26 18:12:21', 'ACTIVE', '2026-10-26 18:12:21'),
(90, 'INSERT', '2026-10-26 18:12:38', 'root@localhost', 88, 'TDR-BE550454', 'TSLA', 1, 3, 3, 'SELL', 2000, 20.0000, 40000.0000, '2026-10-26 18:12:38', 'ACTIVE', '2026-10-26 18:12:38'),
(91, 'INSERT', '2026-10-26 18:12:52', 'root@localhost', 89, 'TDR-B52CCA31', 'AAPL', 2, 2, 2, 'SELL', 1000, 20.0000, 20000.0000, '2026-10-26 18:12:52', 'ACTIVE', '2026-10-26 18:12:52'),
(92, 'INSERT', '2026-10-26 18:13:24', 'root@localhost', 90, 'TDR-9905F036', 'AAPL', 2, 3, 2, 'BUY', 20000, 20.0000, 400000.0000, '2026-10-26 18:13:24', 'ACTIVE', '2026-10-26 18:13:24'),
(93, 'INSERT', '2026-10-26 18:13:51', 'root@localhost', 91, 'TDR-CACADB36', 'MSFT', 3, 3, 3, 'SELL', 1200, 75.0000, 90000.0000, '2026-10-26 18:13:51', 'ACTIVE', '2026-10-26 18:13:51'),
(94, 'INSERT', '2026-10-26 18:14:12', 'root@localhost', 92, 'TDR-4CA98336', 'NVIDIA', 1, 3, 2, 'BUY', 70200, 52.0000, 3650400.0000, '2026-10-26 18:14:12', 'ACTIVE', '2026-10-26 18:14:12'),
(95, 'INSERT', '2026-10-26 18:14:26', 'root@localhost', 93, 'TDR-CCF02B47', 'AAPL', 3, 3, 3, 'BUY', 20000, 10.0000, 200000.0000, '2026-10-26 18:14:26', 'ACTIVE', '2026-10-26 18:14:26'),
(96, 'INSERT', '2026-10-26 18:14:44', 'root@localhost', 94, 'TDR-782CCD66', 'NVIDIA', 3, 3, 3, 'SELL', 30000, 20.0000, 600000.0000, '2026-10-26 18:14:44', 'ACTIVE', '2026-10-26 18:14:44'),
(97, 'INSERT', '2026-10-26 18:15:00', 'root@localhost', 95, 'TDR-7722CFCC', 'TSLA', 1, 3, 3, 'SELL', 20000, 7.4000, 148000.0000, '2026-10-26 18:15:00', 'ACTIVE', '2026-10-26 18:15:00'),
(98, 'INSERT', '2026-10-26 18:15:33', 'root@localhost', 96, 'TDR-80E630A2', 'TSLA', 1, 3, 3, 'BUY', 9000, 7.4000, 66600.0000, '2026-10-26 18:15:33', 'ACTIVE', '2026-10-26 18:15:33'),
(99, 'INSERT', '2026-10-26 18:16:02', 'root@localhost', 97, 'TDR-E60DD0D4', 'TSLA', 2, 2, 2, 'BUY', 30000, 75.0000, 2250000.0000, '2026-10-26 18:16:02', 'ACTIVE', '2026-10-26 18:16:02'),
(100, 'INSERT', '2026-10-26 18:16:20', 'root@localhost', 98, 'TDR-91965AE8', 'TSLA', 1, 3, 1, 'BUY', 5000, 20.0000, 100000.0000, '2026-10-26 18:16:20', 'ACTIVE', '2026-10-26 18:16:20'),
(101, 'INSERT', '2026-10-26 18:16:46', 'root@localhost', 99, 'TDR-E107264F', 'MSFT', 3, 2, 3, 'SELL', 30000, 20.0000, 600000.0000, '2026-10-26 18:16:46', 'ACTIVE', '2026-10-26 18:16:46'),
(102, 'INSERT', '2026-10-26 18:16:59', 'root@localhost', 100, 'TDR-591CA09D', 'AAPL', 2, 3, 1, 'SELL', 1000, 20.0000, 20000.0000, '2026-10-26 18:16:59', 'ACTIVE', '2026-10-26 18:16:59');

-- --------------------------------------------------------

--
-- Table structure for table `trade_login_history`
--

CREATE TABLE `trade_login_history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `username` varchar(100) NOT NULL,
  `login_status` enum('success','failed','locked') NOT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `trade_otp_codes`
--

CREATE TABLE `trade_otp_codes` (
  `id` bigint(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `otp_hash` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `verified` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trade_otp_codes`
--

INSERT INTO `trade_otp_codes` (`id`, `email`, `otp_hash`, `expires_at`, `verified`, `created_at`) VALUES
(1, 'ryan.amog@gmail.com', '$2b$10$1jgjDS4Y.1Kw/tBlih.0cu2DNGs/LSwUhttMr16LJDFrDyD1np2Y.', '2026-10-25 11:33:20', 1, '2026-10-25 03:23:20'),
(2, 'ryan.amog@gmail.com', '$2b$10$QxUyjd4QBFqmuZtv0q3wQODlr/IYbyHCr2iZL/r1XQpM8MfSr1E82', '2026-10-26 11:34:38', 1, '2026-10-26 03:24:38'),
(3, 'ryan.amog@gmail.com', '$2b$10$J1r2wTsE1aRLNjkIxgY3zeADyii3MXxchKH5aIhkXBJHLnUNJdEAe', '2026-10-26 16:18:08', 0, '2026-10-26 08:08:08'),
(4, 'ryan.amog@gmail.com', '$2b$10$7Qc0dO5xbbyOFYTET5vkbuK2Rx4pO9UHPsjmdlGq56IfDe3xyqHNu', '2026-10-26 16:19:47', 1, '2026-10-26 08:09:47'),
(5, 'ryan.amog@gmail.com', '$2b$10$GdIJSrtpwjQKrh8yRpLRUOeVqxYRMYCyxuo5q5vNlBzFu9sKZiQLe', '2026-10-26 16:30:04', 1, '2026-10-26 08:20:04'),
(6, 'ryan.amog@gmail.com', '$2b$10$jlz9GNcMmflRzlNBr18KJ.rMSREuDjd0MYZDc/7RP/froDPK38UCS', '2026-10-26 16:31:55', 1, '2026-10-26 08:21:55'),
(7, 'ryan.amog@gmail.com', '$2b$10$y8YD7HKhhQz1GxTQYzojP.tfHeeHIhJ64BaAOf.8ox2iyWCORruRy', '2026-10-26 16:35:24', 1, '2026-10-26 08:25:24'),
(8, 'ryan.amog@gmail.com', '$2b$10$yRz1oTB8X7A57w6fDTQ0fu/xxS/CCS628EZzCDJP43ajvnF1v..4a', '2026-10-26 16:45:14', 1, '2026-10-26 08:35:14'),
(9, 'ryan.amog@gmail.com', '$2b$10$PQ0j6Wj5HK1FZLickpguZ.YhIO/AQh/hZC.3Go8hiOsRcXIEPlujm', '2026-10-26 16:50:49', 1, '2026-10-26 08:40:49'),
(10, 'ryan.amog@gmail.com', '$2b$10$17Ti/bn7aGClhZ7cA11eluUSIj2pDM8g.H6TrMlJvc8Lr6z2UZNGu', '2026-10-26 16:54:43', 1, '2026-10-26 08:44:43'),
(11, 'ryan.amog@gmail.com', '$2b$10$xDpnTgYOHRAIL4/CT6LTaOdj8cpvAZ358U/93.QDeqsE7mJNjbXEi', '2026-10-26 16:58:32', 1, '2026-10-26 08:48:32'),
(12, 'ryan.amog@gmail.com', '$2b$10$L9wASn0ELWk4g0d3L.p3xOkMdnaKhJ28Fh2IxlawLKeA7R6VO8daO', '2026-10-26 17:06:03', 1, '2026-10-26 08:56:03'),
(13, 'ryan.amog@gmail.com', '$2b$10$VEMJFvaOUoIMLm9TfYUJeeH8v5HF0jdj7oG2KoiBaHzETbfGJOnKm', '2026-10-26 17:07:29', 0, '2026-10-26 08:57:29'),
(14, 'ryan.amog@gmail.com', '$2b$10$UjZxAgV45q8CKGIwOpCMeOr4HyNJQYZMyFhBjP1f3cZx4mWB4PNCe', '2026-10-26 17:07:42', 1, '2026-10-26 08:57:42'),
(15, 'ryan.amog@gmail.com', '$2b$10$wf81FrZ3csplwDUdL5wXXuHI2X6kHzVcCf0EQ/7VY4ofKleoyK0UW', '2026-10-26 17:13:38', 0, '2026-10-26 09:03:38'),
(16, 'ryan.amog@gmail.com', '$2b$10$sSBUfAE3pIQruwee1DN9BeyQP76/qMlo7HKdIztndnUZZ075ZM.ym', '2026-10-26 17:14:55', 0, '2026-10-26 09:04:55'),
(17, 'ryan.amog@gmail.com', '$2b$10$8rYrk4BKhbKbF1JO3DGCDug9dTbtUMN5.N4Kf7iCH3Ug/IzAPkYs6', '2026-10-26 17:16:44', 1, '2026-10-26 09:06:44'),
(18, 'ryan.amog@gmail.com', '$2b$10$4vI2yNso.fwcv64X.Tq8xegcSZqfEz3BdEwV7yBMWUXW2aBYdH7Qy', '2026-10-26 17:22:22', 0, '2026-10-26 09:12:22'),
(19, 'ryan.amog@gmail.com', '$2b$10$AgP3JtlhFv60lNdj1UJNu.0x0w7Pk84maxpN9FHHmPGGTR.kg4L5e', '2026-10-26 17:22:32', 0, '2026-10-26 09:12:32'),
(20, 'ryan.amog@gmail.com', '$2b$10$sW0VjRTRzBNLjFYEfDCWI.A0marXehWGv3rl8f8D/cgOdAL6JTmUy', '2026-10-26 17:23:22', 1, '2026-10-26 09:13:22'),
(21, 'ryan.amog@gmail.com', '$2b$10$prEnNpCx/tJVuNTsL2cXOesW2bLaNXBXxr3Rzerh4TE6t8vecX3Dm', '2026-10-26 17:24:43', 0, '2026-10-26 09:14:43'),
(22, 'ryan.amog@gmail.com', '$2b$10$fCwEFsOlqJmHbCicJHMKceF7HqZbB.dYv9LldGtiQUxATQNdhY.JG', '2026-10-26 17:24:50', 1, '2026-10-26 09:14:50'),
(23, 'ryan.amog@gmail.com', '$2b$10$ST5BKF4oEFRxxGwWMcVDfu.35hmt8wO/iYWmnmXfRVJeZjal4kfyG', '2026-10-26 17:35:41', 1, '2026-10-26 09:25:41'),
(24, 'ryan.amog@gmail.com', '$2b$10$XbkixIMhhc8YcIvj9n.ove7ENk/piKTwUm2r.4IhCaNEgYXwpcxxi', '2026-10-26 18:07:24', 1, '2026-10-26 09:57:24'),
(25, 'ryan.amog@gmail.com', '$2b$10$y5ZJ01YE1btwo0eqj2O4vec5vxMlcfrwk0SkQIMV1tvTEqXrPp0l6', '2026-10-26 19:33:25', 0, '2026-10-26 11:23:25'),
(26, 'ryan.amog@gmail.com', '$2b$10$uFeXgr9IeGvF5F0iWwzxHOkS5eB8X.H22Q1j1XwMcXAGjpy86GTQK', '2026-10-26 19:34:12', 1, '2026-10-26 11:24:12'),
(27, 'ryan.amog@gmail.com', '$2b$10$vwPj3uKYX0gOag7IDz/oBevfmZQqoRAIe4BXyQhYqnKS8wo1ce/aW', '2026-10-27 00:52:39', 1, '2026-10-26 16:42:39'),
(28, 'ryan.amog@gmail.com', '$2b$10$rIdl9MWQQF9dlriPNJbKTOhoEUBkOnFhzwzi/sLMQizblvW6RJFOq', '2026-10-27 01:13:44', 0, '2026-10-26 17:03:44'),
(29, 'ryan.amog@gmail.com', '$2b$10$bIjGMyWuYn8U0uOU2rCNSe7zhLg9LRbXcv34KBqAo8iwgM3yFEsbC', '2026-10-27 01:16:30', 0, '2026-10-26 17:06:30'),
(30, 'ryan.amog@gmail.com', '$2b$10$IAX7r.GvizFKrpJRN4XiUuHEee8QzanLfM87kqS8AlCjs0wFjAfPq', '2026-10-27 01:18:14', 1, '2026-10-26 17:08:14'),
(31, 'ryan.amog@gmail.com', '$2b$10$JQbVzsQw5TUOW0QSIeGV1.GtPWwAyo/3BeCJGLSlWuGLArIRJKrru', '2026-10-27 01:45:48', 1, '2026-10-26 17:35:48'),
(32, 'ryan.amog@gmail.com', '$2b$10$UkgLFLL9lBoMkICbL7o/hu1ujbuYELGAx9oxQJGunDI2aAxXzSjBO', '2026-10-27 12:55:42', 0, '2026-10-27 04:45:42');

-- --------------------------------------------------------

--
-- Table structure for table `trade_users`
--

CREATE TABLE `trade_users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `role` enum('admin','supervisor','user') NOT NULL,
  `failed_attempts` int(11) NOT NULL DEFAULT 0,
  `locked_until` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status_id` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trade_users`
--

INSERT INTO `trade_users` (`user_id`, `username`, `password_hash`, `firstname`, `lastname`, `role`, `failed_attempts`, `locked_until`, `last_login`, `created_at`, `update_at`, `status_id`) VALUES
(1, 'john@gmail.com', '$2a$12$l6w13DlT26BqClMoprNPcO63T7/MEaqBljE2UkQU11c816djGWtk2', 'John', 'Doe', 'admin', 0, NULL, NULL, '2026-10-20 16:05:14', '2026-10-27 05:18:48', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`book_id`),
  ADD UNIQUE KEY `book_name` (`book_name`);

--
-- Indexes for table `counterparties`
--
ALTER TABLE `counterparties`
  ADD PRIMARY KEY (`counterparty_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `instruments`
--
ALTER TABLE `instruments`
  ADD PRIMARY KEY (`symbol`);

--
-- Indexes for table `traders`
--
ALTER TABLE `traders`
  ADD PRIMARY KEY (`trader_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `trades`
--
ALTER TABLE `trades`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `trade_id` (`trade_id`),
  ADD KEY `symbol` (`symbol`),
  ADD KEY `counterparty_id` (`counterparty_id`),
  ADD KEY `idx_trade_timestamp` (`trade_timestamp`),
  ADD KEY `idx_trader` (`trader_id`),
  ADD KEY `idx_book` (`book_id`);

--
-- Indexes for table `trades_audit`
--
ALTER TABLE `trades_audit`
  ADD PRIMARY KEY (`audit_id`),
  ADD KEY `idx_trade_id` (`trade_id`),
  ADD KEY `idx_audit_timestamp` (`audit_timestamp`);

--
-- Indexes for table `trade_otp_codes`
--
ALTER TABLE `trade_otp_codes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `trade_users`
--
ALTER TABLE `trade_users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `book_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `counterparties`
--
ALTER TABLE `counterparties`
  MODIFY `counterparty_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `traders`
--
ALTER TABLE `traders`
  MODIFY `trader_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `trades`
--
ALTER TABLE `trades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `trades_audit`
--
ALTER TABLE `trades_audit`
  MODIFY `audit_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- AUTO_INCREMENT for table `trade_otp_codes`
--
ALTER TABLE `trade_otp_codes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `trade_users`
--
ALTER TABLE `trade_users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `trades`
--
ALTER TABLE `trades`
  ADD CONSTRAINT `trades_ibfk_1` FOREIGN KEY (`symbol`) REFERENCES `instruments` (`symbol`),
  ADD CONSTRAINT `trades_ibfk_2` FOREIGN KEY (`trader_id`) REFERENCES `traders` (`trader_id`),
  ADD CONSTRAINT `trades_ibfk_3` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`),
  ADD CONSTRAINT `trades_ibfk_4` FOREIGN KEY (`counterparty_id`) REFERENCES `counterparties` (`counterparty_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
