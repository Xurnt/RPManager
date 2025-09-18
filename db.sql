--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.1

-- Started on 2025-09-18 08:41:46

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 16529)
-- Name: Character; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Character" (
    id integer NOT NULL,
    name text NOT NULL,
    title text NOT NULL,
    age integer NOT NULL,
    "mainClassId" integer NOT NULL,
    "secondClassId" integer,
    vitality integer,
    mana integer,
    strength integer,
    dexterity integer,
    courage integer,
    charisma integer,
    perception integer,
    discretion integer,
    knowledge integer,
    destiny integer,
    "publicStory" text,
    "privateStory" text,
    motivations text,
    fears text,
    "like" text,
    dislike text,
    "talentName" text,
    "weaknessName" text,
    inventory text,
    "talentDescription" text,
    "weaknessDescription" text
);


ALTER TABLE public."Character" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16546)
-- Name: Class; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Class" (
    id integer NOT NULL,
    name text NOT NULL,
    "classCategoryId" integer NOT NULL,
    description text NOT NULL
);


ALTER TABLE public."Class" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16553)
-- Name: ClassCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ClassCategory" (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL
);


ALTER TABLE public."ClassCategory" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16580)
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    name text NOT NULL,
    password text NOT NULL,
    "roleId" integer NOT NULL,
    "characterId" integer
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16587)
-- Name: UserRole; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserRole" (
    id integer NOT NULL,
    role text NOT NULL
);


ALTER TABLE public."UserRole" OWNER TO postgres;

--
-- TOC entry 4819 (class 0 OID 16529)
-- Dependencies: 217
-- Data for Name: Character; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Character" VALUES (1, 'Bernhalt', 'Recrue prometteuse', 23, 2, NULL, 70, 40, 80, 60, 60, 50, 50, 20, 20, 0, 'La prestigieuse garde de Syphania entretiens depuis des années une certaine vision de ce pays: l''ordre, la discipline et le courage en sont les maitres mots. Pour autant, celle ci est généralement appréciée par le peuple. Après tout, bon nombre de légendes ont fait office dans cette organisation. Theoryn lui même fut autrefois une simple recrue avant de devenir le pourfendeur de Zelox que l''on connait aujourd''hui.
	
Les plus méprisants diraient que les temps de paix ont rouillé cette unité d''élite, les rendant moins efficaces qu''à l''époque de la guerre. Et d''une certaine manière, c''était vrai. Pour autant, sous-estimer la garde serait une grave erreurs, et de nombreux malfrats l''ont appris à leurs dépends
	
Parmi ces honorables soldats, un nom revenait régulièrement: Bernhalt Strangard. Un jeune homme à fort caractère prêt à tout pour faire régner la justice, quitte à désobéir à ses supérieurs. Malgré tout, il fallait avouer que ses méthodes étaient efficaces. Le chef de la garde se plaignait souvent de lui auprès du roi. Une recrue désobéissante était inutile à ses yeux, aussi compétente qu''elle soit. Intrigué, le roi Dragoliub décida de recruter Bernhalt dans l''équipe de recherche. Sa fougue serait peut-être plus utile dans un cadre moins strict, et ses capacités n''étaient plus à démontrer.', 'Il y a quelques années, un groupe de bandits sévissait dans l''ombre en Carastelle. On nommait cette organisation "Vedaz". C''est malfrats étaient soit disant impliqués dans des affaires de trafics d''êtres humains et d''esclavage, et les rumeurs allaient jusqu''à parler d''associations avec le mage noir Zelox. Cependant, aucuns éléments concrets n''a été révélé aux yeux du public pour confirmer ces propos.

La mère de Bernhalt faisait parti des victimes de cette organisation. A l''époque de son abduction, le jeune enfant avait seulement 4 ans, aussi il gardait peu de souvenirs de celle-ci. Les années qui suivirent furent dures pour Bernhalt, qui dû jongler entre peur, désespoir et rage. Il gardait cependant espoir de revoir sa mère un jour, espoirs non partagés par son père, un homme bien plus pragmatique.
	
