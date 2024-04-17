-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Creato il: Apr 17, 2024 alle 20:17
-- Versione del server: 5.7.34
-- Versione PHP: 7.4.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kakebo`
--
CREATE DATABASE IF NOT EXISTS `kakebo` DEFAULT CHARACTER SET ascii COLLATE ascii_general_ci;
USE `kakebo`;

-- --------------------------------------------------------

--
-- Struttura della tabella `kakebo_spese`
--

CREATE TABLE `kakebo_spese` (
  `id_spese` int(11) NOT NULL,
  `data_ora` date DEFAULT NULL,
  `spesa` double DEFAULT NULL,
  `id_tipo` int(11) DEFAULT NULL,
  `descrizione` varchar(200) DEFAULT NULL,
  `tipo_movimento` tinyint(1) DEFAULT '0' COMMENT '0 = spesa. 1 = entrata/salario.'
) ENGINE=InnoDB DEFAULT CHARSET=ascii;

-- --------------------------------------------------------

--
-- Struttura della tabella `kakebo_tipi`
--

CREATE TABLE `kakebo_tipi` (
  `id_tipo` int(11) NOT NULL,
  `tipo` varchar(80) DEFAULT NULL,
  `descrizione` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=ascii;

-- --------------------------------------------------------

--
-- Struttura della tabella `logs`
--

CREATE TABLE `logs` (
  `id` int(11) NOT NULL,
  `data_ora` datetime NOT NULL,
  `commento` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=ascii;

-- --------------------------------------------------------

--
-- Struttura della tabella `regali`
--

CREATE TABLE `regali` (
  `id_regalo` int(11) NOT NULL,
  `id_tipo` int(11) NOT NULL,
  `descrizione` varchar(100) DEFAULT NULL,
  `destinatario_regalo` varchar(100) DEFAULT NULL,
  `ricevuto_o_fatto` int(1) DEFAULT NULL COMMENT '1=ricevuto da qualcuno. 2=fatto a qualcuno.',
  `quando` datetime DEFAULT NULL,
  `evento` varchar(100) DEFAULT NULL,
  `id_spese` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=ascii COMMENT='Regali ricevuto e fatti';

-- --------------------------------------------------------

--
-- Struttura della tabella `viaggi`
--

CREATE TABLE `viaggi` (
  `id_viaggio` int(11) NOT NULL,
  `da_quando` datetime DEFAULT NULL,
  `a_quando` datetime DEFAULT NULL,
  `descrizione` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=ascii;

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `kakebo_spese`
--
ALTER TABLE `kakebo_spese`
  ADD PRIMARY KEY (`id_spese`),
  ADD KEY `FK__kakebo_tipi` (`id_tipo`);

--
-- Indici per le tabelle `kakebo_tipi`
--
ALTER TABLE `kakebo_tipi`
  ADD PRIMARY KEY (`id_tipo`);

--
-- Indici per le tabelle `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `regali`
--
ALTER TABLE `regali`
  ADD PRIMARY KEY (`id_regalo`),
  ADD KEY `regali_FK` (`id_tipo`),
  ADD KEY `regali_FK_1` (`id_spese`);

--
-- Indici per le tabelle `viaggi`
--
ALTER TABLE `viaggi`
  ADD PRIMARY KEY (`id_viaggio`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `kakebo_spese`
--
ALTER TABLE `kakebo_spese`
  MODIFY `id_spese` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `kakebo_tipi`
--
ALTER TABLE `kakebo_tipi`
  MODIFY `id_tipo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `regali`
--
ALTER TABLE `regali`
  MODIFY `id_regalo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `viaggi`
--
ALTER TABLE `viaggi`
  MODIFY `id_viaggio` int(11) NOT NULL AUTO_INCREMENT;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `kakebo_spese`
--
ALTER TABLE `kakebo_spese`
  ADD CONSTRAINT `FK__kakebo_tipi` FOREIGN KEY (`id_tipo`) REFERENCES `kakebo_tipi` (`id_tipo`) ON UPDATE CASCADE;

--
-- Limiti per la tabella `regali`
--
ALTER TABLE `regali`
  ADD CONSTRAINT `regali_FK` FOREIGN KEY (`id_tipo`) REFERENCES `kakebo_tipi` (`id_tipo`),
  ADD CONSTRAINT `regali_FK_1` FOREIGN KEY (`id_spese`) REFERENCES `kakebo_spese` (`id_spese`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
