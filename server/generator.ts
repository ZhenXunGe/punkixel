import { Minion, BulletModifier, Alien, MinionType, InstanceInfo, Player } from "./types";
import { individualWidth, individualHeight } from "./types";
import { dye_table, toPaletteIndex } from "./palette";

const content_size = individualWidth * individualHeight;

function capFirst(name:string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function getRandomInt(min:number, max:number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateName(){
  var name1 = ["abandoned","able","absolute","adorable","adventurous","academic","acceptable","acclaimed","accomplished",
    "accurate","aching","acidic","acrobatic","active","actual","adept","admirable","admired","adolescent","adorable",
    "adored","advanced","afraid","affectionate","aged","aggravating","aggressive","agile","agitated","agonizing","agreeable",
    "ajar","alarmed","alarming","alert","alienated","alive","all","altruistic","amazing","ambitious","ample","amused","amusing",
    "anchored","ancient","angelic","angry","anguished","animated","annual","another","antique","anxious","any","apprehensive",
    "appropriate","apt","arctic","arid","aromatic","artistic","ashamed","assured","astonishing","athletic","attached","attentive",
    "attractive","austere","authentic","authorized","automatic","avaricious","average","aware","awesome","awful","awkward","babyish",
    "bad","back","baggy","bare","barren","basic","beautiful","belated","beloved","beneficial","better","best","bewitched","big",
    "big-hearted","biodegradable","bite-sized","bitter","black","black-and-white","bland","blank","blaring","bleak","blind","blissful",
    "blond","blue","blushing","bogus","boiling","bold","bony","boring","bossy","both","bouncy","bountiful","bowed","brave","breakable",
    "brief","bright","brilliant","brisk","broken","bronze","brown","bruised","bubbly","bulky","bumpy","buoyant","burdensome","burly",
    "bustling","busy","buttery","buzzing","calculating","calm","candid","canine","capital","carefree","careful","careless","caring",
    "cautious","cavernous","celebrated","charming","cheap","cheerful","cheery","chief","chilly","chubby","circular","classic","clean",
    "clear","clear-cut","clever","close","closed","cloudy","clueless","clumsy","cluttered","coarse","cold","colorful","colorless",
    "colossal","comfortable","common","compassionate","competent","complete","complex","complicated","composed","concerned","concrete",
    "confused","conscious","considerate","constant","content","conventional","cooked","cool","cooperative","coordinated","corny",
    "corrupt","costly","courageous","courteous","crafty","crazy","creamy","creative","creepy","criminal","crisp","critical","crooked",
    "crowded","cruel","crushing","cuddly","cultivated","cultured","cumbersome","curly","curvy","cute","cylindrical","damaged","damp",
    "dangerous","dapper","daring","darling","dark","dazzling","dead","deadly","deafening","dear","dearest","decent","decimal","decisive",
    "deep","defenseless","defensive","defiant","deficient","definite","definitive","delayed","delectable","delicious","delightful",
    "delirious","demanding","dense","dental","dependable","dependent","descriptive","deserted","detailed","determined","devoted",
    "different","difficult","digital","diligent","dim","dimpled","dimwitted","direct","disastrous","discrete","disfigured","disgusting",
    "disloyal","dismal","distant","downright","dreary","dirty","disguised","dishonest","dismal","distant","distinct","distorted","dizzy",
    "dopey","doting","double","downright","drab","drafty","dramatic","dreary","droopy","dry","dual","dull","dutiful","each","eager",
    "earnest","early","easy","easy-going","ecstatic","edible","educated","elaborate","elastic","elated","elderly","electric","elegant",
    "elementary","elliptical","embarrassed","embellished","eminent","emotional","empty","enchanted","enchanting","energetic","enlightened",
    "enormous","enraged","entire","envious","equal","equatorial","essential","esteemed","ethical","euphoric","even","evergreen","everlasting",
    "every","evil","exalted","excellent","exemplary","exhausted","excitable","excited","exciting","exotic","expensive","experienced","expert",
    "extraneous","extroverted","extra-large","extra-small","fabulous","failing","faint","fair","faithful","fake","false","familiar","famous",
    "fancy","fantastic","far","faraway","far-flung","far-off","fast","fat","fatal","fatherly","favorable","favorite","fearful","fearless",
    "feisty","feline","female","feminine","few","fickle","filthy","fine","finished","firm","first","firsthand","fitting","fixed","flaky",
    "flamboyant","flashy","flat","flawed","flawless","flickering","flimsy","flippant","flowery","fluffy","fluid","flustered","focused",
    "fond","foolhardy","foolish","forceful","forked","formal","forsaken","forthright","fortunate","fragrant","frail","frank","frayed",
    "free","French","fresh","frequent","friendly","frightened","frightening","frigid","frilly","frizzy","frivolous","front","frosty",
    "frozen","frugal","fruitful","full","fumbling","functional","funny","fussy","fuzzy","gargantuan","gaseous","general","generous",
    "gentle","genuine","giant","giddy","gigantic","gifted","giving","glamorous","glaring","glass","gleaming","gleeful","glistening",
    "glittering","gloomy","glorious","glossy","glum","golden","good","good-natured","gorgeous","graceful","gracious","grand",
    "grandiose","granular","grateful","grave","gray","great","greedy","green","gregarious","grim","grimy","gripping","grizzled"
    ,"gross","grotesque","grouchy","grounded","growing","growling","grown","grubby","gruesome","grumpy","guilty","gullible",
    "gummy","hairy","half","handmade","handsome","handy","happy","happy-go-lucky","hard","hard-to-find","harmful","harmless",
    ];

var name2 = ["Gruo","Bro","Stood","Abel","Glor","Dgo"];

var name = capFirst(name1[getRandomInt(0, name1.length)]) + ' ' + capFirst(name2[getRandomInt(0, name2.length)]);
return name;

}

export function randomAlien():Alien {
  return {
    sprite: `monster-${Math.floor(Math.random()*3)}`,
    id: Math.ceil(Math.random()*10000).toString(),
    name: generateName(),
    status: "run",
    pos: 0,
    dizzle: 0,
    drop: ["#dye10"],
    knockDamage: getRandomInt(200, 1000),
    speed: getRandomInt(20, 50),
    favourate: "night view",
  }
}

const majorModifiers: Array<BulletModifier> = ["missle", "bomb", "bullet"];
const minorModifiers: Array<BulletModifier> = ["freeze", "explode"];
const minionTypeList:MinionType[] = ["ufo", "airballoon", "land"];


function randomInRange(from:number, to:number) {
  return from + Math.floor(Math.random()*(to - from));
}

function generateRandomPos(t: MinionType) {
  if(t==="ufo") {
    return [randomInRange(0,900), 400 - randomInRange(300,350)];
  } else if (t==="land") {
    return [randomInRange(0,900), 400 - 70];
  } else if (t==="airballoon") {
    return [randomInRange(0,900), 400 - randomInRange(200,300)];
  } else {
    return [0,0];
  }
}

function randomModifier(t:MinionType): Array<BulletModifier> {
  let minorModifier = minorModifiers[Math.floor(Math.random()*2)];
  if(t==="ufo") {
    return [majorModifiers[0], minorModifier];
  } else if (t==="airballoon") {
    return [majorModifiers[1], minorModifier];
  } else if (t==="land") {
    return [majorModifiers[2], minorModifier];
  }
  return [];
}

export function createMinion(owner:string): Minion {
  let minionType = minionTypeList[Math.floor(Math.random()*3)];
  let id = "minion-" + Math.ceil(Math.random() * 100000);
  let frequency = Math.ceil(Math.random()*30 + 5);
  let power = Math.ceil(Math.random()*5 + 5);
  let pos = generateRandomPos(minionType);
  let m = {
      x:pos[0],
      y:pos[1],
      frequency:frequency,
      power:power,
      location:null,
      id:id,
      owner:owner,
      modifier: randomModifier(minionType),
      contribution:0,
      style: Math.floor(Math.random()*4),
      type: minionType//minionTypeList[Math.floor(Math.random()*3)]
    };
  return m;
}

export function resetMinion(minion: Minion): Minion {
  minion.type = minionTypeList[Math.floor(Math.random()*3)];
  minion.frequency = Math.ceil(Math.random()*30 + 5);
  let pos = generateRandomPos(minion.type);
  minion.power = Math.ceil(Math.random()*5 + 5);
  minion.modifier = randomModifier(minion.type);
  minion.contribution = 0;
  minion.x = pos[0],
  minion.y = pos[1],
  minion.style = Math.floor(Math.random()*4);
  return minion;
}


export function createInstance(owner: string): InstanceInfo{
  let content = [
    new Array(individualHeight * individualWidth),
    new Array(individualHeight * individualWidth),
    new Array(individualHeight * individualWidth)
  ];
  for (var i=0; i<content_size; i++) {
      content[0][i] = 0;
      content[1][i] = 0;
      content[2][i] = 0;
  }
  let instance = {
    content: content,
    minions: [],
    drops:[],
    index:-1,
    ratio:0.4,
    owner: owner,
    background: 0,
    pph: 0,
    reward: 0,
    basePPH: 0,
    sketched: false,
  };
  return instance;
}

export function newPlayer(id: string, index:number): Player {
  let player = {
    id: id,
    energy: 50,
    punkxiel: 10000,
    ranking: 99,
    pph: 0,
    total: 0,
    palettes: [{
      name: "basic",
      palettes: [0x10,0x11,0x12,0x13,0x14,0x15,0x16,0x17,0x18,0x19,0x1a,0x1b, 0x1c, 0x1d, 0x1e],
    },
    {
      name: "spin",
      palettes: [0x20]
    },
    {
      name: "dilation",
      palettes: [0x30],
    }
    ],
    inventory: [null, null, null, null, null],
    homeIndex: index,
  };
  return player;
}

export function randomPalette() {
  let dtable = dye_table;
  let category = getRandomInt(1, dye_table.length);
  let index = getRandomInt(0, dtable[category].length);
  return [category, index];
}

export function installPalette(player: Player, cidx:number, pidx: number) {
  let p = toPaletteIndex(cidx, pidx);
  // Recall player.palettes[k] points to category (k+1)
  if (p in player.palettes[cidx-1].palettes) {
    return;
  } else {
    player.palettes[cidx-1].palettes.push(p);
  }
}