Ces maigres espoirs furent anéanti lors de son dixième anniversaire. Des membres de la garde de Syphania vinrent les informer de la découverte du corps de sa mère. Celui-ci était méconnaissable. Nul ne savait quelles horribles traitement elle avait subit, mais une chose était sûre: elle avait terriblement souffert. Bernhalt ne fut pas autorisé à voir le corps, à la fois pour permettre aux érudits de trouver des informations sur sa dépouille et pour préserver le jeune adolescent de cette vision macabre.  Bernhalt supplia la garde de l''engager: il était prêt à tout pour venger sa mère et anéantir cette organisation. Malheureusement pour lui, Bernhalt était bien trop jeune, aussi les gardes furent contraint de refuser.
	
Cela ne le stoppa pas, bien au contraire: Bernhalt passa les années suivantes à s''entrainer sans relâche, usant de la biomancie d''évolution pour améliorer ses capacités physiques. Il souhaitait être prêt pour le jour de sa vengeance. Ce jour n''arriverait malheureusement jamais: Vedaz fut démantelé avant même qu''il n''aie pu rejoindre la garde. Frustré d''avoir été impuissant dans tout cette affaire, Bernhalt décida quand même de rejoindre ces défenseurs du peuple à son vingtième anniversaire. Il n''avait rien pu faire pour sa mère, mais il pouvait au moins s''assurer que l''histoire ne se répète pas. Il trouva en cette résolution un moyen d''honorer sa défunte mère', 'Faire régner la justice', 'Être trop faible pour avoir un impact', 'L''adrénaline, les "Marchandes de plaisir"', 'La paperasse, les réunions et débats', 'Héroïsme', 'Bravoure orgueilleuse', 'Epée d''agent', 'En début de journée, il lance un dé 90. Il obtient un bonus de +20 sur la stat suivante pendant 24h:
	- 1 - 10: Vitalité
	- 11- 20: Mana
	- 21 - 30: Force
	- 31 - 40: Dextérité
	- 41 - 50: Sang-froid
	- 51 - 60: Charisme
	- 61 - 70: Perception
	- 71 - 80: Discrétion
	- 81 - 90: Savoir', 'Bravoure orgueilleuse: Bernhalt ne supporte pas les injonctions qu''il considère comme étant couardes. S''il aperçoit des êtres identifiés comme étant assurément des ennemis, il court instinctivement se battre. S''il essaie de se restreindre et de ne pas aller se battre, il perd l''ensemble de ses points de destin et subit un malus de -20 sur tous ses jets pendant 24h.');


--
-- TOC entry 4820 (class 0 OID 16546)
-- Dependencies: 218
-- Data for Name: Class; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Class" VALUES (9, 'Ecole de l''infiltration', 3, 'Permet au Psychomancien de s''introduire dans l''esprit de quelqu''un pour en extraire des informations tout en masquant sa présence');
INSERT INTO public."Class" VALUES (8, 'Ecole du contrôle', 3, 'Permet au Psychomancien de manipuler un esprit autre que le sien. Cela peut être de la manipulation directe (forcer quelqu''un à faire quelque chose) ou indirecte (faire passer des suggestions dans son esprit de manière à affecter son comportement sur le long terme, ajouter des souvenirs…).');
INSERT INTO public."Class" VALUES (7, 'Ecole de l''illusion', 3, 'Permet au Psychomancien d''influer sur l''esprit des autres pour court circuiter leurs sens et leur faire voir/entendre/toucher des choses qui n''existent pas réellement');
INSERT INTO public."Class" VALUES (6, 'Ecole de l''altération', 2, 'Permet à l''élémancien de modifier les caractéristiques physiques d''un élément (chaleur, densité, rugosité…)');
INSERT INTO public."Class" VALUES (5, 'Ecole de la télékinésie', 2, 'Permet à l''élémancien de mouvoir la matière sans contact physique (projeter un rocher, créer des vagues)');
INSERT INTO public."Class" VALUES (4, 'Ecole de la transmutation', 2, 'Permet à l''élémancien de modifier la structure de la matière pour changer un élément en un autre');
INSERT INTO public."Class" VALUES (3, 'Ecole de l''invocation', 1, 'Permet au biomancien de transmettre une partie de sa force vitale à un élément inerte pour le rendre vivant. La mort de cette invocation rend sa force vitale au biomancien. L''entité invoqué sera plus robuste si le biomancien est également élémancien. Le contrôle sur cette entité sera plus efficace si le biomancien est également psychomancien');
INSERT INTO public."Class" VALUES (2, 'Ecole de l''évolution', 1, 'Permet de renforcer les capacités physiques d''un être vivant (Résistance, force, vue, ouïe…) ou au contraire de les diminuer. Permet également de soigner.');
INSERT INTO public."Class" VALUES (1, 'Ecole de la fusion', 1, 'Permet au biomancien de fusionner plusieurs êtres vivants entre eux. Peut être utiliser sur tout type d''être vivant (humain, plantes, animaux, insectes…)');


