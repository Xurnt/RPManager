"use client"

import { Card, CardContent, CardTitle } from "./ui/card"

export default function Intro() {

	return (
		<Card className="px-4">
			<CardTitle className="text-xl bold text-center">Introduction</CardTitle>
			<CardContent>
				<p className="pb-4 text-justify">
					Cette histoire se déroule dans le monde de Fellam. Un monde fantastique empreint de magie et de mystères. Dans ce monde, chaque être vivant possède une énergie spirituelle que l'on appelle magie, et tous peuvent apprendre à l'utiliser à leur guise.
				</p>
				<p className="pb-4 text-justify">
					Il y a quelques années, le terrible mage noir Zelox tenta de prendre le contrôle du royaume de Syphania. Il était proche de son but, son armée atteignant même les remparts de la capitale du royaume, Carastelle. Cependant, une troupe de trois valeureux guerriers réussirent à faire une percée dans ses troupes et à l'éliminer. Ces 3 nobles âmes, qui sont désormais reconnues comme les héros du royaume, sont Pat le Taciturne, Margaret l'Invisible, et Theoryn le Brave.
				</p>
				<p className="pb-4 text-justify">
					Récemment, le roi de Syphania, Sergeï Dragoliub le IIIème, reçu une étrange lettre. Elle l'avertissait d'un grand danger menaçant le royaume, et lui demandait une assistance immédiate sous la forme d'un groupe d'aventurier compétents. Cette lettre était signée par Theoryn le Brave, et imprégnée de son essence magique bien distincte. Aucune explication supplémentaire n'était présente.  Le roi fut perplexe face à cette requête: Theoryn avait depuis longtemps abandonné les activités d'aventurier. En effet, il s'était retiré dans le petit village de Bois-Menu, un village paisible dans un forêt en lisière du royaume. De quel danger pouvait-il s'agir?
				</p>
				<p className="pb-4 text-justify">
					Faisant confiance en Theoryn, le roi assembla une troupe d'aventuriers venus de tout horizons. Ceux-ci se rendirent sans plus attendre à Bois-Menu, traversant le pays en plein hiver. Ils passèrent une première nuit à l'auberge locale avant de commencer toute activité d'enquête. Votre histoire commence au petit matin, alors que vous vous réveillez paisiblement dans vos chambres. 
				</p>
			</CardContent>
		</Card>
	);
}