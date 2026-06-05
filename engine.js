/* ================================================
   ENGINE.JS — Flashcard & Quiz Generation Engine
   Knowledge base for 10 topics + template fallback
   ================================================ */

const Engine = (() => {

  /* ──────────────────────────────────────────────
     KNOWLEDGE BASE
  ────────────────────────────────────────────── */
  const KB = {

    /* ============ PHOTOSYNTHESIS ============ */
    photosynthesis: {
      keywords: ['photosynthesis','chlorophyll','chloroplast','light reaction','calvin cycle','plant biology','thylakoid','stroma'],
      flashcards: [
        { front:"What is photosynthesis?", back:"The process by which plants, algae, and some bacteria use sunlight, water, and CO₂ to produce glucose and oxygen.", hint:"Think: light → sugar factory.", tags:["Photosynthesis","Biology"], difficulty:"easy", type:"definition" },
        { front:"Write the overall equation for photosynthesis.", back:"6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂", hint:"Reactants: carbon dioxide and water. Products: glucose and oxygen.", tags:["Photosynthesis","Equations"], difficulty:"medium", type:"recall" },
        { front:"Where does photosynthesis occur in plant cells?", back:"In the chloroplasts, specifically in the thylakoid membranes (light reactions) and stroma (Calvin cycle).", hint:"Green organelle.", tags:["Photosynthesis","Cell Biology"], difficulty:"easy", type:"concept" },
        { front:"What pigment primarily absorbs light for photosynthesis?", back:"Chlorophyll (a and b). Chlorophyll a absorbs red and blue light; chlorophyll b extends light absorption range.", hint:"The pigment that makes plants green.", tags:["Photosynthesis","Pigments"], difficulty:"easy", type:"definition" },
        { front:"What are the two main stages of photosynthesis?", back:"1) Light-dependent reactions (in thylakoids) and 2) Light-independent reactions / Calvin cycle (in stroma).", hint:"One needs light; the other uses ATP and NADPH.", tags:["Photosynthesis","Stages"], difficulty:"medium", type:"concept" },
        { front:"What happens during the light-dependent reactions?", back:"Water is split (photolysis), ATP and NADPH are produced, and oxygen is released as a byproduct.", hint:"Occurs in the thylakoid membranes.", tags:["Photosynthesis","Light Reactions"], difficulty:"medium", type:"concept" },
        { front:"What is the Calvin cycle?", back:"A series of light-independent reactions in the stroma where CO₂ is fixed using ATP and NADPH to produce G3P (glyceraldehyde-3-phosphate), which forms glucose.", hint:"Also called the dark reactions.", tags:["Photosynthesis","Calvin Cycle"], difficulty:"medium", type:"concept" },
        { front:"What is photolysis?", back:"The splitting of water molecules by light energy during the light reactions, releasing electrons, protons (H⁺), and oxygen.", hint:"Photo = light, lysis = splitting.", tags:["Photosynthesis","Photolysis"], difficulty:"medium", type:"definition" },
        { front:"Name three factors that affect the rate of photosynthesis.", back:"Light intensity, CO₂ concentration, and temperature. Water availability is also a key limiting factor.", hint:"Think of what plants need to perform the process.", tags:["Photosynthesis","Limiting Factors"], difficulty:"easy", type:"recall" },
        { front:"What is the role of NADPH in photosynthesis?", back:"NADPH is an electron carrier produced in the light reactions. It donates electrons to the Calvin cycle to help reduce CO₂ into G3P.", hint:"Carries high-energy electrons from light reactions to the Calvin cycle.", tags:["Photosynthesis","NADPH"], difficulty:"hard", type:"application" },
        { front:"What is the Z-scheme in photosynthesis?", back:"A model describing the electron transport pathway in light reactions — electrons flow from water through Photosystem II, through the electron transport chain, and through Photosystem I to produce NADPH.", hint:"Shows the energy level changes of electrons.", tags:["Photosynthesis","Electron Transport"], difficulty:"hard", type:"concept" },
        { front:"What is the primary function of carotenoids in photosynthesis?", back:"They are accessory pigments that absorb light wavelengths not captured by chlorophyll (blue and green light) and transfer that energy to chlorophyll.", hint:"Yellow-orange pigments seen in autumn leaves.", tags:["Photosynthesis","Pigments"], difficulty:"hard", type:"application" }
      ],
      quiz: [
        { type:"mcq", question:"Where do the light-dependent reactions of photosynthesis occur?", options:{A:"Stroma",B:"Mitochondria",C:"Thylakoid membranes",D:"Cell wall"}, answer:"C", explanation:"Light-dependent reactions take place in the thylakoid membranes of the chloroplast, where light energy is captured to produce ATP and NADPH.", difficulty:"easy", tags:["Photosynthesis"] },
        { type:"mcq", question:"Which gas is released as a byproduct of the light-dependent reactions?", options:{A:"Carbon dioxide",B:"Nitrogen",C:"Hydrogen",D:"Oxygen"}, answer:"D", explanation:"Water is split during photolysis in the light reactions, releasing oxygen as a byproduct.", difficulty:"easy", tags:["Photosynthesis"] },
        { type:"mcq", question:"What are the products of the Calvin cycle?", options:{A:"ATP and NADPH",B:"Glucose and oxygen",C:"G3P (used to form glucose) and ADP",D:"Water and carbon dioxide"}, answer:"C", explanation:"The Calvin cycle uses ATP and NADPH to fix CO₂ into G3P, which can be converted into glucose.", difficulty:"medium", tags:["Photosynthesis"] },
        { type:"true_false", statement:"Photosynthesis only occurs in the presence of light.", answer:false, explanation:"The light-dependent reactions require light, but the Calvin cycle (light-independent reactions) can proceed without direct light, using stored ATP and NADPH.", difficulty:"medium", tags:["Photosynthesis"] },
        { type:"fill_blank", question:"The green pigment that captures light energy in plants is called ___.", answer:"chlorophyll", acceptable_answers:["chlorophyll a","chlorophyll b","chlorophyll a and b"], explanation:"Chlorophyll is the primary pigment in chloroplasts that absorbs red and blue light for photosynthesis.", difficulty:"easy", tags:["Photosynthesis"] },
        { type:"mcq", question:"Which of the following is NOT a reactant in photosynthesis?", options:{A:"Water",B:"Carbon dioxide",C:"Oxygen",D:"Light energy"}, answer:"C", explanation:"Oxygen is a product of photosynthesis, not a reactant. Reactants are CO₂, H₂O, and light energy.", difficulty:"easy", tags:["Photosynthesis"] },
        { type:"short_answer", question:"Explain why increasing CO₂ concentration increases the rate of photosynthesis up to a point.", model_answer:"CO₂ is a reactant in the Calvin cycle. Increasing its concentration provides more substrate for the carbon-fixation enzyme RuBisCO, speeding up glucose production. However, other factors (light, temperature, enzyme activity) become limiting beyond a point.", key_points:["CO₂ is a reactant","Used in Calvin cycle","Other limiting factors eventually cap the rate"], difficulty:"hard", tags:["Photosynthesis"] },
        { type:"mcq", question:"What molecule directly fixes CO₂ in the Calvin cycle?", options:{A:"ATP",B:"Chlorophyll",C:"RuBisCO",D:"NADPH"}, answer:"C", explanation:"RuBisCO (ribulose-1,5-bisphosphate carboxylase/oxygenase) is the enzyme that catalyzes the fixation of CO₂ to RuBP in the Calvin cycle.", difficulty:"hard", tags:["Photosynthesis"] },
        { type:"true_false", statement:"Chloroplasts and mitochondria are both involved in energy transformation in plant cells.", answer:true, explanation:"Chloroplasts perform photosynthesis (light → chemical energy) while mitochondria perform cellular respiration (chemical energy → ATP), so both are energy-transforming organelles.", difficulty:"medium", tags:["Photosynthesis","Cell Biology"] },
        { type:"matching", instruction:"Match each photosynthesis component to its location or role.", pairs:[{term:"Light reactions",match:"Thylakoid membranes"},{term:"Calvin cycle",match:"Stroma"},{term:"Chlorophyll",match:"Absorbs light energy"},{term:"Oxygen",match:"Byproduct of photolysis"}], difficulty:"medium", tags:["Photosynthesis"] }
      ]
    },

    /* ============ CELL BIOLOGY ============ */
    'cell biology': {
      keywords: ['cell','mitosis','meiosis','dna','rna','organelle','nucleus','ribosome','membrane','prokaryote','eukaryote','protein synthesis','chromosome'],
      flashcards: [
        { front:"What is the cell theory?", back:"All living things are made of cells; the cell is the basic unit of life; all cells arise from pre-existing cells.", hint:"Three fundamental principles of biology.", tags:["Cell Biology"], difficulty:"easy", type:"definition" },
        { front:"What is the difference between prokaryotic and eukaryotic cells?", back:"Prokaryotes lack a membrane-bound nucleus and organelles (e.g., bacteria). Eukaryotes have a nucleus and membrane-bound organelles (e.g., animals, plants, fungi).", hint:"Pro = before nucleus; eu = true nucleus.", tags:["Cell Biology","Cell Types"], difficulty:"easy", type:"concept" },
        { front:"What is the function of the mitochondria?", back:"Known as the powerhouse of the cell; produces ATP through cellular respiration via the Krebs cycle and oxidative phosphorylation.", hint:"ATP = cellular energy currency.", tags:["Cell Biology","Organelles"], difficulty:"easy", type:"definition" },
        { front:"What happens during DNA replication?", back:"The double helix unwinds; each strand serves as a template; DNA polymerase synthesizes complementary strands, producing two identical DNA molecules.", hint:"Semi-conservative replication.", tags:["Cell Biology","DNA"], difficulty:"medium", type:"concept" },
        { front:"What are the stages of mitosis?", back:"PMAT: Prophase, Metaphase, Anaphase, Telophase (plus Cytokinesis). Result: two genetically identical daughter cells.", hint:"Use 'PMAT' as a mnemonic.", tags:["Cell Biology","Mitosis"], difficulty:"medium", type:"recall" },
        { front:"How does meiosis differ from mitosis?", back:"Meiosis produces 4 genetically unique haploid cells; mitosis produces 2 genetically identical diploid cells. Meiosis involves 2 divisions and crossing-over.", hint:"Meiosis is for sexual reproduction.", tags:["Cell Biology","Meiosis"], difficulty:"medium", type:"concept" },
        { front:"What is the function of ribosomes?", back:"Ribosomes are the site of protein synthesis (translation). They assemble amino acids according to mRNA instructions.", hint:"Found free in cytoplasm or on rough ER.", tags:["Cell Biology","Organelles"], difficulty:"easy", type:"definition" },
        { front:"What is the central dogma of molecular biology?", back:"DNA → RNA → Protein. Genetic information flows from DNA (transcription) to mRNA, then mRNA is translated into proteins at ribosomes.", hint:"The flow of genetic information.", tags:["Cell Biology","Molecular Biology"], difficulty:"medium", type:"concept" },
        { front:"What is the role of the Golgi apparatus?", back:"It modifies, packages, and ships proteins and lipids to their destinations inside or outside the cell (secretion).", hint:"The cell's post office.", tags:["Cell Biology","Organelles"], difficulty:"easy", type:"definition" },
        { front:"What is apoptosis?", back:"Programmed cell death — an orderly, controlled process by which cells self-destruct when damaged or no longer needed, essential for development and disease prevention.", hint:"Not the same as necrosis (uncontrolled death).", tags:["Cell Biology","Apoptosis"], difficulty:"hard", type:"concept" }
      ],
      quiz: [
        { type:"mcq", question:"Which organelle is responsible for ATP production in eukaryotic cells?", options:{A:"Ribosome",B:"Golgi apparatus",C:"Mitochondrion",D:"Lysosome"}, answer:"C", explanation:"Mitochondria produce ATP through cellular respiration, making them the energy powerhouses of eukaryotic cells.", difficulty:"easy", tags:["Cell Biology"] },
        { type:"mcq", question:"How many chromosomes does a human haploid cell contain?", options:{A:"46",B:"23",C:"92",D:"44"}, answer:"B", explanation:"Human diploid cells contain 46 chromosomes (23 pairs). Haploid cells (gametes) contain 23 chromosomes.", difficulty:"easy", tags:["Cell Biology"] },
        { type:"true_false", statement:"Prokaryotic cells contain membrane-bound organelles.", answer:false, explanation:"Prokaryotes lack membrane-bound organelles and a defined nucleus. These features are characteristic of eukaryotic cells.", difficulty:"easy", tags:["Cell Biology"] },
        { type:"fill_blank", question:"The process by which mRNA is synthesized from a DNA template is called ___.", answer:"transcription", acceptable_answers:["transcription"], explanation:"During transcription, RNA polymerase reads the DNA template and synthesizes a complementary mRNA strand in the nucleus.", difficulty:"medium", tags:["Cell Biology"] },
        { type:"mcq", question:"Which phase of mitosis do chromosomes align at the cell's equatorial plate?", options:{A:"Prophase",B:"Anaphase",C:"Telophase",D:"Metaphase"}, answer:"D", explanation:"During metaphase, chromosomes are aligned along the metaphase plate (cell equator) by spindle fibers, preparing for separation.", difficulty:"medium", tags:["Cell Biology"] },
        { type:"short_answer", question:"Explain the difference between mitosis and meiosis in terms of purpose and outcome.", model_answer:"Mitosis produces two identical diploid daughter cells for growth and repair. Meiosis produces four genetically unique haploid gametes for sexual reproduction, through two rounds of division and genetic recombination.", key_points:["Mitosis: 2 diploid identical cells","Meiosis: 4 haploid unique cells","Meiosis has 2 divisions + crossing-over"], difficulty:"hard", tags:["Cell Biology"] },
        { type:"true_false", statement:"The rough endoplasmic reticulum is studded with ribosomes.", answer:true, explanation:"The rough ER is called 'rough' because of the ribosomes on its surface, which synthesize proteins destined for secretion or membrane insertion.", difficulty:"easy", tags:["Cell Biology"] },
        { type:"matching", instruction:"Match each organelle to its primary function.", pairs:[{term:"Mitochondria",match:"ATP production"},{term:"Ribosome",match:"Protein synthesis"},{term:"Golgi apparatus",match:"Protein packaging/shipping"},{term:"Nucleus",match:"Houses DNA"}], difficulty:"easy", tags:["Cell Biology"] }
      ]
    },

    /* ============ FRENCH REVOLUTION ============ */
    'french revolution': {
      keywords: ['french revolution','bastille','napoleon','robespierre','guillotine','estates','louis xvi','reign of terror','jacobin','marie antoinette'],
      flashcards: [
        { front:"What event is considered the symbolic start of the French Revolution?", back:"The storming of the Bastille fortress on July 14, 1789, which freed political prisoners and seized weapons.", hint:"A famous Parisian prison-fortress.", tags:["French Revolution","Key Events"], difficulty:"easy", type:"recall" },
        { front:"What were the Three Estates in pre-revolutionary France?", back:"First Estate: Clergy; Second Estate: Nobility; Third Estate: Commoners (97% of population, who paid most taxes).", hint:"The Third Estate demanded representation.", tags:["French Revolution","Social Structure"], difficulty:"easy", type:"definition" },
        { front:"What was the Declaration of the Rights of Man and Citizen?", back:"A 1789 document establishing principles of liberty, equality, and popular sovereignty, inspired by Enlightenment philosophy.", hint:"France's answer to the American Declaration of Independence.", tags:["French Revolution","Documents"], difficulty:"medium", type:"definition" },
        { front:"Who was Maximilien Robespierre?", back:"A Jacobin leader who headed the Committee of Public Safety during the Reign of Terror (1793–94), ordering mass executions before being guillotined himself.", hint:"He fell victim to the very system he created.", tags:["French Revolution","Key Figures"], difficulty:"medium", type:"recall" },
        { front:"What was the Reign of Terror?", back:"A period (Sept 1793–July 1794) of revolutionary violence led by Robespierre in which ~17,000 people were executed and 40,000+ died in prison.", hint:"Radical phase of the Revolution; ended with Thermidorian Reaction.", tags:["French Revolution","Reign of Terror"], difficulty:"medium", type:"concept" },
        { front:"What was the Tennis Court Oath?", back:"A June 20, 1789 pledge by members of the National Assembly to remain assembled until a new constitution for France was established.", hint:"Taken after being locked out of the Estates-General hall.", tags:["French Revolution","Key Events"], difficulty:"medium", type:"recall" },
        { front:"How did Napoleon Bonaparte rise to power?", back:"Napoleon staged a coup (18 Brumaire, 1799), overthrowing the Directory and establishing the Consulate, eventually crowning himself Emperor in 1804.", hint:"He was a military hero who exploited political instability.", tags:["French Revolution","Napoleon"], difficulty:"medium", type:"concept" },
        { front:"What was the significance of the Napoleonic Code?", back:"A civil legal code (1804) that standardized French law, enshrined equality before the law, property rights, and religious tolerance, influencing legal systems worldwide.", hint:"Still forms the basis of civil law in many countries.", tags:["French Revolution","Napoleon"], difficulty:"hard", type:"application" },
        { front:"What caused the French Revolution?", back:"Causes included financial crisis, unfair taxation of the Third Estate, Enlightenment ideas, food shortages, weak leadership of Louis XVI, and resentment of aristocratic privilege.", hint:"Multiple social, economic, and political factors combined.", tags:["French Revolution","Causes"], difficulty:"medium", type:"concept" },
        { front:"What was the Directory?", back:"The five-man executive body that governed France from 1795 to 1799 after the Thermidorian Reaction. It was marked by corruption and instability, ended by Napoleon's coup.", hint:"Replaced Robespierre's government; preceded Napoleon.", tags:["French Revolution","Government"], difficulty:"hard", type:"definition" }
      ],
      quiz: [
        { type:"mcq", question:"In which year did the storming of the Bastille occur?", options:{A:"1776",B:"1789",C:"1793",D:"1799"}, answer:"B", explanation:"The Bastille was stormed on July 14, 1789, marking the symbolic beginning of the French Revolution.", difficulty:"easy", tags:["French Revolution"] },
        { type:"mcq", question:"Which social class made up approximately 97% of France's pre-revolutionary population?", options:{A:"First Estate",B:"Second Estate",C:"Third Estate",D:"Fourth Estate"}, answer:"C", explanation:"The Third Estate, comprising commoners (peasants, bourgeoisie, and urban workers), made up about 97% of the population yet bore most of the tax burden.", difficulty:"easy", tags:["French Revolution"] },
        { type:"true_false", statement:"Robespierre was executed by guillotine during the Thermidorian Reaction.", answer:true, explanation:"Robespierre was arrested and guillotined on July 28, 1794, ending the Reign of Terror during the Thermidorian Reaction.", difficulty:"medium", tags:["French Revolution"] },
        { type:"fill_blank", question:"The revolutionary pledge known as the ___ Oath was taken by members of the National Assembly on June 20, 1789.", answer:"Tennis Court", acceptable_answers:["Tennis Court","tennis court"], explanation:"Members of the National Assembly swore the Tennis Court Oath, pledging to remain assembled until France had a new constitution.", difficulty:"medium", tags:["French Revolution"] },
        { type:"mcq", question:"What was the main cause of France's financial crisis before the Revolution?", options:{A:"Foreign invasion","B":"Excessive spending on wars and the royal court, while the Third Estate bore unfair tax burdens","C":"A trade embargo","D":"Drought and crop failure"}, answer:"B", explanation:"France was bankrupted by wars (including supporting the American Revolution) and lavish royal spending, while the nobility and clergy remained largely tax-exempt.", difficulty:"medium", tags:["French Revolution"] },
        { type:"matching", instruction:"Match each figure to their role in the French Revolution.", pairs:[{term:"Robespierre",match:"Led the Reign of Terror"},{term:"Louis XVI",match:"Executed French King"},{term:"Napoleon Bonaparte",match:"Rose to Emperor after 1799 coup"},{term:"Marie Antoinette",match:"Austrian-born French Queen"}], difficulty:"medium", tags:["French Revolution"] },
        { type:"short_answer", question:"How did Enlightenment ideas contribute to the French Revolution?", model_answer:"Enlightenment philosophers like Rousseau, Voltaire, and Montesquieu challenged divine-right monarchy and promoted ideas of popular sovereignty, natural rights, and separation of powers. These concepts inspired revolutionaries to demand a constitutional government and equal rights.", key_points:["Challenged divine right","Promoted natural rights","Inspired constitutional government"], difficulty:"hard", tags:["French Revolution"] }
      ]
    },

    /* ============ WORLD WAR II ============ */
    'world war 2': {
      keywords: ['world war 2','wwii','ww2','hitler','holocaust','d-day','hiroshima','nazi','pearl harbor','allied','axis'],
      flashcards: [
        { front:"What event triggered the US entry into World War II?", back:"The Japanese surprise attack on Pearl Harbor, Hawaii, on December 7, 1941, which led the US to declare war on Japan the next day.", hint:"'A date which will live in infamy.'", tags:["WWII","US History"], difficulty:"easy", type:"recall" },
        { front:"What were the Axis Powers in WWII?", back:"Germany, Italy, and Japan were the primary Axis Powers, bound by the Tripartite Pact (1940).", hint:"Opposed by the Allied Powers.", tags:["WWII","Key Facts"], difficulty:"easy", type:"recall" },
        { front:"What was D-Day?", back:"June 6, 1944 — the Allied amphibious invasion of Normandy, France (Operation Overlord), the largest seaborne invasion in history. It opened a Western Front against Nazi Germany.", hint:"Largest amphibious operation in history.", tags:["WWII","Key Events"], difficulty:"easy", type:"recall" },
        { front:"What was the Holocaust?", back:"The systematic, state-sponsored genocide of six million Jews and millions of others (Roma, disabled, POWs, etc.) by the Nazi regime under Adolf Hitler.", hint:"Never again.", tags:["WWII","Holocaust"], difficulty:"easy", type:"definition" },
        { front:"What ended WWII in the Pacific?", back:"The US dropped atomic bombs on Hiroshima (Aug 6) and Nagasaki (Aug 9), 1945. Japan announced surrender on August 15, 1945 (V-J Day).", hint:"Two Japanese cities.", tags:["WWII","Pacific Theater"], difficulty:"medium", type:"recall" },
        { front:"What was Operation Barbarossa?", back:"Germany's massive invasion of the Soviet Union, launched June 22, 1941 — the largest military operation in history. It ultimately failed, turning the tide of the Eastern Front.", hint:"Named after the medieval German emperor.", tags:["WWII","Eastern Front"], difficulty:"medium", type:"definition" },
        { front:"What were the Nuremberg Laws?", back:"1935 Nazi racial laws that stripped Jewish Germans of citizenship, forbade marriage between Jews and non-Jews, and legally institutionalized anti-Semitism.", hint:"Precursor to the Holocaust.", tags:["WWII","Holocaust"], difficulty:"medium", type:"definition" },
        { front:"What was the Manhattan Project?", back:"The US-led secret research project (1942–45) that developed the first nuclear weapons, culminating in the atomic bombs dropped on Japan.", hint:"Code name; involved scientists like Oppenheimer.", tags:["WWII","Science"], difficulty:"medium", type:"definition" },
        { front:"What were the key outcomes of WWII?", back:"Defeat of Nazi Germany and Japan; formation of the United Nations; start of the Cold War; decolonization movements; US and USSR emerged as superpowers; Marshall Plan for Europe's reconstruction.", hint:"Reshaped the entire global order.", tags:["WWII","Outcomes"], difficulty:"medium", type:"concept" },
        { front:"What was the significance of the Battle of Stalingrad?", back:"A brutal 1942–43 battle that ended in Soviet victory and is considered a major turning point — Germany's first significant Eastern Front defeat, halting the Nazi advance.", hint:"One of the deadliest battles in history.", tags:["WWII","Eastern Front"], difficulty:"hard", type:"application" }
      ],
      quiz: [
        { type:"mcq", question:"On which date did Japan attack Pearl Harbor?", options:{A:"September 1, 1939",B:"December 7, 1941",C:"June 6, 1944",D:"August 6, 1945"}, answer:"B", explanation:"Japan attacked the US naval base at Pearl Harbor, Hawaii, on December 7, 1941, prompting the US to enter WWII.", difficulty:"easy", tags:["WWII"] },
        { type:"mcq", question:"What was the code name for the Allied invasion of Normandy on D-Day?", options:{A:"Operation Barbarossa",B:"Operation Sea Lion",C:"Operation Overlord",D:"Operation Market Garden"}, answer:"C", explanation:"Operation Overlord was the code name for the Allied invasion of Normandy on June 6, 1944.", difficulty:"medium", tags:["WWII"] },
        { type:"true_false", statement:"The Manhattan Project was developed by Germany.", answer:false, explanation:"The Manhattan Project was a secret US-led research program that developed the atomic bomb, involving scientists including J. Robert Oppenheimer.", difficulty:"easy", tags:["WWII"] },
        { type:"fill_blank", question:"Germany's invasion of the Soviet Union in 1941 was codenamed Operation ___.", answer:"Barbarossa", acceptable_answers:["Barbarossa","Operation Barbarossa"], explanation:"Operation Barbarossa, launched June 22, 1941, was the largest military operation in WWII history and eventually failed, marking a turning point on the Eastern Front.", difficulty:"medium", tags:["WWII"] },
        { type:"matching", instruction:"Match each WWII event to its correct year.", pairs:[{term:"D-Day invasion",match:"1944"},{term:"Pearl Harbor attack",match:"1941"},{term:"Germany invades Poland",match:"1939"},{term:"Japan surrenders",match:"1945"}], difficulty:"medium", tags:["WWII"] },
        { type:"short_answer", question:"Why is the Battle of Stalingrad considered a major turning point of WWII?", model_answer:"Stalingrad (1942–43) was the first major German defeat on the Eastern Front. The Soviet encirclement and destruction of Germany's 6th Army halted Hitler's eastward advance, boosted Allied morale, and forced Germany onto the defensive for the rest of the war.", key_points:["First major German Eastern Front defeat","Soviet encirclement strategy","Halted Nazi advance"], difficulty:"hard", tags:["WWII"] }
      ]
    },

    /* ============ PYTHON PROGRAMMING ============ */
    python: {
      keywords: ['python','decorator','generator','lambda','comprehension','oop','class','inheritance','exception','iterator','module','pip'],
      flashcards: [
        { front:"What is a Python decorator?", back:"A function that wraps another function to extend its behavior without modifying it. Uses the @syntax. Common uses: logging, timing, access control.", hint:"Think: function that takes a function as argument.", tags:["Python","Decorators"], difficulty:"medium", type:"definition" },
        { front:"What is a Python generator?", back:"A function that uses yield instead of return, producing values one at a time lazily. Generators are memory-efficient for large datasets.", hint:"Uses yield keyword; returns a generator object.", tags:["Python","Generators"], difficulty:"medium", type:"definition" },
        { front:"What is a list comprehension in Python?", back:"A concise way to create lists: [expression for item in iterable if condition]. Example: [x**2 for x in range(10) if x % 2 == 0]", hint:"One-line alternative to a for-loop that builds a list.", tags:["Python","Comprehensions"], difficulty:"easy", type:"definition" },
        { front:"What is the difference between *args and **kwargs?", back:"*args allows a function to accept any number of positional arguments as a tuple. **kwargs accepts any number of keyword arguments as a dictionary.", hint:"* = positional, ** = keyword.", tags:["Python","Functions"], difficulty:"medium", type:"concept" },
        { front:"What is the GIL in Python?", back:"Global Interpreter Lock — a mutex that prevents multiple native threads from executing Python bytecode simultaneously in CPython, limiting true parallelism.", hint:"Affects multi-threading in CPU-bound tasks.", tags:["Python","Concurrency"], difficulty:"hard", type:"definition" },
        { front:"What is the difference between a shallow copy and a deep copy?", back:"Shallow copy creates a new object but references nested objects. Deep copy creates a completely independent clone including all nested objects. Use copy.deepcopy().", hint:"Nested mutable objects behave differently.", tags:["Python","Memory"], difficulty:"medium", type:"concept" },
        { front:"What are Python's dunder (magic) methods?", back:"Special methods with double underscores (e.g., __init__, __str__, __len__, __repr__) that define how objects respond to built-in operations.", hint:"'Double underscore' methods customize object behavior.", tags:["Python","OOP"], difficulty:"medium", type:"definition" },
        { front:"What is the difference between is and == in Python?", back:"== checks value equality; is checks identity (whether two variables point to the same object in memory).", hint:"is is for identity; == is for equality.", tags:["Python","Basics"], difficulty:"easy", type:"concept" },
        { front:"How does Python's garbage collection work?", back:"Python uses reference counting as the primary mechanism. When an object's reference count drops to 0, it is deallocated. A cyclic garbage collector handles reference cycles.", hint:"Reference counting + cycle detection.", tags:["Python","Memory"], difficulty:"hard", type:"concept" },
        { front:"What is a Python context manager?", back:"An object that defines __enter__ and __exit__ methods, used with the with statement to manage resources (e.g., file handles, locks) automatically.", hint:"with open('file.txt') as f:", tags:["Python","Context Managers"], difficulty:"medium", type:"definition" }
      ],
      quiz: [
        { type:"mcq", question:"Which keyword makes a Python function a generator?", options:{A:"return",B:"yield",C:"async",D:"generate"}, answer:"B", explanation:"The yield keyword pauses the function and returns a value to the caller without destroying the local state. Calling next() resumes execution.", difficulty:"easy", tags:["Python"] },
        { type:"mcq", question:"What is the output of: print(type([]))?", options:{A:"<class 'tuple'>",B:"<class 'dict'>",C:"<class 'list'>",D:"<class 'array'>"}, answer:"C", explanation:"[] creates an empty list, so type([]) returns <class 'list'>.", difficulty:"easy", tags:["Python"] },
        { type:"true_false", statement:"Python's GIL allows true parallelism for CPU-bound multithreaded programs.", answer:false, explanation:"The GIL prevents multiple threads from executing Python bytecode simultaneously in CPython. For CPU-bound parallelism, use multiprocessing instead.", difficulty:"medium", tags:["Python"] },
        { type:"fill_blank", question:"To create a decorator in Python, you apply it to a function using the ___ symbol followed by the decorator name.", answer:"@", acceptable_answers:["@","at sign"], explanation:"The @ symbol is syntactic sugar for applying a decorator. @my_decorator above def func() is equivalent to func = my_decorator(func).", difficulty:"easy", tags:["Python"] },
        { type:"mcq", question:"Which method is called when an object is created in a Python class?", options:{A:"__create__",B:"__new__",C:"__init__",D:"__start__"}, answer:"C", explanation:"__init__ is the initializer method called after the object is created. __new__ creates the object, but __init__ is what you define to set up its initial state.", difficulty:"medium", tags:["Python"] },
        { type:"short_answer", question:"Explain the difference between a list and a tuple in Python.", model_answer:"Lists are mutable sequences (created with []) that can be modified after creation. Tuples are immutable sequences (created with ()) that cannot be changed after creation. Tuples are generally faster and used for fixed data, while lists are used when the collection needs to change.", key_points:["Lists are mutable","Tuples are immutable","Tuples are faster/hashable"], difficulty:"medium", tags:["Python"] },
        { type:"true_false", statement:"In Python, everything is an object, including integers and functions.", answer:true, explanation:"Python is fully object-oriented — integers, strings, functions, and classes are all objects and instances of their respective types.", difficulty:"easy", tags:["Python"] }
      ]
    },

    /* ============ JAVASCRIPT ============ */
    javascript: {
      keywords: ['javascript','js','closure','prototype','async','promise','event loop','dom','hoisting','callback','arrow function','es6'],
      flashcards: [
        { front:"What is a closure in JavaScript?", back:"A function that retains access to its outer scope's variables even after the outer function has returned.", hint:"Inner function 'closes over' outer variables.", tags:["JavaScript","Closures"], difficulty:"medium", type:"definition" },
        { front:"What is the event loop in JavaScript?", back:"A mechanism that enables non-blocking I/O by continuously checking the call stack and task queues (microtask/macrotask), executing callbacks when the stack is empty.", hint:"JavaScript is single-threaded but asynchronous.", tags:["JavaScript","Async"], difficulty:"hard", type:"concept" },
        { front:"What is hoisting in JavaScript?", back:"JavaScript moves var declarations and function declarations to the top of their scope during compilation. let/const are hoisted but remain in the Temporal Dead Zone until declared.", hint:"Declarations are hoisted, not initializations.", tags:["JavaScript","Basics"], difficulty:"medium", type:"definition" },
        { front:"What is the difference between == and === in JavaScript?", back:"== performs type coercion (loose equality). === checks value AND type without coercion (strict equality). Prefer === to avoid unexpected results.", hint:"Always use === for predictable comparisons.", tags:["JavaScript","Basics"], difficulty:"easy", type:"concept" },
        { front:"What is a Promise in JavaScript?", back:"An object representing an eventual completion or failure of an asynchronous operation. Has three states: pending, fulfilled, rejected. Supports .then(), .catch(), .finally().", hint:"Alternative to callback hell.", tags:["JavaScript","Async"], difficulty:"medium", type:"definition" },
        { front:"What is prototypal inheritance in JavaScript?", back:"Objects inherit properties and methods from other objects via the prototype chain. Every object has a [[Prototype]] pointing to its parent object.", hint:"Different from classical class-based inheritance.", tags:["JavaScript","OOP"], difficulty:"hard", type:"concept" },
        { front:"What is the difference between let, const, and var?", back:"var: function-scoped, hoisted, re-declarable. let: block-scoped, not hoisted (TDZ), re-assignable. const: block-scoped, not hoisted, not re-assignable (reference is fixed).", hint:"Prefer const, then let; avoid var.", tags:["JavaScript","Variables"], difficulty:"easy", type:"concept" },
        { front:"What are arrow functions and how do they differ?", back:"Arrow functions (=>) are concise and do NOT have their own this, arguments, or super. They inherit this from the enclosing lexical scope.", hint:"this inside arrow functions refers to outer context.", tags:["JavaScript","Functions"], difficulty:"medium", type:"definition" },
        { front:"What is event delegation in JavaScript?", back:"A technique where a single event listener is attached to a parent element to handle events from its child elements, using event bubbling.", hint:"More efficient than adding listeners to each child.", tags:["JavaScript","DOM"], difficulty:"medium", type:"application" },
        { front:"What does async/await do in JavaScript?", back:"Syntactic sugar over Promises. async marks a function as returning a Promise; await pauses execution until the Promise resolves, making async code look synchronous.", hint:"Requires the function to be declared async.", tags:["JavaScript","Async"], difficulty:"medium", type:"definition" }
      ],
      quiz: [
        { type:"mcq", question:"What does 'typeof null' return in JavaScript?", options:{A:"'null'",B:"'undefined'",C:"'object'",D:"'boolean'"}, answer:"C", explanation:"This is a well-known JavaScript quirk — typeof null returns 'object', which is considered a bug from the early days of the language.", difficulty:"medium", tags:["JavaScript"] },
        { type:"true_false", statement:"Arrow functions have their own 'this' binding.", answer:false, explanation:"Arrow functions do NOT have their own 'this'. They inherit 'this' from their lexical (enclosing) scope, which is a key difference from regular functions.", difficulty:"medium", tags:["JavaScript"] },
        { type:"fill_blank", question:"The JavaScript method that returns a new array with all elements that pass a test is called ___.", answer:"filter", acceptable_answers:["filter","Array.filter",".filter()"], explanation:"Array.prototype.filter() creates a new array with all elements that pass the test implemented by the provided function.", difficulty:"easy", tags:["JavaScript"] },
        { type:"mcq", question:"Which of the following correctly declares a block-scoped variable that cannot be reassigned?", options:{A:"var x = 5",B:"let x = 5",C:"const x = 5",D:"static x = 5"}, answer:"C", explanation:"const declares a block-scoped variable whose reference cannot be reassigned. Note: for objects/arrays, properties/elements can still be mutated.", difficulty:"easy", tags:["JavaScript"] },
        { type:"mcq", question:"What is the output of: console.log(0.1 + 0.2 === 0.3)?", options:{A:"true",B:"false",C:"undefined",D:"NaN"}, answer:"B", explanation:"Due to floating-point precision issues, 0.1 + 0.2 evaluates to 0.30000000000000004 in JavaScript, so the strict equality check returns false.", difficulty:"hard", tags:["JavaScript"] },
        { type:"short_answer", question:"Explain what a closure is and give a practical use case.", model_answer:"A closure is a function that retains access to variables from its outer scope even after the outer function has returned. Practical use: creating private variables in modules, factory functions, or partial application of functions.", key_points:["Retains outer scope access","Outer function has returned","Use: private variables, factories"], difficulty:"hard", tags:["JavaScript"] }
      ]
    },

    /* ============ DATA STRUCTURES ============ */
    'data structures': {
      keywords: ['data structure','array','linked list','stack','queue','tree','binary tree','graph','hash','heap','sorting','algorithm','big o'],
      flashcards: [
        { front:"What is the time complexity of binary search?", back:"O(log n) — the search space is halved with each step. Requires a sorted array.", hint:"Each step eliminates half the remaining elements.", tags:["Data Structures","Search"], difficulty:"easy", type:"recall" },
        { front:"What is the difference between a stack and a queue?", back:"Stack: LIFO (Last In, First Out) — push/pop from the same end. Queue: FIFO (First In, First Out) — enqueue at back, dequeue from front.", hint:"Stack = plates; Queue = line at a store.", tags:["Data Structures","Linear"], difficulty:"easy", type:"concept" },
        { front:"What is a hash table?", back:"A data structure that maps keys to values using a hash function. Provides O(1) average time complexity for insertion, deletion, and lookup.", hint:"Used for dictionaries/maps. Collisions are handled via chaining or open addressing.", tags:["Data Structures","Hash Tables"], difficulty:"medium", type:"definition" },
        { front:"What is a binary search tree (BST)?", back:"A tree where each node has at most 2 children, with left subtree containing smaller values and right subtree containing larger values. Average search: O(log n).", hint:"Left < Root < Right.", tags:["Data Structures","Trees"], difficulty:"medium", type:"definition" },
        { front:"What is Big O notation?", back:"A mathematical notation describing the worst-case time or space complexity of an algorithm as the input size (n) grows. Ignores constants and lower-order terms.", hint:"O(1) < O(log n) < O(n) < O(n log n) < O(n²).", tags:["Data Structures","Complexity"], difficulty:"easy", type:"definition" },
        { front:"What is the difference between DFS and BFS?", back:"DFS (Depth-First Search): explores as far as possible along each branch before backtracking. BFS (Breadth-First Search): explores all neighbors at the current depth before going deeper.", hint:"DFS uses a stack; BFS uses a queue.", tags:["Data Structures","Graphs"], difficulty:"medium", type:"concept" },
        { front:"What is a heap data structure?", back:"A complete binary tree where each parent is ≥ (max-heap) or ≤ (min-heap) its children. Used for priority queues and heap sort. Insertion and deletion: O(log n).", hint:"Root is always the maximum (or minimum) element.", tags:["Data Structures","Trees"], difficulty:"medium", type:"definition" },
        { front:"What is dynamic programming?", back:"An optimization technique that breaks problems into overlapping subproblems, stores results (memoization/tabulation) to avoid redundant computation. Examples: Fibonacci, knapsack.", hint:"'Remember what you've computed before.'", tags:["Data Structures","Algorithms"], difficulty:"hard", type:"concept" },
        { front:"What is the time complexity of quicksort (average)?", back:"O(n log n) on average, O(n²) worst case (when pivot is always the smallest/largest element). In-place sorting with O(log n) space for recursion.", hint:"Divide and conquer approach; pivot selection matters.", tags:["Data Structures","Sorting"], difficulty:"medium", type:"recall" },
        { front:"What is a linked list, and how does it differ from an array?", back:"A linked list is a linear data structure where each node stores data and a pointer to the next node. Arrays: O(1) access by index; Linked lists: O(n) access but O(1) insert/delete at known position.", hint:"No contiguous memory needed.", tags:["Data Structures","Linear"], difficulty:"easy", type:"concept" }
      ],
      quiz: [
        { type:"mcq", question:"What is the average time complexity of inserting into a hash table?", options:{A:"O(1)",B:"O(log n)",C:"O(n)",D:"O(n²)"}, answer:"A", explanation:"Hash tables provide O(1) average case for insertion, deletion, and lookup due to direct computation of the index via the hash function.", difficulty:"easy", tags:["Data Structures"] },
        { type:"mcq", question:"Which data structure uses LIFO (Last In, First Out) ordering?", options:{A:"Queue",B:"Stack",C:"Heap",D:"Graph"}, answer:"B", explanation:"A stack follows LIFO — the last element pushed is the first to be popped. Common uses: function call stack, undo operations.", difficulty:"easy", tags:["Data Structures"] },
        { type:"true_false", statement:"A binary search tree always guarantees O(log n) search time.", answer:false, explanation:"BST search is O(log n) on average, but degrades to O(n) in the worst case when the tree becomes skewed (e.g., inserting sorted data). Self-balancing BSTs (AVL, Red-Black) guarantee O(log n).", difficulty:"hard", tags:["Data Structures"] },
        { type:"fill_blank", question:"Breadth-First Search (BFS) uses a ___ as its underlying data structure.", answer:"queue", acceptable_answers:["queue","Queue"], explanation:"BFS explores all neighbors level by level, using a queue (FIFO) to track the next nodes to visit.", difficulty:"medium", tags:["Data Structures"] },
        { type:"mcq", question:"What is the worst-case time complexity of bubble sort?", options:{A:"O(n log n)",B:"O(n)",C:"O(n²)",D:"O(log n)"}, answer:"C", explanation:"Bubble sort has O(n²) worst-case complexity because it performs n-1 passes, each comparing adjacent elements — resulting in n*(n-1)/2 comparisons.", difficulty:"medium", tags:["Data Structures"] },
        { type:"matching", instruction:"Match each algorithm/structure to its average time complexity.", pairs:[{term:"Binary Search",match:"O(log n)"},{term:"Hash Table lookup",match:"O(1)"},{term:"Bubble Sort",match:"O(n²)"},{term:"Merge Sort",match:"O(n log n)"}], difficulty:"medium", tags:["Data Structures"] }
      ]
    },

    /* ============ MACHINE LEARNING ============ */
    'machine learning': {
      keywords: ['machine learning','ml','neural network','deep learning','gradient descent','overfitting','supervised','unsupervised','classification','regression','ai','artificial intelligence'],
      flashcards: [
        { front:"What is the difference between supervised and unsupervised learning?", back:"Supervised: model trains on labeled data (input-output pairs). Unsupervised: model finds patterns in unlabeled data (e.g., clustering, dimensionality reduction).", hint:"Labels vs. no labels.", tags:["Machine Learning","Types"], difficulty:"easy", type:"concept" },
        { front:"What is gradient descent?", back:"An optimization algorithm that iteratively adjusts model parameters in the direction of the negative gradient of the loss function to minimize error.", hint:"'Descend' down the loss surface step by step.", tags:["Machine Learning","Optimization"], difficulty:"medium", type:"definition" },
        { front:"What is overfitting in machine learning?", back:"When a model learns the training data too well, including noise, and performs poorly on unseen data. Combated with: regularization, dropout, more data, cross-validation.", hint:"Model memorizes instead of generalizing.", tags:["Machine Learning","Model Quality"], difficulty:"medium", type:"definition" },
        { front:"What is the bias-variance tradeoff?", back:"Bias: error from wrong assumptions (underfitting). Variance: error from sensitivity to small fluctuations (overfitting). Optimal models balance both.", hint:"Low bias + high variance = overfitting; High bias + low variance = underfitting.", tags:["Machine Learning","Theory"], difficulty:"hard", type:"concept" },
        { front:"What is a neural network?", back:"A computational model inspired by the brain, consisting of layers of interconnected nodes (neurons). Learns by adjusting weights via backpropagation and gradient descent.", hint:"Input → Hidden layers → Output.", tags:["Machine Learning","Deep Learning"], difficulty:"easy", type:"definition" },
        { front:"What is backpropagation?", back:"An algorithm that calculates gradients of the loss function with respect to each weight using the chain rule, propagating error backward through the network to update weights.", hint:"The algorithm that trains neural networks.", tags:["Machine Learning","Deep Learning"], difficulty:"hard", type:"definition" },
        { front:"What is regularization in ML?", back:"Techniques to reduce overfitting by penalizing model complexity. L1 (Lasso) adds |weights| penalty; L2 (Ridge) adds weights² penalty; Dropout randomly deactivates neurons.", hint:"Makes the model simpler to generalize better.", tags:["Machine Learning","Regularization"], difficulty:"medium", type:"definition" },
        { front:"What is cross-validation?", back:"A technique to evaluate model performance by splitting data into k folds, training on k-1 folds and testing on the remaining fold, repeated k times. Reduces bias in performance estimation.", hint:"k-fold cross-validation is most common.", tags:["Machine Learning","Evaluation"], difficulty:"medium", type:"definition" },
        { front:"What is the difference between precision and recall?", back:"Precision = TP/(TP+FP): of predicted positives, how many are correct. Recall = TP/(TP+FN): of actual positives, how many were found. F1 score balances both.", hint:"Precision: quality of predictions; Recall: coverage.", tags:["Machine Learning","Evaluation"], difficulty:"medium", type:"concept" },
        { front:"What is a convolutional neural network (CNN)?", back:"A deep learning architecture designed for grid-like data (images). Uses convolutional layers to automatically learn spatial features (edges, textures, shapes).", hint:"State-of-the-art for image recognition tasks.", tags:["Machine Learning","Deep Learning"], difficulty:"hard", type:"definition" }
      ],
      quiz: [
        { type:"mcq", question:"Which type of learning uses labeled training data?", options:{A:"Unsupervised learning",B:"Reinforcement learning",C:"Supervised learning",D:"Self-supervised learning"}, answer:"C", explanation:"Supervised learning trains models on input-output pairs where the correct labels are provided, learning to map inputs to outputs.", difficulty:"easy", tags:["Machine Learning"] },
        { type:"mcq", question:"What does 'overfitting' mean in machine learning?", options:{A:"The model is too simple",B:"The model performs well on training data but poorly on new data",C:"The model has too few parameters",D:"The training data is too small"}, answer:"B", explanation:"Overfitting occurs when a model learns the training data's noise and patterns so specifically that it fails to generalize to new, unseen examples.", difficulty:"easy", tags:["Machine Learning"] },
        { type:"true_false", statement:"A higher learning rate always leads to faster and better convergence in gradient descent.", answer:false, explanation:"Too high a learning rate can cause gradient descent to overshoot the minimum and diverge. An optimal learning rate (often found via tuning) is needed for stable convergence.", difficulty:"medium", tags:["Machine Learning"] },
        { type:"fill_blank", question:"The algorithm used to train neural networks by computing gradients layer by layer is called ___.", answer:"backpropagation", acceptable_answers:["backpropagation","back propagation","backprop"], explanation:"Backpropagation applies the chain rule to compute gradients of the loss with respect to each weight, enabling gradient descent to update the network.", difficulty:"medium", tags:["Machine Learning"] },
        { type:"mcq", question:"Which metric balances precision and recall into a single score?", options:{A:"Accuracy",B:"ROC-AUC",C:"F1 score",D:"Mean Squared Error"}, answer:"C", explanation:"The F1 score is the harmonic mean of precision and recall: F1 = 2*(P*R)/(P+R). It's especially useful for imbalanced datasets.", difficulty:"medium", tags:["Machine Learning"] },
        { type:"short_answer", question:"Explain the bias-variance tradeoff and how it relates to model complexity.", model_answer:"Bias measures how far predictions are from correct values (underfitting with simple models). Variance measures sensitivity to training data fluctuations (overfitting with complex models). As model complexity increases, bias decreases but variance increases. The goal is to find the complexity level that minimizes total error (bias² + variance).", key_points:["Bias = underfitting","Variance = overfitting","Tradeoff with model complexity"], difficulty:"hard", tags:["Machine Learning"] }
      ]
    },

    /* ============ SQL ============ */
    sql: {
      keywords: ['sql','database','query','join','index','transaction','normalization','select','table','primary key','foreign key','relational'],
      flashcards: [
        { front:"What is SQL?", back:"Structured Query Language — a standard language for managing and querying relational databases. Supports DDL (schema), DML (data), DCL (permissions), and TCL (transactions).", hint:"The language of relational databases.", tags:["SQL","Basics"], difficulty:"easy", type:"definition" },
        { front:"What is the difference between INNER JOIN and LEFT JOIN?", back:"INNER JOIN: returns only rows with matching values in both tables. LEFT JOIN: returns all rows from the left table plus matched rows from the right (NULLs for no match).", hint:"LEFT JOIN keeps all left-table rows regardless.", tags:["SQL","Joins"], difficulty:"medium", type:"concept" },
        { front:"What is database normalization?", back:"The process of organizing a database to reduce redundancy and improve integrity. Normal forms: 1NF (atomic values), 2NF (no partial dependency), 3NF (no transitive dependency).", hint:"Goal: eliminate redundancy.", tags:["SQL","Design"], difficulty:"medium", type:"definition" },
        { front:"What is a primary key?", back:"A column (or combination of columns) that uniquely identifies each row in a table. Must be unique and NOT NULL.", hint:"Every table should have one.", tags:["SQL","Keys"], difficulty:"easy", type:"definition" },
        { front:"What is a foreign key?", back:"A column that references the primary key of another table, establishing a relationship between tables and enforcing referential integrity.", hint:"Links two tables together.", tags:["SQL","Keys"], difficulty:"easy", type:"definition" },
        { front:"What is an index in SQL?", back:"A database object that speeds up data retrieval by creating a sorted pointer structure. Speeds up SELECT queries but slows INSERT/UPDATE/DELETE.", hint:"Like a book's index — faster lookup, more maintenance.", tags:["SQL","Performance"], difficulty:"medium", type:"definition" },
        { front:"What is the difference between WHERE and HAVING?", back:"WHERE filters rows before grouping (applied to individual rows). HAVING filters groups after GROUP BY is applied (applied to aggregated results).", hint:"HAVING is used with GROUP BY.", tags:["SQL","Filtering"], difficulty:"medium", type:"concept" },
        { front:"What does ACID stand for in databases?", back:"Atomicity, Consistency, Isolation, Durability — properties that guarantee reliable database transactions.", hint:"Four properties of reliable transactions.", tags:["SQL","Transactions"], difficulty:"medium", type:"recall" },
        { front:"What is a subquery in SQL?", back:"A query nested inside another query, used in WHERE, FROM, or SELECT clauses to provide a derived result. Can be correlated (references outer query) or non-correlated.", hint:"Query within a query.", tags:["SQL","Advanced"], difficulty:"medium", type:"definition" },
        { front:"What is the difference between UNION and UNION ALL?", back:"UNION combines results of two queries and removes duplicates. UNION ALL returns all rows including duplicates. UNION ALL is faster as it skips the deduplication step.", hint:"ALL keeps everything including duplicates.", tags:["SQL","Set Operations"], difficulty:"medium", type:"concept" }
      ],
      quiz: [
        { type:"mcq", question:"Which SQL clause is used to filter rows after aggregation?", options:{A:"WHERE",B:"GROUP BY",C:"HAVING",D:"ORDER BY"}, answer:"C", explanation:"HAVING filters groups after GROUP BY aggregation. WHERE filters individual rows before grouping.", difficulty:"medium", tags:["SQL"] },
        { type:"mcq", question:"What does a LEFT JOIN return?", options:{A:"Only matching rows from both tables","B":"All rows from the right table and matched rows from the left","C":"All rows from the left table and matched rows from the right","D":"Only non-matching rows"}, answer:"C", explanation:"LEFT JOIN returns all rows from the left table, with NULL values in right-table columns where no match exists.", difficulty:"medium", tags:["SQL"] },
        { type:"fill_blank", question:"The SQL property ensuring a transaction is treated as a single unit (all or nothing) is called ___.", answer:"Atomicity", acceptable_answers:["Atomicity","atomicity"], explanation:"Atomicity (the 'A' in ACID) ensures a transaction either completes entirely or is rolled back completely, with no partial updates.", difficulty:"medium", tags:["SQL"] },
        { type:"true_false", statement:"Adding an index always improves database performance for all operations.", answer:false, explanation:"Indexes speed up SELECT queries but add overhead to INSERT, UPDATE, and DELETE operations because the index must be maintained. They also consume additional storage.", difficulty:"medium", tags:["SQL"] },
        { type:"mcq", question:"Which normal form requires that all non-key attributes are fully dependent on the entire primary key?", options:{A:"1NF",B:"2NF",C:"3NF",D:"BCNF"}, answer:"B", explanation:"2NF eliminates partial dependencies — all non-key attributes must depend on the entire composite primary key, not just part of it.", difficulty:"hard", tags:["SQL"] },
        { type:"matching", instruction:"Match each SQL keyword to its purpose.", pairs:[{term:"SELECT",match:"Retrieve data"},{term:"INSERT",match:"Add new rows"},{term:"DELETE",match:"Remove rows"},{term:"UPDATE",match:"Modify existing rows"}], difficulty:"easy", tags:["SQL"] }
      ]
    }

  }; // end KB

  /* ──────────────────────────────────────────────
     HELPERS
  ────────────────────────────────────────────── */

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function sample(arr, n) {
    return shuffle(arr).slice(0, Math.min(n, arr.length));
  }

  /** Distribute items by difficulty: 40% easy, 40% medium, 20% hard */
  function balanceDifficulty(items, count) {
    const easy   = items.filter(i => i.difficulty === 'easy');
    const medium = items.filter(i => i.difficulty === 'medium');
    const hard   = items.filter(i => i.difficulty === 'hard');
    const nEasy   = Math.round(count * 0.4);
    const nMedium = Math.round(count * 0.4);
    const nHard   = count - nEasy - nMedium;
    return shuffle([
      ...sample(easy,   nEasy),
      ...sample(medium, nMedium),
      ...sample(hard,   Math.max(0, nHard))
    ]).slice(0, count);
  }

  /** Match input to a knowledge-base topic */
  function matchTopic(input) {
    const lc = input.toLowerCase();
    // Direct key match
    for (const key of Object.keys(KB)) {
      if (lc.includes(key)) return key;
    }
    // Keyword match
    for (const [key, data] of Object.entries(KB)) {
      if (data.keywords.some(kw => lc.includes(kw))) return key;
    }
    return null;
  }

  /* ──────────────────────────────────────────────
     COMMAND PARSER
  ────────────────────────────────────────────── */
  function parseCommand(raw) {
    const input = raw.trim();
    const lc = input.toLowerCase();

    const result = {
      topic: input,
      mode: 'both',       // 'flashcards' | 'quiz' | 'both'
      count: 10,
      difficulty: null,   // null = balanced, or 'easy'|'medium'|'hard'
      level: 'intermediate',
      isImport: false,
      rawText: null,
    };

    // Import mode
    if (lc.startsWith('import:')) {
      result.isImport = true;
      result.rawText = input.slice(7).trim();
      return result;
    }

    // Mode detection
    if (lc.includes('quiz me on') || lc.includes('quiz on')) {
      result.mode = 'quiz';
      result.topic = input.replace(/quiz me on|quiz on/i, '').trim();
    } else if (lc.includes('flashcard') || lc.includes('make me') || lc.includes('make ')) {
      result.mode = 'flashcards';
      result.topic = input.replace(/make me \d+ flashcards? on|make \d+ flashcards? on|flashcards? on/i, '').trim();
    } else if (lc.includes('study set') || lc.includes('give me a study set')) {
      result.mode = 'both';
      result.topic = input.replace(/give me a study set on|study set on|study set/i, '').trim();
    }

    // Count extraction
    const countMatch = input.match(/\b(\d+)\b/);
    if (countMatch) result.count = Math.min(Math.max(parseInt(countMatch[1]), 3), 20);

    // Difficulty override
    if (lc.includes('hard mode') || lc.includes('hard only')) result.difficulty = 'hard';
    else if (lc.includes('easy mode') || lc.includes('easy only')) result.difficulty = 'easy';
    else if (lc.includes('medium only')) result.difficulty = 'medium';

    // Level
    if (lc.includes('beginner')) result.level = 'beginner';
    else if (lc.includes('advanced')) result.level = 'advanced';

    return result;
  }

  /* ──────────────────────────────────────────────
     TEMPLATE GENERATOR (fallback for unknown topics)
  ────────────────────────────────────────────── */
  function generateFromTemplate(topic, count, mode) {
    const topicTitle = topic.charAt(0).toUpperCase() + topic.slice(1);
    const difficulties = ['easy', 'easy', 'medium', 'medium', 'medium', 'hard', 'hard', 'easy', 'medium', 'hard'];

    const flashcards = [];
    const quizQuestions = [];

    const templateFC = [
      { front: `What is the definition of ${topicTitle}?`, back: `${topicTitle} is a key concept. Please generate flashcards from your own notes or pasted text using the "Import:" command for best results.`, type: 'definition' },
      { front: `What are the main components of ${topicTitle}?`, back: `The main components vary. Use "Import: [your notes]" to extract specific components from your material.`, type: 'concept' },
      { front: `How is ${topicTitle} applied in practice?`, back: `Applications of ${topicTitle} depend on context. Paste your notes with "Import: [text]" for tailored cards.`, type: 'application' },
      { front: `What are the key principles of ${topicTitle}?`, back: `Key principles of ${topicTitle} include its foundational elements, methods, and governing rules.`, type: 'concept' },
      { front: `What distinguishes ${topicTitle} from related concepts?`, back: `${topicTitle} is distinguished by unique characteristics that separate it from similar topics or fields.`, type: 'concept' },
      { front: `Who are the key contributors to ${topicTitle}?`, back: `${topicTitle} has been developed through contributions by researchers, theorists, and practitioners in the field.`, type: 'recall' },
      { front: `What problems does ${topicTitle} solve?`, back: `${topicTitle} addresses specific challenges and provides structured approaches or solutions.`, type: 'application' },
      { front: `What are common misconceptions about ${topicTitle}?`, back: `A common misconception is oversimplifying ${topicTitle} — it encompasses nuanced concepts that require careful study.`, type: 'concept' },
      { front: `How has ${topicTitle} evolved over time?`, back: `${topicTitle} has developed through historical stages, influenced by research, technology, and changing needs.`, type: 'concept' },
      { front: `What is a real-world example of ${topicTitle}?`, back: `Real-world applications of ${topicTitle} can be seen across industries, demonstrating its practical significance.`, type: 'application' },
    ];

    const templateQuiz = [
      { type: 'mcq', question: `Which of the following best describes ${topicTitle}?`, options: { A: `A core concept with defined principles`, B: `An unrelated historical event`, C: `A mathematical formula only`, D: `A purely abstract idea with no applications` }, answer: 'A', explanation: `${topicTitle} is best understood as a core concept with defined principles and practical applications.`, difficulty: 'easy' },
      { type: 'true_false', statement: `${topicTitle} is a well-established field with defined methodologies.`, answer: true, explanation: `${topicTitle} has established frameworks, methodologies, and a body of knowledge.`, difficulty: 'easy' },
      { type: 'fill_blank', question: `The study of ${topicTitle} involves understanding its core ___ and applications.`, answer: 'principles', acceptable_answers: ['principles', 'concepts', 'fundamentals'], explanation: `${topicTitle} is grounded in core principles that guide its understanding and application.`, difficulty: 'easy' },
      { type: 'short_answer', question: `Briefly explain the main importance of ${topicTitle}.`, model_answer: `${topicTitle} is important because it provides a structured framework for understanding and solving specific problems in its domain, with broad applications across related fields.`, key_points: ['Structured framework', 'Problem-solving approach', 'Broad applications'], difficulty: 'medium' },
      { type: 'mcq', question: `What approach is most effective when studying ${topicTitle}?`, options: { A: 'Memorizing facts only', B: 'Understanding principles and practicing application', C: 'Reading once and moving on', D: 'Focusing only on advanced topics' }, answer: 'B', explanation: 'Effective learning of any topic requires understanding foundational principles and applying them through practice.', difficulty: 'easy' },
    ];

    const fcPool = templateFC.map((t, i) => ({
      id: i + 1,
      front: t.front,
      back: t.back,
      hint: `Think about what makes ${topicTitle} unique.`,
      tags: [topicTitle],
      difficulty: difficulties[i % difficulties.length],
      type: t.type
    }));

    const qPool = templateQuiz.map((t, i) => ({
      id: i + 1,
      ...t,
      tags: [topicTitle]
    }));

    return {
      flashcards: mode !== 'quiz' ? sample(fcPool, count).map((c, i) => ({ ...c, id: i + 1 })) : [],
      quiz: mode !== 'flashcards' ? {
        title: `${topicTitle} Quiz`,
        topic: topicTitle,
        total: Math.min(count, qPool.length),
        questions: sample(qPool, count).map((q, i) => ({ ...q, id: i + 1 }))
      } : null
    };
  }

  /* ──────────────────────────────────────────────
     IMPORT FROM TEXT (basic concept extraction)
  ────────────────────────────────────────────── */
  function importFromText(text, count = 10) {
    // Split into sentences
    const sentences = text
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 20 && s.split(' ').length > 4);

    const flashcards = [];
    const quiz = [];

    sentences.slice(0, count * 2).forEach((sentence, i) => {
      // Extract key term (first capitalized noun or significant phrase)
      const words = sentence.split(' ');
      const keyTerm = words.find(w => /^[A-Z]/.test(w) && w.length > 3) || words[0];

      // Create definition-style flashcard
      if (flashcards.length < count) {
        flashcards.push({
          id: flashcards.length + 1,
          front: `What does this statement describe: "${keyTerm}..."?`,
          back: sentence,
          hint: `Relates to: ${keyTerm}`,
          tags: ['Imported Content'],
          difficulty: ['easy', 'medium', 'hard'][i % 3],
          type: 'recall'
        });
      }

      // Create fill-in-blank quiz question
      if (quiz.length < count && words.length > 6) {
        const blankIdx = Math.floor(words.length * 0.6);
        const answer = words[blankIdx];
        if (answer && answer.length > 3) {
          const questionText = words.map((w, wi) => wi === blankIdx ? '___' : w).join(' ');
          quiz.push({
            id: quiz.length + 1,
            type: 'fill_blank',
            question: questionText + '.',
            answer: answer.replace(/[^a-zA-Z0-9]/g, ''),
            acceptable_answers: [answer.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()],
            explanation: `Original: "${sentence}"`,
            difficulty: ['easy', 'medium', 'hard'][i % 3],
            tags: ['Imported Content']
          });
        }
      }
    });

    return {
      topic: 'Imported Content',
      flashcards,
      quiz: {
        title: 'Imported Content Quiz',
        topic: 'Imported Content',
        total: quiz.length,
        questions: quiz
      }
    };
  }

  /* ──────────────────────────────────────────────
     MAIN GENERATE FUNCTION
  ────────────────────────────────────────────── */
  function generate(config) {
    const { topic, mode, count, difficulty } = config;

    // Import mode
    if (config.isImport && config.rawText) {
      return { ...importFromText(config.rawText, count), id: uid() };
    }

    const topicKey = matchTopic(topic);

    if (!topicKey) {
      const result = generateFromTemplate(topic, count, mode);
      return { ...result, topic, id: uid() };
    }

    const data = KB[topicKey];
    const topicLabel = topicKey.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    // Flashcards
    let fcs = [];
    if (mode !== 'quiz') {
      let pool = [...data.flashcards];
      if (difficulty) {
        pool = pool.filter(c => c.difficulty === difficulty);
        fcs = sample(pool, count);
      } else {
        fcs = balanceDifficulty(pool, count);
      }
      fcs = fcs.slice(0, count).map((c, i) => ({ ...c, id: i + 1 }));
    }

    // Quiz
    let quizObj = null;
    if (mode !== 'flashcards') {
      let pool = [...data.quiz];
      if (difficulty) pool = pool.filter(q => q.difficulty === difficulty);
      const questions = sample(pool, count).slice(0, count).map((q, i) => ({ ...q, id: i + 1 }));
      quizObj = {
        title: `${topicLabel} Quiz`,
        topic: topicLabel,
        total: questions.length,
        questions
      };
    }

    return { id: uid(), topic: topicLabel, flashcards: fcs, quiz: quizObj };
  }

  /* ──────────────────────────────────────────────
     PUBLIC API
  ────────────────────────────────────────────── */
  return {
    generate,
    parseCommand,
    importFromText,
    matchTopic,
    shuffle,
    TOPICS: Object.keys(KB).map(k => k.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))
  };

})();
