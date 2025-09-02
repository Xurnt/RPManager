export enum Pages {
	Home,
	Class,
	Character,
	World,
}

export interface DataPages {
	page: Pages;
	dataId?: number;
}
