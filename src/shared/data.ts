import { MasterData, PlantTypeMapping, PowerplantType } from "./types";

export const masterData: MasterData = {
    "CSR1WIND001": {
		"Klarname": "Wind001",
		"Anschlussnetzbetreiber": "Netzbetreiber Mitte",
		"AnschlussnetzbetreiberMPID": 100,
		"SRID": "CSR1WIND001",
		"Energietraeger": "B19",
		"Regelzone": "10YDE-ENBW-----N",
		"EnthalteneTR": "D1000000011",
		"MasterNrTR": "SEE925854856361",
		"KlarnameTR": "WEA1",
		"TRID": "D1000000011",
		"Nettonennleistung": "3450 kW",
		"GeokoordinatenTRs": "BreiteNord=41,335162 LaengeOst=9,753427",
		"Latitude": 41.335162,
		"Longitude": 9.753427
    },
    "CSR1WIND002": {
		"Klarname": "Wind002",
		"Anschlussnetzbetreiber": "Netzbetreiber Mitte",
		"AnschlussnetzbetreiberMPID": 100,
		"SRID": "CSR1WIND002",
		"Energietraeger": "B19",
		"Regelzone": "10YDE-ENBW-----N",
		"EnthalteneTR": "D1000000012",
		"MasterNrTR": "SEE931136456792",
		"KlarnameTR": "WEA1",
		"TRID": "D1000000012",
		"Nettonennleistung": "3300 kW",
		"GeokoordinatenTRs": "BreiteNord=49,602228 LaengeOst=9,61516",
		"Latitude": 49.602228,
		"Longitude": 9.61516
    },
    "CSRSONN003": {
		"Klarname": "Sun003",
		"Anschlussnetzbetreiber": "Netzbetreiber Mitte",
		"AnschlussnetzbetreiberMPID": 100,
		"SRID": "CSRSONN003",
		"Energietraeger": "B16",
		"Regelzone": "10YDE-ENBW-----N",
		"EnthalteneTR": "D1000000013",
		"MasterNrTR": "SEE996791774087",
		"KlarnameTR": "PV-Anlage1",
		"TRID": "D1000000013",
		"Nettonennleistung": "345,87 kW",
		"GeokoordinatenTRs": "BreiteNord=48,894 LaengeOst=9,015",
		"Latitude": 48.894,
		"Longitude": 9.015
    },
    "CSR1SONN004": {
		"Klarname": "Sun004",
		"Anschlussnetzbetreiber": "Netzbetreiber Mitte",
		"AnschlussnetzbetreiberMPID": 100,
		"SRID": "CSR1SONN004",
		"Energietraeger": "B16",
		"Regelzone": "10YDE-ENBW-----N",
		"EnthalteneTR": "D1000000014",
		"MasterNrTR": "SEE949073650708",
		"KlarnameTR": "PV-Anlage2",
		"TRID": "D1000000014",
		"Nettonennleistung": "207,5 kW",
		"GeokoordinatenTRs": "BreiteNord=49,698201 LaengeOst=9,787749",
		"Latitude": 49.698201,
		"Longitude": 9.787749
    },
    "CSR1BIO005": {
		"Klarname": "Bio005",
		"Anschlussnetzbetreiber": "Netzbetreiber Mitte",
		"AnschlussnetzbetreiberMPID": 100,
		"SRID": "CSR1BIO005",
		"Energietraeger": "B01",
		"Regelzone": "10YDE-ENBW-----N",
		"EnthalteneTR": "D1000000015",
		"MasterNrTR": "SEE955345050961",
		"KlarnameTR": "BHKW1",
		"TRID": "D1000000015",
		"Nettonennleistung": "305 kW",
		"GeokoordinatenTRs": "BreiteNord=48,195 LaengeOst=10,055",
		"Latitude": 48.195,
		"Longitude": 10.055
    },
    "CSR1BIO006": {
		"Klarname": "Bio006",
		"Anschlussnetzbetreiber": "Netzbetreiber Mitte",
		"AnschlussnetzbetreiberMPID": 100,
		"SRID": "CSR1BIO006",
		"Energietraeger": "B01",
		"Regelzone": "10YDE-ENBW-----N",
		"EnthalteneTR": "D1000000016",
		"MasterNrTR": "SEE991569113532",
		"KlarnameTR": "BHKW2",
		"TRID": "D1000000016",
		"Nettonennleistung": "500 kW",
		"GeokoordinatenTRs": "BreiteNord=48,017241LaengeOst=8,602017",
		"Latitude": 48.017241,
		"Longitude": 8.602017
    }
}

export const plantTypeMapping: PlantTypeMapping = {
	"B01": PowerplantType.BIOGAS,
	"B16": PowerplantType.SOLAR,
	"B19": PowerplantType.WIND
}
  