export enum RollStatName {
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
	pgName: RollStatName;
}

export const stats: Stat[] = [
	{
		name: "Vitalité",
		pgName: RollStatName.CURRENT_VITALITY,
	},
	{
		name: "Mana",
		pgName: RollStatName.CURRENT_MANA,
	},
	{
		name: "Force",
		pgName: RollStatName.STRENGTH,
	},
	{
		name: "Dextérité",
		pgName: RollStatName.DEXTERITY,
	},
	{
		name: "Sang-froid",
		pgName: RollStatName.COURAGE,
	},
	{
		name: "Charisme",
		pgName: RollStatName.CHARISMA,
	},
	{
		name: "Perception",
		pgName: RollStatName.PERCEPTION,
	},
	{
		name: "Discrétion",
		pgName: RollStatName.DISCRETION,
	},
	{
		name: "Savoir",
		pgName: RollStatName.KNOWLEDGE,
	},
];

export enum DiceState {
	TO_ROLL,
	ROLLING,
	ROLLED,
}
