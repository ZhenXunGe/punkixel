export interface Alien {
  sprite: string;
  alienId: number;
  name: string;
  status: "run" | "dizzle";
  pos: number;
  dizzle: number;
  speed: number;
  drop: Array<string>;
  favourate: string;
}

function capFirst(name:string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function getRandomInt(min:number, max:number) {
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
    alienId: Math.ceil(Math.random()*10000),
    name: generateName(),
    status: "run",
    pos: 0,
    dizzle: 0,
    drop: ["#dye10"],
    speed: getRandomInt(20, 50),
    favourate: "night view",
  }
}
