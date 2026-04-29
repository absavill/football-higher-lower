import { useState, useRef, useEffect } from "react";
import { loadLeaderboard, saveScore } from "./supabase.js";

// ─── PLAYER DATABASE ──────────────────────────────────────────────────────────
const P = [
  { name:"Steven Gerrard",       club:"Liverpool",         nation:"England",   british:true,  era:"legend",  leagues:["epl"],           shirt:"#C8102E",bg:"#00B2A9", goals:186, assists:154, caps:114, trophies:9,  ballondors:0, gamesPlayed:710, yellowCards:104,redCards:6,  cleanSheets:0,   tackles:890,  worldcupGoals:0, worldcupApps:9,  worldcupAssists:0 },
  { name:"Frank Lampard",        club:"Chelsea",           nation:"England",   british:true,  era:"legend",  leagues:["epl"],           shirt:"#034694",bg:"#034694", goals:268, assists:176, caps:106, trophies:11, ballondors:0, gamesPlayed:648, yellowCards:96, redCards:3,  cleanSheets:0,   tackles:820,  worldcupGoals:1, worldcupApps:8,  worldcupAssists:1 },
  { name:"David Beckham",        club:"Man Utd",           nation:"England",   british:true,  era:"legend",  leagues:["epl","laliga"],  shirt:"#DA291C",bg:"#1a1a2e", goals:127, assists:265, caps:115, trophies:19, ballondors:0, gamesPlayed:724, yellowCards:98, redCards:5,  cleanSheets:0,   tackles:310,  worldcupGoals:1, worldcupApps:12, worldcupAssists:4 },
  { name:"Paul Scholes",         club:"Man Utd",           nation:"England",   british:true,  era:"legend",  leagues:["epl"],           shirt:"#DA291C",bg:"#DA291C", goals:155, assists:142, caps:66,  trophies:20, ballondors:0, gamesPlayed:718, yellowCards:97, redCards:1,  cleanSheets:0,   tackles:760,  worldcupGoals:0, worldcupApps:5,  worldcupAssists:0 },
  { name:"Rio Ferdinand",        club:"Man Utd",           nation:"England",   british:true,  era:"legend",  leagues:["epl"],           shirt:"#DA291C",bg:"#DA291C", goals:14,  assists:28,  caps:81,  trophies:16, ballondors:0, gamesPlayed:652, yellowCards:56, redCards:1,  cleanSheets:220, tackles:940,  worldcupGoals:0, worldcupApps:7,  worldcupAssists:0 },
  { name:"John Terry",           club:"Chelsea",           nation:"England",   british:true,  era:"legend",  leagues:["epl"],           shirt:"#034694",bg:"#034694", goals:67,  assists:24,  caps:78,  trophies:17, ballondors:0, gamesPlayed:717, yellowCards:116,redCards:8,  cleanSheets:240, tackles:1100, worldcupGoals:0, worldcupApps:4,  worldcupAssists:0 },
  { name:"Wayne Rooney",         club:"Man Utd",           nation:"England",   british:true,  era:"legend",  leagues:["epl"],           shirt:"#DA291C",bg:"#DA291C", goals:253, assists:147, caps:120, trophies:16, ballondors:0, gamesPlayed:559, yellowCards:101,redCards:6,  cleanSheets:0,   tackles:310,  worldcupGoals:2, worldcupApps:16, worldcupAssists:1 },
  { name:"Alan Shearer",         club:"Newcastle",         nation:"England",   british:true,  era:"legend",  leagues:["epl"],           shirt:"#000000",bg:"#41B6E6", goals:260, assists:98,  caps:63,  trophies:1,  ballondors:0, gamesPlayed:559, yellowCards:77, redCards:1,  cleanSheets:0,   tackles:180,  worldcupGoals:2, worldcupApps:7,  worldcupAssists:1 },
  { name:"Michael Owen",         club:"Liverpool",         nation:"England",   british:true,  era:"legend",  leagues:["epl"],           shirt:"#C8102E",bg:"#00B2A9", goals:222, assists:89,  caps:89,  trophies:10, ballondors:1, gamesPlayed:491, yellowCards:28, redCards:0,  cleanSheets:0,   tackles:95,   worldcupGoals:6, worldcupApps:11, worldcupAssists:0 },
  { name:"Ryan Giggs",           club:"Man Utd",           nation:"Wales",     british:true,  era:"legend",  leagues:["epl"],           shirt:"#DA291C",bg:"#00A2E0", goals:168, assists:271, caps:64,  trophies:34, ballondors:0, gamesPlayed:963, yellowCards:79, redCards:2,  cleanSheets:0,   tackles:420,  worldcupGoals:0, worldcupApps:0,  worldcupAssists:0 },
  { name:"Roy Keane",            club:"Man Utd",           nation:"Ireland",   british:true,  era:"legend",  leagues:["epl"],           shirt:"#DA291C",bg:"#169B62", goals:51,  assists:83,  caps:67,  trophies:17, ballondors:0, gamesPlayed:480, yellowCards:81, redCards:9,  cleanSheets:0,   tackles:1020, worldcupGoals:0, worldcupApps:5,  worldcupAssists:1 },
  { name:"Kenny Dalglish",       club:"Liverpool",         nation:"Scotland",  british:true,  era:"legend",  leagues:["epl"],           shirt:"#C8102E",bg:"#005EB8", goals:172, assists:163, caps:102, trophies:22, ballondors:0, gamesPlayed:515, yellowCards:12, redCards:0,  cleanSheets:0,   tackles:120,  worldcupGoals:1, worldcupApps:7,  worldcupAssists:2 },
  { name:"Robbie Keane",         club:"Tottenham",         nation:"Ireland",   british:true,  era:"legend",  leagues:["epl"],           shirt:"#132257",bg:"#169B62", goals:146, assists:74,  caps:146, trophies:6,  ballondors:0, gamesPlayed:610, yellowCards:55, redCards:2,  cleanSheets:0,   tackles:95,   worldcupGoals:2, worldcupApps:8,  worldcupAssists:1 },
  { name:"Gareth Bale",          club:"Tottenham",         nation:"Wales",     british:true,  era:"legend",  leagues:["epl","laliga"],  shirt:"#132257",bg:"#00A2E0", goals:220, assists:105, caps:111, trophies:20, ballondors:0, gamesPlayed:534, yellowCards:58, redCards:2,  cleanSheets:0,   tackles:190,  worldcupGoals:0, worldcupApps:0,  worldcupAssists:0 },
  { name:"Thierry Henry",        club:"Arsenal",           nation:"France",    british:false, era:"legend",  leagues:["epl","laliga"],  shirt:"#EF0107",bg:"#8B0000", goals:360, assists:183, caps:123, trophies:13, ballondors:0, gamesPlayed:786, yellowCards:73, redCards:3,  cleanSheets:0,   tackles:195,  worldcupGoals:3, worldcupApps:12, worldcupAssists:3 },
  { name:"Patrick Vieira",       club:"Arsenal",           nation:"France",    british:false, era:"legend",  leagues:["epl"],           shirt:"#EF0107",bg:"#063672", goals:62,  assists:98,  caps:107, trophies:14, ballondors:0, gamesPlayed:680, yellowCards:119,redCards:9,  cleanSheets:0,   tackles:1240, worldcupGoals:1, worldcupApps:12, worldcupAssists:3 },
  { name:"Dennis Bergkamp",      club:"Arsenal",           nation:"Netherlands",british:false,era:"legend",  leagues:["epl"],           shirt:"#EF0107",bg:"#FF6600", goals:120, assists:143, caps:79,  trophies:8,  ballondors:0, gamesPlayed:423, yellowCards:45, redCards:2,  cleanSheets:0,   tackles:165,  worldcupGoals:4, worldcupApps:14, worldcupAssists:3 },
  { name:"Peter Schmeichel",     club:"Man Utd",           nation:"Denmark",   british:false, era:"legend",  leagues:["epl"],           shirt:"#DA291C",bg:"#C60B1E", goals:1,   assists:4,   caps:129, trophies:15, ballondors:0, gamesPlayed:752, yellowCards:14, redCards:2,  cleanSheets:316, tackles:0,    worldcupGoals:0, worldcupApps:8,  worldcupAssists:0 },
  { name:"Mohamed Salah",        club:"Liverpool",         nation:"Egypt",     british:false, era:"current", leagues:["epl"],           shirt:"#C8102E",bg:"#000000", goals:378, assists:175, caps:101, trophies:11, ballondors:0, gamesPlayed:612, yellowCards:38, redCards:2,  cleanSheets:0,   tackles:155,  worldcupGoals:0, worldcupApps:3,  worldcupAssists:0 },
  { name:"Kevin De Bruyne",      club:"Man City",          nation:"Belgium",   british:false, era:"current", leagues:["epl"],           shirt:"#6CABDD",bg:"#000000", goals:130, assists:297, caps:101, trophies:15, ballondors:0, gamesPlayed:590, yellowCards:71, redCards:2,  cleanSheets:0,   tackles:360,  worldcupGoals:2, worldcupApps:16, worldcupAssists:6 },
  { name:"Erling Haaland",       club:"Man City",          nation:"Norway",    british:false, era:"current", leagues:["epl"],           shirt:"#6CABDD",bg:"#EF0107", goals:280, assists:56,  caps:42,  trophies:8,  ballondors:0, gamesPlayed:320, yellowCards:38, redCards:2,  cleanSheets:0,   tackles:80,   worldcupGoals:0, worldcupApps:0,  worldcupAssists:0 },
  { name:"Virgil van Dijk",      club:"Liverpool",         nation:"Netherlands",british:false,era:"current", leagues:["epl"],           shirt:"#C8102E",bg:"#FF6600", goals:53,  assists:28,  caps:78,  trophies:9,  ballondors:0, gamesPlayed:480, yellowCards:48, redCards:3,  cleanSheets:148, tackles:780,  worldcupGoals:3, worldcupApps:14, worldcupAssists:1 },
  { name:"Alisson Becker",       club:"Liverpool",         nation:"Brazil",    british:false, era:"current", leagues:["epl"],           shirt:"#C8102E",bg:"#009C3B", goals:1,   assists:3,   caps:72,  trophies:9,  ballondors:0, gamesPlayed:332, yellowCards:8,  redCards:0,  cleanSheets:152, tackles:0,    worldcupGoals:0, worldcupApps:7,  worldcupAssists:0 },
  { name:"Rodri",                club:"Man City",          nation:"Spain",     british:false, era:"current", leagues:["epl"],           shirt:"#6CABDD",bg:"#c60b1e", goals:48,  assists:62,  caps:75,  trophies:12, ballondors:1, gamesPlayed:380, yellowCards:58, redCards:4,  cleanSheets:0,   tackles:980,  worldcupGoals:0, worldcupApps:10, worldcupAssists:2 },
  { name:"Bukayo Saka",          club:"Arsenal",           nation:"England",   british:true,  era:"current", leagues:["epl"],           shirt:"#EF0107",bg:"#063672", goals:97,  assists:113, caps:48,  trophies:3,  ballondors:0, gamesPlayed:282, yellowCards:24, redCards:1,  cleanSheets:0,   tackles:310,  worldcupGoals:3, worldcupApps:8,  worldcupAssists:2 },
  { name:"Phil Foden",           club:"Man City",          nation:"England",   british:true,  era:"current", leagues:["epl"],           shirt:"#6CABDD",bg:"#1C2C5B", goals:108, assists:87,  caps:42,  trophies:11, ballondors:0, gamesPlayed:356, yellowCards:28, redCards:0,  cleanSheets:0,   tackles:190,  worldcupGoals:1, worldcupApps:8,  worldcupAssists:1 },
  { name:"Marcus Rashford",      club:"Man Utd",           nation:"England",   british:true,  era:"current", leagues:["epl"],           shirt:"#DA291C",bg:"#DA291C", goals:138, assists:73,  caps:60,  trophies:5,  ballondors:0, gamesPlayed:380, yellowCards:32, redCards:1,  cleanSheets:0,   tackles:145,  worldcupGoals:2, worldcupApps:8,  worldcupAssists:1 },
  { name:"Declan Rice",          club:"Arsenal",           nation:"England",   british:true,  era:"current", leagues:["epl"],           shirt:"#EF0107",bg:"#063672", goals:28,  assists:44,  caps:55,  trophies:4,  ballondors:0, gamesPlayed:298, yellowCards:62, redCards:2,  cleanSheets:0,   tackles:890,  worldcupGoals:0, worldcupApps:8,  worldcupAssists:1 },
  { name:"Trent Alexander-Arnold",club:"Liverpool",        nation:"England",   british:true,  era:"current", leagues:["epl"],           shirt:"#C8102E",bg:"#00B2A9", goals:28,  assists:98,  caps:38,  trophies:9,  ballondors:0, gamesPlayed:310, yellowCards:32, redCards:0,  cleanSheets:95,  tackles:340,  worldcupGoals:0, worldcupApps:4,  worldcupAssists:1 },
  { name:"Andrew Robertson",     club:"Liverpool",         nation:"Scotland",  british:true,  era:"current", leagues:["epl"],           shirt:"#C8102E",bg:"#005EB8", goals:14,  assists:82,  caps:72,  trophies:9,  ballondors:0, gamesPlayed:326, yellowCards:44, redCards:2,  cleanSheets:90,  tackles:580,  worldcupGoals:0, worldcupApps:0,  worldcupAssists:0 },
  { name:"Robbie Savage",        club:"Blackburn",         nation:"Wales",     british:true,  era:"legend",  leagues:["epl","barclays"],shirt:"#009EE0",bg:"#00A2E0", goals:39,  assists:52,  caps:39,  trophies:1,  ballondors:0, gamesPlayed:622, yellowCards:92, redCards:5,  cleanSheets:0,   tackles:1140, worldcupGoals:0, worldcupApps:0,  worldcupAssists:0 },
  { name:"El Hadji Diouf",       club:"Bolton",            nation:"Senegal",   british:false, era:"legend",  leagues:["epl","barclays","streets"],shirt:"#1B458F",bg:"#E01020", goals:56,assists:44,caps:69,trophies:2,ballondors:0,gamesPlayed:503,yellowCards:102,redCards:7,cleanSheets:0,tackles:240,worldcupGoals:1,worldcupApps:8,worldcupAssists:1 },
  { name:"Shaun Wright-Phillips",club:"Man City",          nation:"England",   british:true,  era:"legend",  leagues:["epl","barclays"],shirt:"#6CABDD",bg:"#1C2C5B", goals:57,  assists:98,  caps:36,  trophies:5,  ballondors:0, gamesPlayed:454, yellowCards:38, redCards:1,  cleanSheets:0,   tackles:380,  worldcupGoals:0, worldcupApps:2,  worldcupAssists:0 },
  { name:"Nolberto Solano",      club:"Newcastle",         nation:"Peru",      british:false, era:"legend",  leagues:["epl","barclays"],shirt:"#000000",bg:"#41B6E6", goals:48,  assists:86,  caps:95,  trophies:2,  ballondors:0, gamesPlayed:432, yellowCards:44, redCards:2,  cleanSheets:0,   tackles:210,  worldcupGoals:0, worldcupApps:0,  worldcupAssists:0 },
  { name:"Jay-Jay Okocha",       club:"Bolton",            nation:"Nigeria",   british:false, era:"legend",  leagues:["epl","barclays"],shirt:"#1B458F",bg:"#008751", goals:50,  assists:78,  caps:73,  trophies:4,  ballondors:0, gamesPlayed:448, yellowCards:52, redCards:2,  cleanSheets:0,   tackles:285,  worldcupGoals:0, worldcupApps:10, worldcupAssists:2 },
  { name:"Nwankwo Kanu",         club:"Arsenal",           nation:"Nigeria",   british:false, era:"legend",  leagues:["epl","barclays"],shirt:"#EF0107",bg:"#008751", goals:85,  assists:68,  caps:86,  trophies:9,  ballondors:0, gamesPlayed:434, yellowCards:28, redCards:0,  cleanSheets:0,   tackles:110,  worldcupGoals:0, worldcupApps:6,  worldcupAssists:1 },
  { name:"Nicolas Anelka",       club:"Arsenal",           nation:"France",    british:false, era:"legend",  leagues:["epl","barclays"],shirt:"#EF0107",bg:"#003087", goals:224, assists:110, caps:69,  trophies:14, ballondors:0, gamesPlayed:756, yellowCards:98, redCards:4,  cleanSheets:0,   tackles:140,  worldcupGoals:0, worldcupApps:4,  worldcupAssists:0 },
  { name:"Emile Heskey",         club:"Liverpool",         nation:"England",   british:true,  era:"legend",  leagues:["epl","barclays"],shirt:"#C8102E",bg:"#00B2A9", goals:110, assists:148, caps:62,  trophies:8,  ballondors:0, gamesPlayed:516, yellowCards:68, redCards:2,  cleanSheets:0,   tackles:190,  worldcupGoals:1, worldcupApps:11, worldcupAssists:3 },
  { name:"Tugay Kerimoğlu",      club:"Blackburn",         nation:"Turkey",    british:false, era:"legend",  leagues:["epl","barclays"],shirt:"#009EE0",bg:"#E30A17", goals:25,  assists:52,  caps:94,  trophies:2,  ballondors:0, gamesPlayed:362, yellowCards:49, redCards:2,  cleanSheets:0,   tackles:640,  worldcupGoals:0, worldcupApps:7,  worldcupAssists:1 },
  { name:"Don Hutchison",        club:"West Ham",          nation:"Scotland",  british:true,  era:"legend",  leagues:["epl","barclays"],shirt:"#7A263A",bg:"#005EB8", goals:74,  assists:48,  caps:26,  trophies:2,  ballondors:0, gamesPlayed:402, yellowCards:72, redCards:4,  cleanSheets:0,   tackles:440,  worldcupGoals:0, worldcupApps:0,  worldcupAssists:0 },
  { name:"Youri Djorkaeff",      club:"Bolton",            nation:"France",    british:false, era:"legend",  leagues:["epl","barclays"],shirt:"#1B458F",bg:"#003087", goals:130, assists:98,  caps:82,  trophies:10, ballondors:0, gamesPlayed:452, yellowCards:42, redCards:2,  cleanSheets:0,   tackles:180,  worldcupGoals:3, worldcupApps:14, worldcupAssists:4 },
  { name:"Freddie Ljungberg",    club:"Arsenal",           nation:"Sweden",    british:false, era:"legend",  leagues:["epl","barclays"],shirt:"#EF0107",bg:"#006AA7", goals:72,  assists:78,  caps:75,  trophies:8,  ballondors:0, gamesPlayed:328, yellowCards:36, redCards:1,  cleanSheets:0,   tackles:285,  worldcupGoals:0, worldcupApps:7,  worldcupAssists:1 },
  { name:"Robbie Fowler",        club:"Liverpool",         nation:"England",   british:true,  era:"legend",  leagues:["epl","barclays"],shirt:"#C8102E",bg:"#00B2A9", goals:183, assists:62,  caps:26,  trophies:7,  ballondors:0, gamesPlayed:379, yellowCards:40, redCards:1,  cleanSheets:0,   tackles:65,   worldcupGoals:0, worldcupApps:0,  worldcupAssists:0 },
  { name:"Hatem Ben Arfa",       club:"Newcastle",         nation:"France",    british:false, era:"legend",  leagues:["streets","ligue1"],shirt:"#000000",bg:"#41B6E6",goals:80,assists:74,caps:13,trophies:4,ballondors:0,gamesPlayed:384,yellowCards:58,redCards:3,cleanSheets:0,tackles:145,worldcupGoals:0,worldcupApps:0,worldcupAssists:0 },
  { name:"Philippe Coutinho",    club:"Barcelona",         nation:"Brazil",    british:false, era:"legend",  leagues:["streets","epl","laliga"],shirt:"#004D98",bg:"#009C3B",goals:132,assists:138,caps:54,trophies:15,ballondors:0,gamesPlayed:528,yellowCards:52,redCards:1,cleanSheets:0,tackles:220,worldcupGoals:1,worldcupApps:8,worldcupAssists:2 },
  { name:"Gervinho",             club:"Arsenal",           nation:"Ivory Coast",british:false,era:"legend",  leagues:["streets","epl","seriea"],shirt:"#EF0107",bg:"#F77F00",goals:92,assists:58,caps:79,trophies:6,ballondors:0,gamesPlayed:398,yellowCards:62,redCards:4,cleanSheets:0,tackles:155,worldcupGoals:2,worldcupApps:9,worldcupAssists:2 },
  { name:"Riyad Mahrez",         club:"Man City",          nation:"Algeria",   british:false, era:"legend",  leagues:["streets","epl","saudi"],shirt:"#6CABDD",bg:"#006233",goals:163,assists:126,caps:86,trophies:9,ballondors:0,gamesPlayed:486,yellowCards:48,redCards:2,cleanSheets:0,tackles:185,worldcupGoals:1,worldcupApps:5,worldcupAssists:1 },
  { name:"Wilfried Zaha",        club:"Crystal Palace",    nation:"Ivory Coast",british:false,era:"legend",  leagues:["streets","epl"],  shirt:"#C4122E",bg:"#005DB8", goals:90,  assists:78,  caps:33,  trophies:2,  ballondors:0, gamesPlayed:468, yellowCards:82, redCards:5,  cleanSheets:0,   tackles:310,  worldcupGoals:0, worldcupApps:0,  worldcupAssists:0 },
  { name:"Ricardo Quaresma",     club:"Porto",             nation:"Portugal",  british:false, era:"legend",  leagues:["streets","laliga"],shirt:"#00427A",bg:"#006233", goals:138, assists:168, caps:80,  trophies:16, ballondors:0, gamesPlayed:624, yellowCards:104,redCards:7,  cleanSheets:0,   tackles:195,  worldcupGoals:1, worldcupApps:10, worldcupAssists:1 },
  { name:"Nicklas Bendtner",     club:"Arsenal",           nation:"Denmark",   british:false, era:"legend",  leagues:["streets","epl"],  shirt:"#EF0107",bg:"#C60C30", goals:128, assists:62,  caps:81,  trophies:4,  ballondors:0, gamesPlayed:462, yellowCards:78, redCards:4,  cleanSheets:0,   tackles:88,   worldcupGoals:0, worldcupApps:0,  worldcupAssists:0 },
  { name:"Mario Balotelli",      club:"Man City",          nation:"Italy",     british:false, era:"legend",  leagues:["streets","epl","seriea"],shirt:"#6CABDD",bg:"#003380",goals:145,assists:54,caps:36,trophies:8,ballondors:0,gamesPlayed:368,yellowCards:114,redCards:14,cleanSheets:0,tackles:75,worldcupGoals:2,worldcupApps:4,worldcupAssists:0 },
  { name:"Anderson",             club:"Man Utd",           nation:"Brazil",    british:false, era:"legend",  leagues:["streets","epl"],  shirt:"#DA291C",bg:"#009C3B", goals:16,  assists:38,  caps:8,   trophies:10, ballondors:0, gamesPlayed:302, yellowCards:68, redCards:5,  cleanSheets:0,   tackles:420,  worldcupGoals:0, worldcupApps:0,  worldcupAssists:0 },
  { name:"Robinho",              club:"Man City",          nation:"Brazil",    british:false, era:"legend",  leagues:["streets","epl","laliga"],shirt:"#6CABDD",bg:"#009C3B",goals:186,assists:132,caps:100,trophies:10,ballondors:0,gamesPlayed:440,yellowCards:44,redCards:1,cleanSheets:0,tackles:130,worldcupGoals:4,worldcupApps:12,worldcupAssists:3 },
  { name:"Adel Taarabt",         club:"QPR",               nation:"Morocco",   british:false, era:"legend",  leagues:["streets","epl"],  shirt:"#005CAB",bg:"#E03A3E", goals:42,  assists:55,  caps:44,  trophies:1,  ballondors:0, gamesPlayed:298, yellowCards:52, redCards:3,  cleanSheets:0,   tackles:155,  worldcupGoals:0, worldcupApps:0,  worldcupAssists:0 },
  { name:"Djibril Cissé",        club:"Liverpool",         nation:"France",    british:false, era:"legend",  leagues:["streets","epl"],  shirt:"#C8102E",bg:"#003087", goals:128, assists:52,  caps:41,  trophies:6,  ballondors:0, gamesPlayed:368, yellowCards:48, redCards:2,  cleanSheets:0,   tackles:95,   worldcupGoals:2, worldcupApps:10, worldcupAssists:1 },
  { name:"Yoann Gourcuff",       club:"Bordeaux",          nation:"France",    british:false, era:"legend",  leagues:["streets","ligue1"],shirt:"#003B7B",bg:"#003087", goals:58,  assists:74,  caps:31,  trophies:4,  ballondors:0, gamesPlayed:302, yellowCards:44, redCards:2,  cleanSheets:0,   tackles:180,  worldcupGoals:0, worldcupApps:1,  worldcupAssists:0 },
  { name:"Cristiano Ronaldo",    club:"Real Madrid",       nation:"Portugal",  british:false, era:"legend",  leagues:["laliga"],         shirt:"#FFFFFF",bg:"#003087", goals:900, assists:248, caps:217, trophies:34, ballondors:5, gamesPlayed:1122,yellowCards:123,redCards:11, cleanSheets:0,   tackles:340,  worldcupGoals:8, worldcupApps:22, worldcupAssists:3 },
  { name:"Lionel Messi",         club:"Barcelona",         nation:"Argentina", british:false, era:"legend",  leagues:["laliga"],         shirt:"#004D98",bg:"#74ACDF", goals:838, assists:382, caps:191, trophies:43, ballondors:8, gamesPlayed:1060,yellowCards:102,redCards:3,  cleanSheets:0,   tackles:280,  worldcupGoals:13,worldcupApps:26, worldcupAssists:8 },
  { name:"Andrés Iniesta",       club:"Barcelona",         nation:"Spain",     british:false, era:"legend",  leagues:["laliga"],         shirt:"#004D98",bg:"#C60B1E", goals:89,  assists:210, caps:131, trophies:32, ballondors:0, gamesPlayed:674, yellowCards:65, redCards:1,  cleanSheets:0,   tackles:780,  worldcupGoals:1, worldcupApps:14, worldcupAssists:5 },
  { name:"Xavi Hernández",       club:"Barcelona",         nation:"Spain",     british:false, era:"legend",  leagues:["laliga"],         shirt:"#004D98",bg:"#C60B1E", goals:85,  assists:186, caps:133, trophies:25, ballondors:0, gamesPlayed:767, yellowCards:99, redCards:1,  cleanSheets:0,   tackles:950,  worldcupGoals:0, worldcupApps:16, worldcupAssists:4 },
  { name:"Sergio Ramos",         club:"Real Madrid",       nation:"Spain",     british:false, era:"legend",  leagues:["laliga"],         shirt:"#FFFFFF",bg:"#be0000", goals:139, assists:42,  caps:180, trophies:22, ballondors:0, gamesPlayed:863, yellowCards:253,redCards:26, cleanSheets:0,   tackles:1680, worldcupGoals:0, worldcupApps:16, worldcupAssists:1 },
  { name:"Luka Modrić",          club:"Real Madrid",       nation:"Croatia",   british:false, era:"current", leagues:["laliga","worldcup"],shirt:"#FFFFFF",bg:"#FF0000",goals:122,assists:197,caps:180,trophies:22,ballondors:1,gamesPlayed:714,yellowCards:78,redCards:1,cleanSheets:0,tackles:860,worldcupGoals:3,worldcupApps:18,worldcupAssists:4 },
  { name:"Toni Kroos",           club:"Real Madrid",       nation:"Germany",   british:false, era:"legend",  leagues:["laliga"],         shirt:"#FFFFFF",bg:"#000000", goals:105, assists:254, caps:106, trophies:24, ballondors:0, gamesPlayed:724, yellowCards:44, redCards:0,  cleanSheets:0,   tackles:520,  worldcupGoals:1, worldcupApps:14, worldcupAssists:6 },
  { name:"Kylian Mbappé",        club:"Real Madrid",       nation:"France",    british:false, era:"current", leagues:["laliga","ligue1"],shirt:"#FFFFFF",bg:"#003087", goals:370, assists:159, caps:98,  trophies:17, ballondors:0, gamesPlayed:488, yellowCards:52, redCards:1,  cleanSheets:0,   tackles:210,  worldcupGoals:12,worldcupApps:14, worldcupAssists:4 },
  { name:"Vinicius Jr",          club:"Real Madrid",       nation:"Brazil",    british:false, era:"current", leagues:["laliga"],         shirt:"#FFFFFF",bg:"#009C3B", goals:185, assists:148, caps:38,  trophies:10, ballondors:0, gamesPlayed:340, yellowCards:58, redCards:4,  cleanSheets:0,   tackles:175,  worldcupGoals:1, worldcupApps:10, worldcupAssists:2 },
  { name:"Robert Lewandowski",   club:"Barcelona",         nation:"Poland",    british:false, era:"current", leagues:["laliga","bundesliga"],shirt:"#004D98",bg:"#DC143C",goals:628,assists:180,caps:151,trophies:23,ballondors:0,gamesPlayed:844,yellowCards:64,redCards:2,cleanSheets:0,tackles:98,worldcupGoals:2,worldcupApps:12,worldcupAssists:3 },
  { name:"Pedri",                club:"Barcelona",         nation:"Spain",     british:false, era:"current", leagues:["laliga"],         shirt:"#004D98",bg:"#A50044", goals:42,  assists:57,  caps:36,  trophies:8,  ballondors:0, gamesPlayed:198, yellowCards:31, redCards:0,  cleanSheets:0,   tackles:420,  worldcupGoals:0, worldcupApps:6,  worldcupAssists:1 },
  { name:"Raúl",                 club:"Real Madrid",       nation:"Spain",     british:false, era:"legend",  leagues:["laliga"],         shirt:"#FFFFFF",bg:"#003087", goals:323, assists:142, caps:102, trophies:16, ballondors:0, gamesPlayed:741, yellowCards:50, redCards:3,  cleanSheets:0,   tackles:210,  worldcupGoals:3, worldcupApps:9,  worldcupAssists:2 },
  { name:"Ronaldinho",           club:"Barcelona",         nation:"Brazil",    british:false, era:"legend",  leagues:["laliga"],         shirt:"#004D98",bg:"#8B1A1A", goals:280, assists:190, caps:97,  trophies:14, ballondors:1, gamesPlayed:594, yellowCards:69, redCards:2,  cleanSheets:0,   tackles:225,  worldcupGoals:4, worldcupApps:12, worldcupAssists:6 },
  { name:"Antoine Griezmann",    club:"Atletico Madrid",   nation:"France",    british:false, era:"current", leagues:["laliga","ligue1"],shirt:"#CB3524",bg:"#272E61", goals:352, assists:165, caps:137, trophies:12, ballondors:0, gamesPlayed:782, yellowCards:88, redCards:3,  cleanSheets:0,   tackles:340,  worldcupGoals:7, worldcupApps:14, worldcupAssists:5 },
  { name:"Thibaut Courtois",     club:"Real Madrid",       nation:"Belgium",   british:false, era:"current", leagues:["laliga"],         shirt:"#FFFFFF",bg:"#003087", goals:0,   assists:2,   caps:101, trophies:18, ballondors:0, gamesPlayed:562, yellowCards:18, redCards:2,  cleanSheets:224, tackles:0,    worldcupGoals:0, worldcupApps:12, worldcupAssists:0 },
  { name:"Roberto Carlos",       club:"Real Madrid",       nation:"Brazil",    british:false, era:"legend",  leagues:["laliga"],         shirt:"#FFFFFF",bg:"#003087", goals:113, assists:106, caps:125, trophies:17, ballondors:0, gamesPlayed:584, yellowCards:87, redCards:4,  cleanSheets:0,   tackles:620,  worldcupGoals:1, worldcupApps:12, worldcupAssists:2 },
  { name:"Jude Bellingham",      club:"Real Madrid",       nation:"England",   british:true,  era:"current", leagues:["laliga"],         shirt:"#FFFFFF",bg:"#DA291C", goals:82,  assists:60,  caps:47,  trophies:6,  ballondors:0, gamesPlayed:282, yellowCards:44, redCards:2,  cleanSheets:0,   tackles:380,  worldcupGoals:3, worldcupApps:8,  worldcupAssists:1 },
  { name:"Paolo Maldini",        club:"AC Milan",          nation:"Italy",     british:false, era:"legend",  leagues:["seriea"],         shirt:"#FB090B",bg:"#1a1a1a", goals:33,  assists:37,  caps:126, trophies:25, ballondors:0, gamesPlayed:902, yellowCards:41, redCards:4,  cleanSheets:310, tackles:1820, worldcupGoals:0, worldcupApps:17, worldcupAssists:1 },
  { name:"Gianluigi Buffon",     club:"Juventus",          nation:"Italy",     british:false, era:"legend",  leagues:["seriea"],         shirt:"#000000",bg:"#FFFFFF", goals:0,   assists:1,   caps:176, trophies:20, ballondors:0, gamesPlayed:1050,yellowCards:34, redCards:1,  cleanSheets:478, tackles:0,    worldcupGoals:0, worldcupApps:17, worldcupAssists:0 },
  { name:"Roberto Baggio",       club:"Juventus",          nation:"Italy",     british:false, era:"legend",  leagues:["seriea"],         shirt:"#000000",bg:"#FFD700", goals:318, assists:138, caps:56,  trophies:8,  ballondors:1, gamesPlayed:639, yellowCards:52, redCards:1,  cleanSheets:0,   tackles:140,  worldcupGoals:9, worldcupApps:16, worldcupAssists:4 },
  { name:"Alessandro Del Piero", club:"Juventus",          nation:"Italy",     british:false, era:"legend",  leagues:["seriea"],         shirt:"#000000",bg:"#FFD700", goals:290, assists:168, caps:91,  trophies:14, ballondors:0, gamesPlayed:789, yellowCards:66, redCards:2,  cleanSheets:0,   tackles:170,  worldcupGoals:3, worldcupApps:13, worldcupAssists:3 },
  { name:"Francesco Totti",      club:"Roma",              nation:"Italy",     british:false, era:"legend",  leagues:["seriea"],         shirt:"#CC0000",bg:"#FFD700", goals:307, assists:216, caps:58,  trophies:6,  ballondors:0, gamesPlayed:786, yellowCards:101,redCards:9,  cleanSheets:0,   tackles:320,  worldcupGoals:1, worldcupApps:7,  worldcupAssists:1 },
  { name:"Andrea Pirlo",         club:"Juventus",          nation:"Italy",     british:false, era:"legend",  leagues:["seriea"],         shirt:"#000000",bg:"#000000", goals:84,  assists:172, caps:116, trophies:21, ballondors:0, gamesPlayed:748, yellowCards:88, redCards:4,  cleanSheets:0,   tackles:640,  worldcupGoals:2, worldcupApps:16, worldcupAssists:6 },
  { name:"Ronaldo (R9)",         club:"Inter Milan",       nation:"Brazil",    british:false, era:"legend",  leagues:["seriea","worldcup"],shirt:"#003399",bg:"#009C3B",goals:247,assists:93,caps:98,trophies:19,ballondors:2,gamesPlayed:343,yellowCards:28,redCards:2,cleanSheets:0,tackles:180,worldcupGoals:15,worldcupApps:19,worldcupAssists:4 },
  { name:"Zlatan Ibrahimović",   club:"AC Milan",          nation:"Sweden",    british:false, era:"legend",  leagues:["seriea","ligue1"],shirt:"#FB090B",bg:"#006AA7", goals:569, assists:243, caps:120, trophies:32, ballondors:0, gamesPlayed:1094,yellowCards:117,redCards:7,  cleanSheets:0,   tackles:190,  worldcupGoals:0, worldcupApps:0,  worldcupAssists:0 },
  { name:"Cafu",                 club:"AC Milan",          nation:"Brazil",    british:false, era:"legend",  leagues:["seriea"],         shirt:"#FB090B",bg:"#009C3B", goals:22,  assists:63,  caps:142, trophies:21, ballondors:0, gamesPlayed:701, yellowCards:65, redCards:3,  cleanSheets:0,   tackles:740,  worldcupGoals:2, worldcupApps:20, worldcupAssists:4 },
  { name:"Romelu Lukaku",        club:"Inter Milan",       nation:"Belgium",   british:false, era:"current", leagues:["seriea","epl"],   shirt:"#003399",bg:"#000000", goals:382, assists:128, caps:110, trophies:8,  ballondors:0, gamesPlayed:620, yellowCards:58, redCards:4,  cleanSheets:0,   tackles:110,  worldcupGoals:0, worldcupApps:16, worldcupAssists:1 },
  { name:"Lautaro Martínez",     club:"Inter Milan",       nation:"Argentina", british:false, era:"current", leagues:["seriea"],         shirt:"#003399",bg:"#74ACDF", goals:220, assists:88,  caps:72,  trophies:9,  ballondors:0, gamesPlayed:428, yellowCards:48, redCards:3,  cleanSheets:0,   tackles:120,  worldcupGoals:4, worldcupApps:12, worldcupAssists:2 },
  { name:"Victor Osimhen",       club:"Napoli",            nation:"Nigeria",   british:false, era:"current", leagues:["seriea"],         shirt:"#00BFFF",bg:"#003380", goals:140, assists:44,  caps:38,  trophies:3,  ballondors:0, gamesPlayed:298, yellowCards:26, redCards:2,  cleanSheets:0,   tackles:78,   worldcupGoals:0, worldcupApps:4,  worldcupAssists:1 },
  { name:"Scott McTominay",      club:"Napoli",            nation:"Scotland",  british:true,  era:"current", leagues:["seriea"],         shirt:"#00BFFF",bg:"#003380", goals:42,  assists:28,  caps:52,  trophies:3,  ballondors:0, gamesPlayed:286, yellowCards:55, redCards:3,  cleanSheets:0,   tackles:680,  worldcupGoals:0, worldcupApps:0,  worldcupAssists:0 },
  { name:"Manuel Neuer",         club:"Bayern Munich",     nation:"Germany",   british:false, era:"current", leagues:["bundesliga"],     shirt:"#DC052D",bg:"#1C2C5B", goals:2,   assists:5,   caps:124, trophies:24, ballondors:0, gamesPlayed:718, yellowCards:22, redCards:1,  cleanSheets:298, tackles:0,    worldcupGoals:0, worldcupApps:14, worldcupAssists:0 },
  { name:"Oliver Kahn",          club:"Bayern Munich",     nation:"Germany",   british:false, era:"legend",  leagues:["bundesliga"],     shirt:"#DC052D",bg:"#1C2C5B", goals:1,   assists:0,   caps:86,  trophies:15, ballondors:0, gamesPlayed:632, yellowCards:42, redCards:4,  cleanSheets:275, tackles:0,    worldcupGoals:0, worldcupApps:8,  worldcupAssists:0 },
  { name:"Gerd Müller",          club:"Bayern Munich",     nation:"Germany",   british:false, era:"legend",  leagues:["bundesliga","worldcup"],shirt:"#DC052D",bg:"#1C2C5B",goals:735,assists:168,caps:62,trophies:14,ballondors:1,gamesPlayed:793,yellowCards:10,redCards:0,cleanSheets:0,tackles:55,worldcupGoals:14,worldcupApps:13,worldcupAssists:4 },
  { name:"Michael Ballack",      club:"Bayern Munich",     nation:"Germany",   british:false, era:"legend",  leagues:["bundesliga"],     shirt:"#DC052D",bg:"#000000", goals:156, assists:162, caps:98,  trophies:13, ballondors:0, gamesPlayed:731, yellowCards:112,redCards:5,  cleanSheets:0,   tackles:780,  worldcupGoals:5, worldcupApps:15, worldcupAssists:5 },
  { name:"Franck Ribéry",        club:"Bayern Munich",     nation:"France",    british:false, era:"legend",  leagues:["bundesliga"],     shirt:"#DC052D",bg:"#003087", goals:124, assists:218, caps:81,  trophies:24, ballondors:0, gamesPlayed:718, yellowCards:88, redCards:3,  cleanSheets:0,   tackles:420,  worldcupGoals:1, worldcupApps:11, worldcupAssists:2 },
  { name:"Arjen Robben",         club:"Bayern Munich",     nation:"Netherlands",british:false,era:"legend",  leagues:["bundesliga"],     shirt:"#DC052D",bg:"#FF6600", goals:210, assists:188, caps:96,  trophies:22, ballondors:0, gamesPlayed:654, yellowCards:92, redCards:3,  cleanSheets:0,   tackles:185,  worldcupGoals:6, worldcupApps:14, worldcupAssists:3 },
  { name:"Thomas Müller",        club:"Bayern Munich",     nation:"Germany",   british:false, era:"current", leagues:["bundesliga"],     shirt:"#DC052D",bg:"#1C2C5B", goals:248, assists:312, caps:131, trophies:26, ballondors:0, gamesPlayed:752, yellowCards:52, redCards:0,  cleanSheets:0,   tackles:340,  worldcupGoals:10,worldcupApps:20, worldcupAssists:6 },
  { name:"Jamal Musiala",        club:"Bayern Munich",     nation:"Germany",   british:false, era:"current", leagues:["bundesliga"],     shirt:"#DC052D",bg:"#1C2C5B", goals:78,  assists:68,  caps:34,  trophies:7,  ballondors:0, gamesPlayed:196, yellowCards:14, redCards:0,  cleanSheets:0,   tackles:220,  worldcupGoals:2, worldcupApps:8,  worldcupAssists:1 },
  { name:"Florian Wirtz",        club:"Bayer Leverkusen",  nation:"Germany",   british:false, era:"current", leagues:["bundesliga"],     shirt:"#E32221",bg:"#000000", goals:52,  assists:68,  caps:26,  trophies:3,  ballondors:0, gamesPlayed:172, yellowCards:12, redCards:0,  cleanSheets:0,   tackles:190,  worldcupGoals:2, worldcupApps:5,  worldcupAssists:2 },
  { name:"Harry Kane",           club:"Bayern Munich",     nation:"England",   british:true,  era:"current", leagues:["bundesliga"],     shirt:"#DC052D",bg:"#1C2C5B", goals:382, assists:163, caps:97,  trophies:3,  ballondors:0, gamesPlayed:648, yellowCards:52, redCards:1,  cleanSheets:0,   tackles:120,  worldcupGoals:8, worldcupApps:14, worldcupAssists:2 },
  { name:"Neymar Jr",            club:"PSG",               nation:"Brazil",    british:false, era:"legend",  leagues:["ligue1"],         shirt:"#004170",bg:"#009C3B", goals:443, assists:280, caps:128, trophies:28, ballondors:0, gamesPlayed:686, yellowCards:112,redCards:6,  cleanSheets:0,   tackles:190,  worldcupGoals:8, worldcupApps:17, worldcupAssists:7 },
  { name:"Zinedine Zidane",      club:"Marseille",         nation:"France",    british:false, era:"legend",  leagues:["ligue1"],         shirt:"#009AC7",bg:"#002266", goals:125, assists:92,  caps:108, trophies:15, ballondors:1, gamesPlayed:506, yellowCards:61, redCards:6,  cleanSheets:0,   tackles:210,  worldcupGoals:5, worldcupApps:12, worldcupAssists:4 },
  { name:"Karim Benzema",        club:"Al Ittihad",        nation:"France",    british:false, era:"current", leagues:["ligue1","saudi"], shirt:"#FFCB00",bg:"#006400", goals:378, assists:162, caps:97,  trophies:25, ballondors:1, gamesPlayed:722, yellowCards:72, redCards:3,  cleanSheets:0,   tackles:165,  worldcupGoals:4, worldcupApps:9,  worldcupAssists:2 },
  { name:"Ousmane Dembélé",      club:"PSG",               nation:"France",    british:false, era:"current", leagues:["ligue1"],         shirt:"#004170",bg:"#003087", goals:110, assists:148, caps:55,  trophies:10, ballondors:0, gamesPlayed:348, yellowCards:32, redCards:1,  cleanSheets:0,   tackles:185,  worldcupGoals:0, worldcupApps:7,  worldcupAssists:3 },
  { name:"Alexandre Lacazette",  club:"Lyon",              nation:"France",    british:false, era:"current", leagues:["ligue1"],         shirt:"#0033A0",bg:"#FF0000", goals:280, assists:124, caps:31,  trophies:6,  ballondors:0, gamesPlayed:598, yellowCards:52, redCards:2,  cleanSheets:0,   tackles:140,  worldcupGoals:0, worldcupApps:4,  worldcupAssists:1 },
  { name:"Cristiano Ronaldo",    club:"Al Nassr",          nation:"Portugal",  british:false, era:"current", leagues:["saudi"],          shirt:"#FFD700",bg:"#002D62", goals:900, assists:248, caps:217, trophies:34, ballondors:5, gamesPlayed:1122,yellowCards:123,redCards:11, cleanSheets:0,   tackles:340,  worldcupGoals:8, worldcupApps:22, worldcupAssists:3 },
  { name:"Neymar Jr",            club:"Al Hilal",          nation:"Brazil",    british:false, era:"current", leagues:["saudi"],          shirt:"#007BC5",bg:"#009C3B", goals:443, assists:280, caps:128, trophies:28, ballondors:0, gamesPlayed:686, yellowCards:112,redCards:6,  cleanSheets:0,   tackles:190,  worldcupGoals:8, worldcupApps:17, worldcupAssists:7 },
  { name:"Roberto Firmino",      club:"Al Ahli",           nation:"Brazil",    british:false, era:"current", leagues:["saudi"],          shirt:"#CC0000",bg:"#009C3B", goals:140, assists:116, caps:44,  trophies:10, ballondors:0, gamesPlayed:402, yellowCards:34, redCards:0,  cleanSheets:0,   tackles:175,  worldcupGoals:0, worldcupApps:3,  worldcupAssists:0 },
  { name:"N'Golo Kanté",         club:"Al Ittihad",        nation:"France",    british:false, era:"current", leagues:["saudi","epl"],    shirt:"#FFCB00",bg:"#003087", goals:28,  assists:42,  caps:53,  trophies:10, ballondors:0, gamesPlayed:418, yellowCards:52, redCards:2,  cleanSheets:0,   tackles:1480, worldcupGoals:0, worldcupApps:12, worldcupAssists:2 },
  { name:"Jordan Henderson",     club:"Al Ettifaq",        nation:"England",   british:true,  era:"current", leagues:["saudi","epl"],    shirt:"#E61E14",bg:"#001A44", goals:58,  assists:94,  caps:81,  trophies:10, ballondors:0, gamesPlayed:594, yellowCards:92, redCards:4,  cleanSheets:0,   tackles:720,  worldcupGoals:0, worldcupApps:8,  worldcupAssists:1 },
  { name:"Sadio Mané",           club:"Al Nassr",          nation:"Senegal",   british:false, era:"current", leagues:["saudi","epl"],    shirt:"#FFD700",bg:"#009A44", goals:268, assists:124, caps:102, trophies:12, ballondors:0, gamesPlayed:518, yellowCards:44, redCards:2,  cleanSheets:0,   tackles:310,  worldcupGoals:0, worldcupApps:4,  worldcupAssists:0 },
  { name:"Aleksandar Mitrović",  club:"Al Hilal",          nation:"Serbia",    british:false, era:"current", leagues:["saudi"],          shirt:"#007BC5",bg:"#CC0000", goals:248, assists:52,  caps:82,  trophies:4,  ballondors:0, gamesPlayed:432, yellowCards:88, redCards:5,  cleanSheets:0,   tackles:85,   worldcupGoals:0, worldcupApps:6,  worldcupAssists:1 },
  { name:"Lionel Messi",         club:"Inter Miami",       nation:"Argentina", british:false, era:"current", leagues:["mls"],            shirt:"#F7B5CD",bg:"#231F20", goals:838, assists:382, caps:191, trophies:43, ballondors:8, gamesPlayed:1060,yellowCards:102,redCards:3,  cleanSheets:0,   tackles:280,  worldcupGoals:13,worldcupApps:26, worldcupAssists:8 },
  { name:"Lorenzo Insigne",      club:"Toronto FC",        nation:"Italy",     british:false, era:"current", leagues:["mls"],            shirt:"#B81137",bg:"#003087", goals:162, assists:132, caps:56,  trophies:6,  ballondors:0, gamesPlayed:448, yellowCards:44, redCards:1,  cleanSheets:0,   tackles:145,  worldcupGoals:0, worldcupApps:5,  worldcupAssists:0 },
  { name:"Xherdan Shaqiri",      club:"Chicago Fire",      nation:"Switzerland",british:false,era:"current", leagues:["mls","epl"],      shirt:"#CC0000",bg:"#CC0000", goals:140, assists:98,  caps:112, trophies:8,  ballondors:0, gamesPlayed:488, yellowCards:72, redCards:2,  cleanSheets:0,   tackles:185,  worldcupGoals:6, worldcupApps:12, worldcupAssists:3 },
  { name:"Gareth Bale",          club:"LA FC",             nation:"Wales",     british:true,  era:"legend",  leagues:["mls"],            shirt:"#C39E6D",bg:"#00A2E0", goals:220, assists:105, caps:111, trophies:20, ballondors:0, gamesPlayed:534, yellowCards:58, redCards:2,  cleanSheets:0,   tackles:190,  worldcupGoals:0, worldcupApps:0,  worldcupAssists:0 },
  { name:"Wayne Rooney",         club:"DC United",         nation:"England",   british:true,  era:"legend",  leagues:["mls"],            shirt:"#003087",bg:"#DA291C", goals:253, assists:147, caps:120, trophies:16, ballondors:0, gamesPlayed:559, yellowCards:101,redCards:6,  cleanSheets:0,   tackles:310,  worldcupGoals:2, worldcupApps:16, worldcupAssists:1 },
  { name:"David Beckham",        club:"LA Galaxy",         nation:"England",   british:true,  era:"legend",  leagues:["mls"],            shirt:"#004C97",bg:"#FFD700", goals:127, assists:265, caps:115, trophies:19, ballondors:0, gamesPlayed:724, yellowCards:98, redCards:5,  cleanSheets:0,   tackles:310,  worldcupGoals:1, worldcupApps:12, worldcupAssists:4 },
  { name:"Pelé",                 club:"Santos",            nation:"Brazil",    british:false, era:"legend",  leagues:["worldcup"],       shirt:"#FFD700",bg:"#009C3B", goals:762, assists:348, caps:92,  trophies:8,  ballondors:0, gamesPlayed:812, yellowCards:4,  redCards:0,  cleanSheets:0,   tackles:95,   worldcupGoals:12,worldcupApps:14, worldcupAssists:5 },
  { name:"Diego Maradona",       club:"Napoli",            nation:"Argentina", british:false, era:"legend",  leagues:["worldcup"],       shirt:"#75AADB",bg:"#74ACDF", goals:312, assists:248, caps:91,  trophies:12, ballondors:0, gamesPlayed:491, yellowCards:28, redCards:2,  cleanSheets:0,   tackles:185,  worldcupGoals:8, worldcupApps:21, worldcupAssists:8 },
  { name:"Miroslav Klose",       club:"Bayern Munich",     nation:"Germany",   british:false, era:"legend",  leagues:["worldcup","bundesliga"],shirt:"#DC052D",bg:"#000000",goals:276,assists:68,caps:137,trophies:8,ballondors:0,gamesPlayed:612,yellowCards:28,redCards:1,cleanSheets:0,tackles:80,worldcupGoals:16,worldcupApps:24,worldcupAssists:4 },
  { name:"Just Fontaine",        club:"Reims",             nation:"France",    british:false, era:"legend",  leagues:["worldcup"],       shirt:"#003087",bg:"#003087", goals:165, assists:48,  caps:21,  trophies:3,  ballondors:0, gamesPlayed:200, yellowCards:2,  redCards:0,  cleanSheets:0,   tackles:40,   worldcupGoals:13,worldcupApps:6,  worldcupAssists:3 },
  { name:"Eusébio",              club:"Benfica",           nation:"Portugal",  british:false, era:"legend",  leagues:["worldcup"],       shirt:"#CC0000",bg:"#CC0000", goals:474, assists:180, caps:64,  trophies:12, ballondors:1, gamesPlayed:614, yellowCards:8,  redCards:0,  cleanSheets:0,   tackles:95,   worldcupGoals:9, worldcupApps:7,  worldcupAssists:2 },
  { name:"Didier Drogba",        club:"Chelsea",           nation:"Ivory Coast",british:false,era:"legend",  leagues:["row","epl"],      shirt:"#034694",bg:"#F77F00", goals:286, assists:117, caps:105, trophies:15, ballondors:0, gamesPlayed:616, yellowCards:78, redCards:6,  cleanSheets:0,   tackles:155,  worldcupGoals:1, worldcupApps:8,  worldcupAssists:2 },
  { name:"Samuel Eto'o",         club:"Barcelona",         nation:"Cameroon",  british:false, era:"legend",  leagues:["row","laliga","seriea"],shirt:"#004D98",bg:"#007A5E",goals:390,assists:180,caps:118,trophies:22,ballondors:0,gamesPlayed:800,yellowCards:72,redCards:5,cleanSheets:0,tackles:140,worldcupGoals:4,worldcupApps:12,worldcupAssists:2 },
  { name:"Yaya Touré",           club:"Man City",          nation:"Ivory Coast",british:false,era:"legend",  leagues:["row","epl","laliga"],shirt:"#6CABDD",bg:"#F77F00",goals:156,assists:124,caps:101,trophies:12,ballondors:0,gamesPlayed:616,yellowCards:86,redCards:4,cleanSheets:0,tackles:820,worldcupGoals:1,worldcupApps:8,worldcupAssists:1 },
  { name:"Park Ji-sung",         club:"Man Utd",           nation:"South Korea",british:false,era:"legend",  leagues:["row","epl"],      shirt:"#DA291C",bg:"#C60C30", goals:55,  assists:68,  caps:100, trophies:15, ballondors:0, gamesPlayed:420, yellowCards:48, redCards:2,  cleanSheets:0,   tackles:680,  worldcupGoals:2, worldcupApps:11, worldcupAssists:2 },
  { name:"Hidetoshi Nakata",     club:"Roma",              nation:"Japan",     british:false, era:"legend",  leagues:["row","seriea"],   shirt:"#CC0000",bg:"#BC002D", goals:68,  assists:74,  caps:77,  trophies:8,  ballondors:0, gamesPlayed:380, yellowCards:62, redCards:2,  cleanSheets:0,   tackles:320,  worldcupGoals:0, worldcupApps:9,  worldcupAssists:2 },
  { name:"Tim Cahill",           club:"Everton",           nation:"Australia", british:false, era:"legend",  leagues:["row","epl"],      shirt:"#274488",bg:"#002F65", goals:108, assists:44,  caps:108, trophies:4,  ballondors:0, gamesPlayed:430, yellowCards:62, redCards:3,  cleanSheets:0,   tackles:380,  worldcupGoals:5, worldcupApps:12, worldcupAssists:1 },
];

