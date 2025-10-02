export enum StatName {
	CURRENT_VITALITY = "currentVitality",
	CURRENT_MANA = "currentMana",
	STRENGTH = "strength",
	DEXTERITY = "dexterity",
	COURAGE = "courage",
	CHARISMA = "charisma",
	PERCEPTION = "perception",
	DISCRETION = "discretion",
	KNOWLEDGE = "knowledge",
}

export enum RollType {
	Stat,
	Magic,
	Standard,
}

export enum BonusMalusOperation {
	BONUS = "+",
	MALUS = "-",
}

export interface BonusMalus {
	operation: BonusMalusOperation;
	value: number;
	id: number;
}

interface Stat {
	name: string;
	pgName: StatName;
}

export const stats: Stat[] = [
	{
		name: "Vitalité",
		pgName: StatName.CURRENT_VITALITY,
	},
	{
		name: "Mana",
		pgName: StatName.CURRENT_MANA,
	},
	{
		name: "Force",
		pgName: StatName.STRENGTH,
	},
	{
		name: "Dextérité",
		pgName: StatName.DEXTERITY,
	},
	{
		name: "Sang-froid",
		pgName: StatName.COURAGE,
	},
	{
		name: "Charisme",
		pgName: StatName.CHARISMA,
	},
	{
		name: "Perception",
		pgName: StatName.PERCEPTION,
	},
	{
		name: "Discrétion",
		pgName: StatName.DISCRETION,
	},
	{
		name: "Savoir",
		pgName: StatName.KNOWLEDGE,
	},
];