--
-- TOC entry 4821 (class 0 OID 16553)
-- Dependencies: 219
-- Data for Name: ClassCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."ClassCategory" VALUES (1, 'Biomancien', 'Un mage qui a la capacité d''affecter le vivant');
INSERT INTO public."ClassCategory" VALUES (2, 'Elemancien', 'Un mage qui à la capacité d''affecter les éléments inanimés');
INSERT INTO public."ClassCategory" VALUES (3, 'Psychomancien', 'Un mage qui a la capacité d''affecter l''esprit');


--
-- TOC entry 4822 (class 0 OID 16580)
-- Dependencies: 220
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."User" VALUES (1, 'Maitre Wouf', 'holagatito', 1, NULL);
INSERT INTO public."User" VALUES (2, 'Player Test', 'test', 2, 1);


--
-- TOC entry 4823 (class 0 OID 16587)
-- Dependencies: 221
-- Data for Name: UserRole; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."UserRole" VALUES (1, 'dm');
INSERT INTO public."UserRole" VALUES (2, 'player');


--
-- TOC entry 4657 (class 2606 OID 16537)
-- Name: Character Character_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Character"
    ADD CONSTRAINT "Character_pkey" PRIMARY KEY (id);


--
-- TOC entry 4664 (class 2606 OID 16559)
-- Name: ClassCategory ClassCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ClassCategory"
    ADD CONSTRAINT "ClassCategory_pkey" PRIMARY KEY (id);


--
-- TOC entry 4661 (class 2606 OID 16552)
-- Name: Class Class_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Class"
    ADD CONSTRAINT "Class_pkey" PRIMARY KEY (id);


--
-- TOC entry 4668 (class 2606 OID 16593)
-- Name: UserRole UserRole_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserRole"
    ADD CONSTRAINT "UserRole_pkey" PRIMARY KEY (id);


--
-- TOC entry 4666 (class 2606 OID 16586)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- TOC entry 4658 (class 1259 OID 16571)
-- Name: fki_class; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_class ON public."Character" USING btree ("mainClassId");


--
-- TOC entry 4662 (class 1259 OID 16565)
-- Name: fki_class_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_class_category ON public."Class" USING btree ("classCategoryId");


--
-- TOC entry 4659 (class 1259 OID 16577)
-- Name: fki_second_class; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_second_class ON public."Character" USING btree ("secondClassId");


--
-- TOC entry 4669 (class 2606 OID 16566)
-- Name: Character Character_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Character"
    ADD CONSTRAINT "Character_classId_fkey" FOREIGN KEY ("mainClassId") REFERENCES public."Class"(id) NOT VALID;


--
-- TOC entry 4670 (class 2606 OID 16572)
-- Name: Character Character_secondClassId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Character"
    ADD CONSTRAINT "Character_secondClassId_fkey" FOREIGN KEY ("secondClassId") REFERENCES public."Class"(id) NOT VALID;


--
-- TOC entry 4671 (class 2606 OID 16560)
-- Name: Class Class_classCategoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Class"
    ADD CONSTRAINT "Class_classCategoryId_fkey" FOREIGN KEY ("classCategoryId") REFERENCES public."ClassCategory"(id) NOT VALID;


--
-- TOC entry 4672 (class 2606 OID 16599)
-- Name: User User_characterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES public."Character"(id) NOT VALID;


--
-- TOC entry 4673 (class 2606 OID 16594)
-- Name: User User_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."UserRole"(id) NOT VALID;


-- Completed on 2025-09-18 08:41:46

--
-- PostgreSQL database dump complete
--