// ─── MODES ────────────────────────────────────────────────────────────────────
const MODES = [
  { key:"worldcup",   label:"World Cup 2026",      icon:"🏆", color:"#FFD700", colorAlt:"#00843D", desc:"FIFA WC USA·MEX·CAN — who's the all-time GOAT?", filter:p=>p.worldcupApps>0, wcMode:true, featured:true },
  { key:"all",        label:"The Full Squad",      icon:"🌍", color:"#00ff88", colorAlt:"#00cc66", desc:"Every player. No limits.",              filter:()=>true },
  { key:"legends",    label:"Legends",             icon:"👑", color:"#f5a623", colorAlt:"#c87d0a", desc:"Retired icons & all-time greats",        filter:p=>p.era==="legend" },
  { key:"current",    label:"Current Stars",       icon:"⚡", color:"#4fc3f7", colorAlt:"#0288d1", desc:"Active players only",                    filter:p=>p.era==="current" },
  { key:"barclays",   label:"Barclaysmen",         icon:"🦁", color:"#e90052", colorAlt:"#3d195b", desc:"Premier League — the golden era",        filter:p=>p.leagues.some(l=>["epl","barclays"].includes(l)) },
  { key:"brexit",     label:"Brexit Ballers",      icon:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", color:"#CF111A", colorAlt:"#012169", desc:"British & Irish players only",           filter:p=>p.british },
  { key:"laliga",     label:"La Liga",             icon:"🇪🇸", color:"#c60b1e", colorAlt:"#f1bf00", desc:"Spanish top flight",                      filter:p=>p.leagues.includes("laliga") },
  { key:"seriea",     label:"Serie A",             icon:"🇮🇹", color:"#003087", colorAlt:"#009246", desc:"Italian top flight",                      filter:p=>p.leagues.includes("seriea") },
  { key:"bundesliga", label:"Bundesliga",          icon:"🇩🇪", color:"#D3010C", colorAlt:"#FFCC00", desc:"German top flight",                       filter:p=>p.leagues.includes("bundesliga") },
  { key:"ligue1",     label:"Ligue 1",             icon:"🇫🇷", color:"#002654", colorAlt:"#ED2939", desc:"French top flight",                       filter:p=>p.leagues.includes("ligue1") },
  { key:"saudi",      label:"Saudi League",        icon:"🇸🇦", color:"#006C35", colorAlt:"#c8a951", desc:"The petrodollar playground",              filter:p=>p.leagues.includes("saudi") },
  { key:"mls",        label:"MLS",                 icon:"🌎", color:"#002F65", colorAlt:"#C5141C", desc:"Major League Soccer",                     filter:p=>p.leagues.includes("mls") },
  { key:"streets",    label:"Streets Won't Forget",icon:"🌶️", color:"#ff4500", colorAlt:"#FFD700", desc:"Cult heroes, what-ifs & madmen",          filter:p=>p.leagues.includes("streets") },
  { key:"row",        label:"Rest of World",       icon:"🌐", color:"#8A2BE2", colorAlt:"#00CED1", desc:"Global legends beyond Europe",             filter:p=>p.leagues.includes("row") },
];

// ─── STATS ────────────────────────────────────────────────────────────────────
const ALL_STATS = {
  goals:           {label:"Career Goals",        icon:"⚽", format:v=>v.toLocaleString(), cat:"attacking"  },
  assists:         {label:"Career Assists",       icon:"🎯", format:v=>v.toLocaleString(), cat:"attacking"  },
  gamesPlayed:     {label:"Games Played",         icon:"🏟️", format:v=>v.toLocaleString(), cat:"attacking"  },
  trophies:        {label:"Career Trophies",      icon:"🏆", format:v=>v.toLocaleString(), cat:"honours"    },
  ballondors:      {label:"Ballon d'Or Awards",   icon:"🥇", format:v=>v.toLocaleString(), cat:"honours"    },
  caps:            {label:"International Caps",   icon:"🌍", format:v=>v.toLocaleString(), cat:"honours"    },
  yellowCards:     {label:"Yellow Cards",         icon:"🟨", format:v=>v.toLocaleString(), cat:"discipline" },
  redCards:        {label:"Red Cards",            icon:"🟥", format:v=>v.toLocaleString(), cat:"discipline" },
  cleanSheets:     {label:"Clean Sheets",         icon:"🧤", format:v=>v.toLocaleString(), cat:"defensive"  },
  tackles:         {label:"Tackles Won",          icon:"🛡️", format:v=>v.toLocaleString(), cat:"defensive"  },
  worldcupGoals:   {label:"World Cup Goals",      icon:"⚽", format:v=>v.toLocaleString(), cat:"worldcup"   },
  worldcupApps:    {label:"World Cup Appearances",icon:"🏆", format:v=>v.toLocaleString(), cat:"worldcup"   },
  worldcupAssists: {label:"World Cup Assists",    icon:"🎯", format:v=>v.toLocaleString(), cat:"worldcup"   },
};
const CATS = {
  all:        {label:"All Stats",   icon:"🎮", color:null,      keys:Object.keys(ALL_STATS).filter(k=>!k.startsWith("worldcup"))},
  attacking:  {label:"Attacking",   icon:"⚽", color:"#00ff88", keys:["goals","assists","gamesPlayed"]},
  honours:    {label:"Honours",     icon:"🏆", color:"#f5a623", keys:["trophies","ballondors","caps"]},
  discipline: {label:"Discipline",  icon:"🟨", color:"#FFD700", keys:["yellowCards","redCards"]},
  defensive:  {label:"Defensive",   icon:"🛡️", color:"#4fc3f7", keys:["cleanSheets","tackles"]},
  worldcup:   {label:"World Cup",   icon:"🌍", color:"#C9A84C", keys:["worldcupGoals","worldcupApps","worldcupAssists"]},
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const shuffle=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;};
const dedupe=a=>{const s=new Set();return a.filter(p=>{const k=p.name+p.club;if(s.has(k))return false;s.add(k);return true;});};
function pickKey(catKey,modeKey){
  let keys=[...(CATS[catKey]?.keys||CATS.all.keys)];
  if(modeKey==="worldcup") keys=CATS.worldcup.keys;
  // Remove ballondors from modes where it'd always be 0 (too boring)
  const bdModes=["all","legends","current","laliga","seriea","bundesliga","ligue1","barclays"];
  if(!bdModes.includes(modeKey)) keys=keys.filter(k=>k!=="ballondors");
  // Remove cleanSheets/tackles for attackers-only modes
  const attackModes=["streets"];
  if(attackModes.includes(modeKey)) keys=keys.filter(k=>!["cleanSheets","tackles"].includes(k));
  if(keys.length===0) keys=["goals"];
  return keys[Math.floor(Math.random()*keys.length)];
}

// ─── STORAGE: see src/supabase.js ───────────────────────────────────────────

// ─── AVATAR ──────────────────────────────────────────────────────────────────
function Avatar({p,size=72}){
  const i=p.name.replace(/[()]/g,"").split(" ").filter(Boolean).map(w=>w[0]).slice(0,2).join("");
  return <div style={{width:size,height:size,borderRadius:"50%",flexShrink:0,background:`linear-gradient(135deg,${p.bg}dd,${p.shirt}55)`,border:`2px solid ${p.shirt}66`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.3,fontWeight:900,color:"#fff",textShadow:"0 2px 8px rgba(0,0,0,0.9)",fontFamily:"'Bebas Neue',Impact,sans-serif",letterSpacing:"1px",boxShadow:`0 0 18px ${p.shirt}44,inset 0 1px 0 rgba(255,255,255,0.1)`}}>{i}</div>;
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen,   setScreen]   = useState("menu");
  const [mode,     setMode]     = useState(null);
  const [cat,      setCat]      = useState("all");
  const [deck,     setDeck]     = useState([]);
  const [ki,       setKi]       = useState(0);
  const [mi,       setMi]       = useState(1);
  const [statKey,  setStatKey]  = useState("goals");
  const [score,    setScore]    = useState(0);
  const [best,     setBest]     = useState({});
  const [streak,   setStreak]   = useState(0);
  const [result,   setResult]   = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [animating,setAnimating]= useState(false);
  const [gameOver, setGameOver] = useState(false);
  // leaderboard
  const [lb,       setLb]       = useState({});
  const [lbMode,   setLbMode]   = useState(null);
  const [submitting,setSubmitting]=useState(false);
  const [submitted, setSubmitted]=useState(false);
  const [playerName,setPlayerName]=useState("");
  const [lbLoading, setLbLoading]=useState(false);
  const timeout = useRef(null);

  useEffect(()=>{ loadLeaderboard().then(setLb); },[]);

  function startGame(m,c=cat){
    const pool=dedupe(shuffle(P.filter(m.filter)));
    if(pool.length<4)return;
    setDeck(pool);setKi(0);setMi(1);
    setStatKey(pickKey(c,m.key));
    setScore(0);setStreak(0);
    setResult(null);setRevealed(false);
    setAnimating(false);setGameOver(false);
    setSubmitted(false);setPlayerName("");
    setMode(m);setCat(c);setScreen("game");
  }

  function guess(dir){
    if(animating||result)return;
    const kv=deck[ki][statKey],mv=deck[mi][statKey];
    let ok=dir==="higher"?mv>=kv:mv<=kv;
    if(mv===kv)ok=true;
    setRevealed(true);setResult(ok?"correct":"wrong");setAnimating(true);
    if(ok){
      const ns=score+1;
      setScore(ns);setStreak(s=>s+1);
      setBest(b=>({...b,[mode.key]:Math.max(b[mode.key]||0,ns)}));
    }
    timeout.current=setTimeout(()=>{
      if(!ok){setGameOver(true);setAnimating(false);return;}
      let nki=mi,nmi=mi+1;
      if(nmi>=deck.length){const nd=dedupe(shuffle(P.filter(mode.filter)));setDeck(nd);nki=0;nmi=1;}
      setKi(nki);setMi(nmi);
      setStatKey(pickKey(cat,mode.key));
      setResult(null);setRevealed(false);setAnimating(false);
    },1900);
  }

  async function submitScore(){
    if(!playerName.trim()||score===0)return;
    setSubmitting(true);
    const updated=await saveScore(mode.key,playerName,score);
    if(updated)setLb(updated);
    setSubmitted(true);setSubmitting(false);
  }

  async function openLeaderboard(m){
    setLbMode(m);setLbLoading(true);setScreen("leaderboard");
    const fresh=await loadLeaderboard();
    setLb(fresh);setLbLoading(false);
  }

  const ac=mode?.wcMode?"#FFD700":(cat!=="all"&&CATS[cat]?.color?CATS[cat].color:(mode?.colorAlt||mode?.color||"#00ff88"));
  const sm=ALL_STATS[statKey];
  const known=deck[ki],mystery=deck[mi];

  // ── LEADERBOARD SCREEN ──
  if(screen==="leaderboard"){
    const entries=lbMode?(lb[lbMode.key]||[]):[];
    const mColor=lbMode?.color||"#00ff88";
    return(
      <div style={{minHeight:"100vh",background:"#06090f",fontFamily:"'Bebas Neue',Impact,sans-serif",display:"flex",flexDirection:"column",alignItems:"center",padding:"22px 14px 48px",position:"relative",overflow:"hidden"}}>
        <Pitch/>
        <div style={{position:"fixed",inset:0,pointerEvents:"none",background:lbMode?.wcMode?"radial-gradient(ellipse 80% 40% at 50% 0%, rgba(0,132,61,0.1) 0%, rgba(255,215,0,0.07) 50%, transparent 70%)": `radial-gradient(ellipse 80% 40% at 50% 0%,${mColor}0a 0%,transparent 60%)`}}/>
        <div style={{width:"100%",maxWidth:"540px",zIndex:1}}>
          <button onClick={()=>setScreen("menu")} style={{background:"transparent",border:"1px solid #1a2535",color:"#556",padding:"5px 12px",fontSize:"10px",letterSpacing:"2px",cursor:"pointer",borderRadius:"6px",fontFamily:"'Bebas Neue',Impact,sans-serif",marginBottom:"18px"}}>← BACK</button>
          <div style={{textAlign:"center",marginBottom:"22px"}}>
            <div style={{fontSize:"32px",marginBottom:"4px"}}>{lbMode?.icon}</div>
            <div style={{fontSize:"9px",letterSpacing:"6px",color:mColor,marginBottom:"2px"}}>GLOBAL LEADERBOARD</div>
            <div style={{fontSize:"clamp(20px,5vw,32px)",color:"#fff",letterSpacing:"3px",lineHeight:1}}>{lbMode?.label?.toUpperCase()}</div>
          </div>
          {lbLoading?(
            <div style={{textAlign:"center",color:"#334",fontFamily:"sans-serif",fontSize:"13px",padding:"40px"}}>Loading scores...</div>
          ):entries.length===0?(
            <div style={{textAlign:"center",padding:"40px 20px",background:"#0c1220",borderRadius:"14px",border:"1px solid #1a2535"}}>
              <div style={{fontSize:"32px",marginBottom:"8px"}}>🏁</div>
              <div style={{fontSize:"14px",color:"#556",letterSpacing:"2px"}}>NO SCORES YET</div>
              <div style={{fontSize:"10px",color:"#334",fontFamily:"sans-serif",marginTop:"6px"}}>Be the first to set a record!</div>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
              {entries.map((e,i)=>{
                const medals=["🥇","🥈","🥉"];
                const isTop=i<3;
                return(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:"12px",background:isTop?`${mColor}10`:"#0c1220",border:`1px solid ${isTop?mColor+"44":"#1a2535"}`,borderRadius:"10px",padding:"10px 14px",transition:"all 0.2s"}}>
                    <div style={{fontSize:isTop?"22px":"14px",width:"28px",textAlign:"center",color:isTop?mColor:"#334",fontFamily:isTop?"inherit":"sans-serif"}}>{isTop?medals[i]:`${i+1}`}</div>
                    <div style={{flex:1,fontSize:"clamp(13px,3vw,17px)",color:isTop?"#fff":"#aaa",letterSpacing:"1px"}}>{e.name}</div>
                    <div style={{fontSize:"clamp(18px,4vw,24px)",color:isTop?mColor:"#556",letterSpacing:"1px"}}>{e.score}</div>
                  </div>
                );
              })}
            </div>
          )}
          <button onClick={()=>startGame(lbMode)} style={{display:"block",width:"100%",marginTop:"20px",background:mColor,color:"#000",border:"none",padding:"13px",fontSize:"17px",letterSpacing:"3px",cursor:"pointer",borderRadius:"10px",fontFamily:"'Bebas Neue',Impact,sans-serif",boxShadow:`0 4px 20px ${mColor}44`}}>PLAY {lbMode?.label?.toUpperCase()}</button>
        </div>
        <style>{CSS}</style>
      </div>
    );
  }

  // ── MENU ──
  if(screen==="menu") return(
    <div style={{minHeight:"100vh",background:"#06090f",fontFamily:"'Bebas Neue',Impact,sans-serif",display:"flex",flexDirection:"column",alignItems:"center",padding:"22px 14px 48px",position:"relative",overflow:"hidden"}}>
      <Pitch/>
      <div style={{textAlign:"center",marginBottom:"22px",zIndex:1}}>
        <div style={{fontSize:"9px",letterSpacing:"8px",color:"#00ff88",marginBottom:"4px"}}>THE BEAUTIFUL GAME</div>
        <div style={{fontSize:"clamp(28px,7vw,50px)",color:"#fff",letterSpacing:"4px",lineHeight:1}}>HIGHER <span style={{color:"#00ff88"}}>OR</span> LOWER</div>
        <div style={{fontSize:"10px",letterSpacing:"4px",color:"#334",marginTop:"6px",fontFamily:"sans-serif"}}>SELECT YOUR MODE</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))",gap:"8px",width:"100%",maxWidth:"900px",zIndex:1}}>
        {MODES.map(m=><ModeCard key={m.key} m={m} onPlay={()=>startGame(m)} onLB={()=>openLeaderboard(m)} best={best[m.key]||0} lbTop={(lb[m.key]||[])[0]}/>)}
      </div>
      <style>{CSS}</style>
    </div>
  );

  // ── GAME ──
  return(
    <div style={{minHeight:"100vh",background:mode?.wcMode?"linear-gradient(180deg,#05110a 0%,#06090f 40%)":"#06090f",fontFamily:"'Bebas Neue',Impact,sans-serif",display:"flex",flexDirection:"column",alignItems:"center",padding:"10px 10px 28px",position:"relative",overflow:"hidden"}}>
      <Pitch/>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",
        background:mode?.wcMode
          ?"radial-gradient(ellipse 100% 50% at 50% 0%, rgba(0,132,61,0.12) 0%, rgba(255,215,0,0.06) 40%, transparent 70%)"
          :`radial-gradient(ellipse 90% 40% at 50% 0%,${ac}08 0%,transparent 60%)`,
        transition:"background 0.8s"}}/>
      {mode?.wcMode&&<div style={{position:"fixed",top:0,left:0,right:0,height:"2px",background:"linear-gradient(90deg,#009C3B,#FFDF00,#CC0001,#002868,#BF0A30)",opacity:0.7,zIndex:10}}/>}
      <div style={{width:"100%",maxWidth:"860px",zIndex:1,marginBottom:"8px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"8px"}}>
          <button onClick={()=>setScreen("menu")} style={{background:"transparent",border:"1px solid #1a2535",color:"#556",padding:"5px 10px",fontSize:"10px",letterSpacing:"2px",cursor:"pointer",borderRadius:"6px",fontFamily:"'Bebas Neue',Impact,sans-serif",whiteSpace:"nowrap"}}>← MODES</button>
          <div style={{textAlign:"center",flex:1}}>
            <div style={{fontSize:"8px",letterSpacing:"5px",color:ac,transition:"color 0.5s",lineHeight:1}}>{mode?.icon} {mode?.label?.toUpperCase()}</div>
            <div style={{fontSize:"clamp(16px,4vw,28px)",color:"#fff",letterSpacing:"3px",lineHeight:1}}>HIGHER <span style={{color:ac,transition:"color 0.5s"}}>OR</span> LOWER</div>
          </div>
          <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
            {[["SCR",score,ac],["TOP",best[mode?.key]||0,"#555"],["🔥",streak,streak>=5?"#f5a623":"#333"]].map(([l,v,c])=>(
              <div key={l} style={{textAlign:"center"}}>
                <div style={{fontSize:"6px",letterSpacing:"2px",color:"#333"}}>{l}</div>
                <div style={{fontSize:"18px",color:c,lineHeight:1,transition:"color 0.3s"}}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"flex",gap:"4px",justifyContent:"center",marginTop:"8px",flexWrap:"wrap"}}>
          {Object.entries(CATS).map(([k,c])=>{
            const active=cat===k;const col=c.color||ac;
            return <button key={k} onClick={()=>setCat(k)} style={{background:active?col:"transparent",color:active?"#000":"#445",border:`1px solid ${active?col:"#1a2535"}`,padding:"2px 8px",fontSize:"8px",letterSpacing:"2px",cursor:"pointer",borderRadius:"20px",fontFamily:"'Bebas Neue',Impact,sans-serif",transition:"all 0.2s"}}>{c.icon} {c.label.toUpperCase()}</button>;
          })}
        </div>
      </div>

      {gameOver?(
        <GameOverScreen
          mystery={mystery} known={known} sm={sm} statKey={statKey}
          score={score} best={best[mode?.key]||0} ac={ac}
          playerName={playerName} setPlayerName={setPlayerName}
          submitting={submitting} submitted={submitted}
          onSubmit={submitScore}
          onRestart={()=>startGame(mode,cat)}
          onMenu={()=>setScreen("menu")}
          onLeaderboard={()=>openLeaderboard(mode)}
          lbEntries={lb[mode?.key]||[]}
          modeLabel={mode?.label}
        />
      ):known&&mystery&&(
        <div style={{zIndex:1,width:"100%",maxWidth:"860px"}}>
          <div style={{textAlign:"center",marginBottom:"7px"}}>
            <span style={{display:"inline-block",background:mode?.wcMode?"rgba(255,215,0,0.1)":`${ac}12`,border:`1px solid ${mode?.wcMode?"rgba(255,215,0,0.5)":ac+"40"}`,color:mode?.wcMode?"#FFD700":ac,padding:"2px 12px",borderRadius:"20px",fontSize:"9px",letterSpacing:"3px",transition:"all 0.4s",textShadow:mode?.wcMode?"0 0 12px rgba(255,215,0,0.4)":"none"}}>{sm.icon} {sm.label.toUpperCase()}{mode?.wcMode&&" 🌍"}</span>
          </div>
          <div style={{textAlign:"center",marginBottom:"9px",fontFamily:"sans-serif",fontSize:"clamp(10px,2.2vw,13px)",color:"#556",lineHeight:1.6}}>
            <b style={{color:"#ccc"}}>{known.name}</b> has <span style={{color:ac,fontFamily:"'Bebas Neue',Impact,sans-serif",fontSize:"clamp(13px,3vw,18px)",letterSpacing:"1px"}}>{sm.format(known[statKey])}</span> {sm.label.toLowerCase()}.<br/>
            Does <b style={{color:"#ccc"}}>{mystery.name}</b> have <span style={{color:ac}}>more</span> or <span style={{color:"#ff3a1f"}}>fewer</span>?
          </div>
          <div style={{display:"flex",gap:"7px",alignItems:"stretch"}}>
            <Card p={known}   sk={statKey} sm={sm} revealed={true}     isKnown={true}  result={null}   ac={ac} wcMode={mode?.wcMode}/>
            <VS ac={ac}/>
            <Card p={mystery} sk={statKey} sm={sm} revealed={revealed} isKnown={false} result={result} ac={ac} wcMode={mode?.wcMode}/>
          </div>
          {!result&&(
            <div style={{display:"flex",gap:"9px",marginTop:"12px",justifyContent:"center"}}>
              <Btn onClick={()=>guess("higher")} accent={ac}       dark  label="↑ HIGHER"/>
              <Btn onClick={()=>guess("lower")}  accent="#ff3a1f"  dark={false} label="↓ LOWER"/>
            </div>
          )}
          {result&&(
            <div style={{textAlign:"center",marginTop:"12px",fontSize:"clamp(17px,4.5vw,26px)",letterSpacing:"5px",color:result==="correct"?ac:"#ff3a1f",animation:"popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)"}}>
              {result==="correct"?(streak>0&&score%5===0&&score>0?`🔥 ${score} STREAK!`:"✓ CORRECT!"):"✗ WRONG!"}
            </div>
          )}
        </div>
      )}
      <style>{CSS}</style>
    </div>
  );
}

// ─── SUBCOMPONENTS ───────────────────────────────────────────────────────────
function Pitch(){return <div style={{position:"fixed",inset:0,pointerEvents:"none",opacity:0.018,backgroundImage:`repeating-linear-gradient(0deg,transparent,transparent 59px,#fff 59px,#fff 60px),repeating-linear-gradient(90deg,transparent,transparent 59px,#fff 59px,#fff 60px)`}}/>;}

function ModeCard({m,onPlay,onLB,best,lbTop}){
  const [hov,setHov]=useState(false);
  if(m.featured){
    return(
      <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
        style={{gridColumn:"1/-1",background:hov?"linear-gradient(135deg,#1a1200,#001a0d,#001428)":"linear-gradient(135deg,#110d00,#00120a,#000d1e)",
          border:`2px solid ${hov?"#FFD700":"#8a6a00"}`,borderRadius:"16px",padding:"20px 22px 16px",
          transition:"all 0.25s",transform:hov?"translateY(-2px)":"none",
          boxShadow:hov?"0 12px 40px rgba(255,215,0,0.18), 0 0 0 1px rgba(0,132,61,0.3)":"0 4px 20px rgba(0,0,0,0.4)",
          position:"relative",overflow:"hidden",cursor:"pointer"}}>
        {/* sunburst bg */}
        <div style={{position:"absolute",inset:0,opacity:0.04,
          backgroundImage:"repeating-conic-gradient(#FFD700 0deg 10deg,transparent 10deg 20deg)",
          backgroundSize:"200px 200px",backgroundPosition:"center"}}/>
        {/* top stripe: Brazil green → USA red → white */}
        <div style={{position:"absolute",top:0,left:0,right:0,height:"3px",
          background:"linear-gradient(90deg,#009C3B 0%,#FFDF00 30%,#CC0001 60%,#002868 80%,#BF0A30 100%)"}}/>
        <div style={{display:"flex",alignItems:"flex-start",gap:"16px",position:"relative",zIndex:1}}>
          <div style={{fontSize:"40px",lineHeight:1,filter:"drop-shadow(0 0 12px rgba(255,215,0,0.5))"}}>🏆</div>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"2px",flexWrap:"wrap"}}>
              <div style={{fontSize:"clamp(16px,3.5vw,22px)",color:"#FFD700",letterSpacing:"3px",lineHeight:1,textShadow:"0 0 20px rgba(255,215,0,0.4)"}}>{m.label.toUpperCase()}</div>
              <div style={{fontSize:"8px",background:"linear-gradient(90deg,#CC0001,#002868)",color:"#fff",padding:"2px 7px",borderRadius:"3px",letterSpacing:"2px",fontFamily:"sans-serif",whiteSpace:"nowrap"}}>⚡ COMING JUNE 2026</div>
            </div>
            <div style={{display:"flex",gap:"6px",alignItems:"center",marginBottom:"6px",flexWrap:"wrap"}}>
              <span style={{fontSize:"10px",color:"#00843D",letterSpacing:"1px",fontFamily:"sans-serif"}}>🇺🇸 USA</span>
              <span style={{color:"#333",fontSize:"10px"}}>·</span>
              <span style={{fontSize:"10px",color:"#006847",letterSpacing:"1px",fontFamily:"sans-serif"}}>🇲🇽 MEX</span>
              <span style={{color:"#333",fontSize:"10px"}}>·</span>
              <span style={{fontSize:"10px",color:"#FF0000",letterSpacing:"1px",fontFamily:"sans-serif"}}>🇨🇦 CAN</span>
              <span style={{color:"#333",fontSize:"10px"}}>·</span>
              <span style={{fontSize:"9px",color:"#665500",letterSpacing:"1px",fontFamily:"sans-serif"}}>WORLD CUP STATS ONLY</span>
            </div>
            <div style={{fontSize:"10px",color:"#443300",letterSpacing:"1px",fontFamily:"sans-serif",marginBottom:"10px"}}>{m.desc}</div>
            <div style={{display:"flex",gap:"5px",flexWrap:"wrap",alignItems:"center"}}>
              {lbTop&&<div style={{fontSize:"8px",color:"#f5a623",letterSpacing:"1px",fontFamily:"sans-serif",marginRight:"8px"}}>🥇 {lbTop.name} — {lbTop.score}</div>}
              {best>0&&<div style={{fontSize:"8px",color:"#FFD700",letterSpacing:"1px",fontFamily:"sans-serif",marginRight:"8px"}}>YOUR BEST: {best}</div>}
              <button onClick={onPlay} style={{background:hov?"#FFD700":"transparent",color:hov?"#000":"#FFD700",border:"2px solid #FFD700",padding:"6px 20px",fontSize:"12px",letterSpacing:"3px",cursor:"pointer",borderRadius:"7px",fontFamily:"'Bebas Neue',Impact,sans-serif",transition:"all 0.15s",boxShadow:hov?"0 4px 18px rgba(255,215,0,0.4)":"none"}}>PLAY NOW</button>
              <button onClick={e=>{e.stopPropagation();onLB();}} style={{background:"transparent",color:"#445",border:"1px solid #1a2535",padding:"6px 12px",fontSize:"10px",letterSpacing:"1px",cursor:"pointer",borderRadius:"7px",fontFamily:"'Bebas Neue',Impact,sans-serif"}}>🏆 LB</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return(
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{background:hov?`${m.color}1a`:"#0c1220",border:`1px solid ${hov?m.color:"#1a2535"}`,borderRadius:"13px",padding:"14px 13px 12px",transition:"all 0.2s",transform:hov?"translateY(-3px)":"none",boxShadow:hov?`0 8px 26px ${m.color}28`:"none",display:"flex",flexDirection:"column",gap:"2px"}}>
      <div style={{fontSize:"22px",marginBottom:"3px"}}>{m.icon}</div>
      <div style={{fontSize:"14px",color:hov?m.color:"#ccc",letterSpacing:"2px",lineHeight:1,transition:"color 0.2s"}}>{m.label.toUpperCase()}</div>
      <div style={{fontSize:"8px",color:"#334",letterSpacing:"1px",fontFamily:"sans-serif",lineHeight:1.4,marginBottom:"6px"}}>{m.desc}</div>
      {lbTop&&<div style={{fontSize:"8px",color:"#f5a623",letterSpacing:"1px",fontFamily:"sans-serif"}}>🥇 {lbTop.name} — {lbTop.score}</div>}
      {best>0&&<div style={{fontSize:"8px",color:m.color,letterSpacing:"1px",fontFamily:"sans-serif"}}>YOUR BEST: {best}</div>}
      <div style={{display:"flex",gap:"5px",marginTop:"8px"}}>
        <button onClick={onPlay} style={{flex:2,background:hov?m.color:"transparent",color:hov?"#000":m.color,border:`1px solid ${m.color}`,padding:"5px 0",fontSize:"10px",letterSpacing:"2px",cursor:"pointer",borderRadius:"6px",fontFamily:"'Bebas Neue',Impact,sans-serif",transition:"all 0.15s"}}>PLAY</button>
        <button onClick={e=>{e.stopPropagation();onLB();}} style={{flex:1,background:"transparent",color:"#445",border:"1px solid #1a2535",padding:"5px 0",fontSize:"9px",letterSpacing:"1px",cursor:"pointer",borderRadius:"6px",fontFamily:"'Bebas Neue',Impact,sans-serif",transition:"all 0.15s"}}>🏆 LB</button>
      </div>
    </div>
  );
}

function Card({p,sk,sm,revealed,isKnown,result,ac,wcMode}){
  const bc=!isKnown&&result?(result==="correct"?ac:"#ff3a1f"):isKnown?`${ac}30`:"#0e1520";
  return(
    <div style={{flex:1,background:wcMode?"linear-gradient(160deg,#0e1208,#070d05)":"linear-gradient(160deg,#0c1422,#080d16)",border:`1px solid ${bc}`,borderRadius:"15px",padding:"15px 11px 13px",display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",gap:"5px",transition:"border-color 0.4s,box-shadow 0.4s",boxShadow:result&&!isKnown?`0 0 30px ${result==="correct"?ac+"22":"rgba(255,58,31,0.1)"}`:"none",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:"3px",background:`linear-gradient(90deg,transparent,${p.shirt}88,transparent)`}}/>
      <div style={{position:"absolute",top:"8px",right:"8px",fontSize:"6px",letterSpacing:"1.5px",fontFamily:"sans-serif",color:p.era==="current"?"#00ff88":"#f5a623",background:p.era==="current"?"rgba(0,255,136,0.08)":"rgba(245,166,35,0.08)",padding:"2px 4px",borderRadius:"3px"}}>{p.era==="current"?"ACTIVE":"LEGEND"}</div>
      <Avatar p={p} size={64}/>
      <div style={{fontSize:"clamp(11px,2.4vw,17px)",color:"#eee",letterSpacing:"0.5px",lineHeight:1.1,marginTop:"2px"}}>{p.name}</div>
      <div style={{fontSize:"8px",color:"#2a3a4a",letterSpacing:"1px",fontFamily:"sans-serif"}}>{p.club} · {p.nation}</div>
      <div style={{marginTop:"8px",padding:"8px 13px",background:"#04070d",borderRadius:"9px",border:`1px solid ${isKnown?`${ac}20`:revealed?(result==="correct"?`${ac}30`:"#2a1010"):"#0e1520"}`,minWidth:"80px",transition:"border-color 0.4s"}}>
        {revealed
          ?<div style={{fontSize:"clamp(17px,4vw,27px)",letterSpacing:"1px",color:isKnown?ac:(result==="correct"?ac:"#ff3a1f"),animation:!isKnown?"revealNum 0.4s ease":"none"}}>{sm.format(p[sk])}</div>
          :<div style={{fontSize:"19px",color:"#1a2535",letterSpacing:"7px",fontFamily:"monospace",animation:"shimmer 2s infinite"}}>???</div>}
      </div>
    </div>
  );
}

function VS({ac}){return <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minWidth:"32px",gap:"4px"}}><div style={{width:"1px",flex:1,background:"linear-gradient(to bottom,transparent,#1a2535,transparent)"}}/><div style={{width:"26px",height:"26px",borderRadius:"50%",border:`1px solid ${ac}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"8px",color:"#2a3a4a",fontFamily:"sans-serif",fontWeight:"bold"}}>VS</div><div style={{width:"1px",flex:1,background:"linear-gradient(to bottom,transparent,#1a2535,transparent)"}}/></div>;}

function Btn({onClick,accent,dark,label}){
  const [h,setH]=useState(false);
  return <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{flex:1,maxWidth:"190px",background:h?accent:"transparent",color:h?(dark?"#000":"#fff"):accent,border:`2px solid ${accent}`,padding:"10px 12px",fontSize:"18px",letterSpacing:"3px",cursor:"pointer",borderRadius:"10px",fontFamily:"'Bebas Neue',Impact,sans-serif",transition:"all 0.15s",boxShadow:h?`0 4px 18px ${accent}55`:"none",transform:h?"translateY(-2px)":"none"}}>{label}</button>;
}

function GameOverScreen({mystery,known,sm,statKey,score,best,ac,playerName,setPlayerName,submitting,submitted,onSubmit,onRestart,onMenu,onLeaderboard,lbEntries,modeLabel}){
  const isNewBest=score>0&&score>=best;
  const rank=score>0?lbEntries.findIndex(e=>score>=e.score):-1;
  const wouldChart=rank===-1?lbEntries.length<10:true;

  return(
    <div style={{background:"linear-gradient(160deg,#0c1422,#080d16)",border:"1px solid #1a2535",borderRadius:"18px",padding:"22px 18px",textAlign:"center",maxWidth:"400px",width:"100%",zIndex:1}}>
      <div style={{fontSize:"32px",marginBottom:"4px"}}>❌</div>
      <div style={{fontSize:"28px",color:"#ff3a1f",letterSpacing:"3px",marginBottom:"10px"}}>GAME OVER</div>
      {mystery&&<div style={{display:"flex",justifyContent:"center",marginBottom:"8px"}}><Avatar p={mystery} size={44}/></div>}
      <div style={{background:"#04070d",borderRadius:"9px",padding:"10px",marginBottom:"12px",fontFamily:"sans-serif",fontSize:"11px",color:"#667",lineHeight:1.8}}>
        <div><span style={{color:"#bbb"}}>{mystery?.name}</span> had <span style={{color:"#ff3a1f",fontWeight:"bold",fontSize:"14px"}}>{sm?.format(mystery?.[statKey])}</span> {sm?.label?.toLowerCase()}</div>
        <div style={{color:"#2a3a4a",fontSize:"9px",marginTop:"1px"}}>{known?.name} had {sm?.format(known?.[statKey])}</div>
      </div>
      <div style={{fontSize:"7px",letterSpacing:"4px",color:"#333",marginBottom:"1px"}}>FINAL SCORE</div>
      <div style={{fontSize:"56px",color:ac,lineHeight:1,marginBottom:"3px"}}>{score}</div>
      {isNewBest&&<div style={{fontSize:"9px",color:"#f5a623",letterSpacing:"3px",marginBottom:"8px"}}>🏆 NEW PERSONAL BEST!</div>}
      {!isNewBest&&<div style={{fontSize:"9px",color:"#333",letterSpacing:"2px",marginBottom:"8px",fontFamily:"sans-serif"}}>{score===0?"First guess wrong!":` Best: ${best}`}</div>}

      {/* Leaderboard submission */}
      {score>0&&!submitted&&wouldChart&&(
        <div style={{background:"#080d14",borderRadius:"10px",padding:"12px",marginBottom:"12px",border:`1px solid ${ac}22`}}>
          <div style={{fontSize:"9px",letterSpacing:"3px",color:ac,marginBottom:"8px"}}>
            {rank===0?"🥇 YOU'D BE #1!":rank<3?`🏅 TOP ${rank+1} SCORE!`:"📋 SUBMIT TO LEADERBOARD"}
          </div>
          <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
            <input
              value={playerName}
              onChange={e=>setPlayerName(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&onSubmit()}
              placeholder="YOUR NAME"
              maxLength={16}
              style={{flex:1,background:"#06090f",border:`1px solid ${ac}44`,color:"#fff",padding:"7px 10px",fontSize:"12px",letterSpacing:"2px",borderRadius:"6px",fontFamily:"'Bebas Neue',Impact,sans-serif",outline:"none"}}
            />
            <button onClick={onSubmit} disabled={submitting||!playerName.trim()} style={{background:playerName.trim()?ac:"#1a2535",color:playerName.trim()?"#000":"#334",border:"none",padding:"7px 12px",fontSize:"11px",letterSpacing:"1px",cursor:playerName.trim()?"pointer":"default",borderRadius:"6px",fontFamily:"'Bebas Neue',Impact,sans-serif",transition:"all 0.15s",whiteSpace:"nowrap"}}>
              {submitting?"...":"SUBMIT"}
            </button>
          </div>
        </div>
      )}
      {submitted&&(
        <div style={{background:"#080d14",borderRadius:"10px",padding:"10px",marginBottom:"12px",border:`1px solid ${ac}44`,fontSize:"10px",color:ac,letterSpacing:"2px"}}>
          ✓ SCORE SAVED! CHECK THE LEADERBOARD
        </div>
      )}

      <div style={{display:"flex",gap:"6px",flexWrap:"wrap",justifyContent:"center"}}>
        <button onClick={onRestart} style={{flex:"1 1 auto",minWidth:"100px",background:ac,color:"#000",border:"none",padding:"9px 16px",fontSize:"14px",letterSpacing:"3px",cursor:"pointer",borderRadius:"8px",fontFamily:"'Bebas Neue',Impact,sans-serif",boxShadow:`0 4px 16px ${ac}44`}}>PLAY AGAIN</button>
        <button onClick={onLeaderboard} style={{flex:"1 1 auto",minWidth:"80px",background:"transparent",color:ac,border:`1px solid ${ac}`,padding:"9px 12px",fontSize:"13px",letterSpacing:"2px",cursor:"pointer",borderRadius:"8px",fontFamily:"'Bebas Neue',Impact,sans-serif"}}>🏆 LB</button>
        <button onClick={onMenu} style={{flex:"1 1 auto",minWidth:"80px",background:"transparent",color:"#445",border:"1px solid #1a2535",padding:"9px 12px",fontSize:"13px",letterSpacing:"2px",cursor:"pointer",borderRadius:"8px",fontFamily:"'Bebas Neue',Impact,sans-serif"}}>MODES</button>
      </div>
    </div>
  );
}

const CSS=`
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
  @keyframes popIn    {from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}
  @keyframes revealNum{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  @keyframes shimmer  {0%{opacity:0.4}50%{opacity:0.9}100%{opacity:0.4}}
  @keyframes wcPulse  {0%{opacity:0.5;transform:scale(1)}50%{opacity:1;transform:scale(1.02)}100%{opacity:0.5;transform:scale(1)}}
  @keyframes flagSlide{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
  *{box-sizing:border-box;margin:0;padding:0}
  input::placeholder{color:#334}
`;
