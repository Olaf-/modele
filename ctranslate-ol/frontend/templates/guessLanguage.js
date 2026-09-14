/*   Guess the natural language of a text
 *   Copyright (c) 2012-2014, Rich Tibbett
 *   http://github.com/richtr/guessLanguage.js/
 *
 *   Original Python package:
 *   Copyright (c) 2008, Kent S Johnson
 *   http://code.google.com/p/guess-language/
 *
 *   Original C++ version for KDE:
 *   Copyright (c) 2006 Jacob R Rideout <kde@jacobrideout.net>
 *   http://websvn.kde.org/branches/work/sonnet-refactoring/common/nlp/guesslanguage.cpp?view=markup
 *
 *   Original Language::Guess Perl module:
 *   Copyright (c) 2004-2006 Maciej Ceglowski
 *   http://web.archive.org/web/20090228163219/http://languid.cantbedone.org/
 *
 *   Note: Language::Guess is GPL-licensed. KDE developers received permission
 *   from the author to distribute their port under LGPL:
 *   http://lists.kde.org/?l=kde-sonnet&m=116910092228811&w=2
 *
 *   This program is free software: you can redistribute it and/or modify it
 *   under the terms of the GNU Lesser General Public License as published
 *   by the Free Software Foundation, either version 3 of the License,
 *   or (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty
 *   of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *   See the GNU Lesser General Public License for more details.
 *
 *   You should have received a copy of the GNU Lesser General Public License
 *   along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 *   Modified for Upper+Lower Sorbian by Olaf Langner
 */

(function(global, undefined) {

  var guessLanguage = function() {

    var models = {
      "hsb":"je  nanje wo ješe  pona  za a  doso ej  so nj přdźe z  mae wto ać ch a wach toešeja  jae sa sa nom o we nhu a p w chu pr ststa seho za rjeka e pdo  dźym o npřee zo p wumaćo sowany ehole jenwjeašeow nanak a z ka bě taa twotmi e d byki  chprajejo zpřia d haće  koaj  wóa jźe ón dźěo jjano dli  ni tyješła ejece a mtaja ko tzo u we t paju la  dae me jrajmu  zoanka ham mjean udź wj něštowo ku iche hta  wšenjdźiał jacseje kjem teim u p štpo  hi hdychbjejedmy i wwónu z swić ni o btymo mzasne  rěhdycy nowda u njehdy a bu sdomjezsu skey wwon zei s ra bu měy saće sutej ho dym waleyž rěčemuko e ai pdyromawoj kuskii nchco ka ai znjama  rutomo h noyrbm pu dby dyž root radze olajebke ćere bj wbudez  lěarało až  k  wěbě erb syaneasoědźwědwobe rowey nwjakažěšepolty ož otoišćež šćesernu i dj pamitratakšo y zwa jo  sł hóec wołkowanj kr sp lunimnk  šey dada drajiy pač adźwe tarhačchom dostm srbj mjj sći  li",
      "dsb":"jo je  jo a nje na sena ej  wó pśch  zase e w doju skeowa w  pó toa w wuo wo sto a ski ow  tewjego  nje som ke stane su li  wo z pśi stjejka a p supśeaž e prjea n jaja o pa jny a tko za ache z měwót ma wjo nskie ale  roo ja aejeenj tae n byaś a kerbu wa ztar móła serychkejwe egoo tnejwójjenak  sw ažogoanjam a dichnja zeku akomi  akdo em  gru s we poo zalio mło rbse mbsk ku dri wa mwobjeli sstoe tmy mjekowgrota śi  góo bwanteke drowe k kóo awa  kaał ma njo wěoweno e jo diski aosću pwóno ky snow wš kry w pa rě lětakpódekearj prńsk ně daym swóalerozze stwm w sotow źi cenosamironla u au nbył lu spownadncy by im ce  ch de ab gaći ajuu zlědteji pniktoma gele ca korěd słen ót jad bu nijow nonu y aa rwjaj wchonicinaujo k  ra coa bpjete jomty e ršćiowyłowo gjanm siste gž smu elirěcskaśed mj tyi niś ejuikani ědny pěstlět źěu t alsomźiśnjuótaomaón u k muwšy nenama cměswarkraejoś až ji z sacaslicw p",
      "cs":" pr poní pro nana  přch  je neže  že se do ro st v  vepřese ho sta to vy zaou  a to  byla ce e vistle podí p vle ne sje ké by em ých odovaředdy eníkonli ně str záve  ka sve pit ládohorovroztervláím  kohodnispříský mi ob soa palibudednickkteku o sal ci e til ny né odlovárotsouání bu mo o astbylde ek ost mí taes jedky lasm pnesnímranremrosého de kt ni si výat jí ký mi pretaktany vřek ch li ná pa ředa dlednei pi vly mino no vpoltravalvnííchý přej ce kd lea sa zcene kedseklemikl latlo miénovpraskuskéstitavti ty vánvé y ny sí sí vě p dn ně sp čsa na tak dnídohe be mejnenaestinim znalnouná oviovéovýrskstátí třetů udeza é pém í d ir zvaleaněaveckédene zechen erýhlai siérlovmu nebnico bo mpadpotravroprý sedsi t ptictu tě u pu vvá výšzvýčníří ům  bl br ho ja re s  z  zda vaniatoblabriečneřeh vi nie ilairsitekovnoso oo poceodyohloliovoplapočprára ritrodry sd skossdtelu svatveřvitvlay pálnčssšen al",
      "de":"en er  dederie  didiescheincheichdenin te ch  eiungn dnd  beveres  zueitgenund un au inchtit ten daent veand geine mir dhenng nde voe dbermenei mit stterrent d ereren sste see sht desistne aufe aiscon rte re wegesuch fü sobeie enenr sachfürierparür  haas ert an pa sa sp wifortagzu dasreihe hrentesenvor scechetzheilann apd st staeselic ab sigte waitikein engeseitrazen im laartim llen wrderecsetstrteitte nie peheersg dnicvon al pran auserfr etzetüruf ag alsar chsendge igeionls n mngsnisnt ords ssse tüahle bedeem lenn iormprorkeruns dwahwerürk meageattellesthatn bollrafs atsc es fo gr jaabeaucbene negelien ur vre ritsag amagtahrbrade erdheritele n pn vor rbert sicwieübe is übchachie fe meriiedmmenerr astit at stis koarbds gann zr fr wranse t iweiwir br npam besd ddeue ge kefoet eutfenhselten rnpdr brhet wtz  fr ih ke maameangd seilel eraerhh di dkann fn lntsochragrd spdsprtio ar en kaarkass",
      "en":" ththehe ed  to iner ingng  annd  ofandto of  coat on in  a d t hee tiones  rere hat sa st haherthatioor  ''en  whe sentn ts aas foris t t beld e ars  waut ve ll al  mae i fo's an est hi mo se prs tatest tereretednt verd a wise e cectns  only toley r t caatits all nohiss oerscone oearf te wwasonssta'' stin astot h weid th  itce  diaved hcouproad ollry d se m soillctite toreveg tit  ch dehavoulty ulduse alarech me outovewitys chit aithoth ab te wos srest wtine be hncet sy te pelehins inte lile  doaidheyne s w as fr trendsai el ne su't ay houivelecn't yebutd oo ty o ho mebe cale ehadple at bu lad bs hsayt i are fghthilighintnotren is pa shayscomn sr ariny a unn com thi miby d ie de nt o bye rerioldomewheyea grar itymplounoneow r ss ftat ba vobousamtimvotaboantds ialinemanmen or poampcandere llesny ot rectesthoicaildir ndeoseouspresteeraperr oredrie bo lealiarsorerics mstr faessie istlaturi",
      "pl":"ie nieem  ni po prdzi naże rzena łemwie w  żego  byprzowaię  do siowi pa zach egoał sięej wałym aniałeto  i  to tee p je z czybyłpanstakie jado  ch cz wiiała ppow mili enizie ta wało ać dy ak e w a  od stniarzyied ktodzcieczeia ielktóo ptórści sp wyjaktakzy  moałęproskitemłęs tre mjesmy  roedzeliiej rza nalean e sestle o si pki  coadaczne te zentny prerząy s ko o acham e no tolipodzia go kaby iegiernośrozspoychząd mnaczadzbiechomnio nostpraze ła  soa mczaiemić obiył yło mu móa tacjci e bichkanmi mieoścrowzenzyd al rea wdenedyił ko o wracśmy ma ra sz tye jiskji ka m sno o zrezwa ów łowść  obecheczezyi wja konmówne ni nownympolpotyde dl sya sakialidlaiczku oczst strszytrzwiay pza  wtchcesziecim la o msa waćy nzaczec gda zardco dare rienm nm wmiamożrawrdztantedtegwiłwtey zznazłoa rawibarcjicządoweż gdyiekje o dtałwalwszzedówięsa ba lu woalnarnba dzoe chodigiligm pmyśo conirelskustey wystz w"
    };
  
      var MAX_LENGTH = 4096;
      var MIN_LENGTH = 20;
      var MAX_GRAMS = 300;

      var NAME_MAP = {
        "hsb": "Upper Sorbian",
        "dsb": "Lower Sorbian",
        "ab": "Abkhazian",
        "af": "Afrikaans",
        "ar": "Arabic",
        "az": "Azeri",
        "be": "Belarusian",
        "bg": "Bulgarian",
        "bn": "Bengali",
        "bo": "Tibetan",
        "br": "Breton",
        "ca": "Catalan",
        "ceb": "Cebuano",
        "cs": "Czech",
        "cy": "Welsh",
        "da": "Danish",
        "de": "German",
        "el": "Greek",
        "en": "English",
        "eo": "Esperanto",
        "es": "Spanish",
        "et": "Estonian",
        "eu": "Basque",
        "fa": "Farsi",
        "fi": "Finnish",
        "fo": "Faroese",
        "fr": "French",
        "fy": "Frisian",
        "gd": "Scots Gaelic",
        "gl": "Galician",
        "gu": "Gujarati",
        "ha": "Hausa",
        "haw": "Hawaiian",
        "he": "Hebrew",
        "hi": "Hindi",
        "hmn": "Pahawh Hmong",
        "hr": "Croatian",
        "hu": "Hungarian",
        "hy": "Armenian",
        "id": "Indonesian",
        "is": "Icelandic",
        "it": "Italian",
        "ja": "Japanese",
        "ka": "Georgian",
        "kk": "Kazakh",
        "km": "Cambodian",
        "ko": "Korean",
        "ku": "Kurdish",
        "ky": "Kyrgyz",
        "la": "Latin",
        "lt": "Lithuanian",
        "lv": "Latvian",
        "mg": "Malagasy",
        "mk": "Macedonian",
        "ml": "Malayalam",
        "mn": "Mongolian",
        "mr": "Marathi",
        "ms": "Malay",
        "nd": "Ndebele",
        "ne": "Nepali",
        "nl": "Dutch",
        "nn": "Nynorsk",
        "no": "Norwegian",
        "nso": "Sepedi",
        "pa": "Punjabi",
        "pl": "Polish",
        "ps": "Pashto",
        "pt": "Portuguese",
        "pt-PT": "Portuguese (Portugal)",
        "pt-BR": "Portuguese (Brazil)",
        "ro": "Romanian",
        "ru": "Russian",
        "sa": "Sanskrit",
        "bs": "Serbo-Croatian",
        "sk": "Slovak",
        "sl": "Slovene",
        "so": "Somali",
        "sq": "Albanian",
        "sr": "Serbian",
        "sv": "Swedish",
        "sw": "Swahili",
        "ta": "Tamil",
        "te": "Telugu",
        "th": "Thai",
        "tl": "Tagalog",
        "tlh": "Klingon",
        "tn": "Setswana",
        "tr": "Turkish",
        "ts": "Tsonga",
        "tw": "Twi",
        "uk": "Ukrainian",
        "ur": "Urdu",
        "uz": "Uzbek",
        "ve": "Venda",
        "vi": "Vietnamese",
        "xh": "Xhosa",
        "zh": "Chinese",
        "zh-TW": "Traditional Chinese (Taiwan)",
        "zu": "Zulu"
      };

      var IANA_MAP = {
        "hsb": 0,
        "dsb": 0,
        "ab": 12026,
        "af": 40,
        "ar": 26020,
        "az": 26030,
        "be": 11890,
        "bg": 26050,
        "bn": 26040,
        "bo": 26601,
        "br": 1361,
        "ca": 3,
        "ceb": 26060,
        "cs": 26080,
        "cy": 26560,
        "da": 26090,
        "de": 26160,
        "el": 26165,
        "en": 26110,
        "eo": 11933,
        "es": 26460,
        "et": 26120,
        "eu": 1232,
        "fa": 26130,
        "fi": 26140,
        "fo": 11817,
        "fr": 26150,
        "fy": 1353,
        "gd": 65555,
        "gl": 1252,
        "gu": 26599,
        "ha": 26170,
        "haw": 26180,
        "he": 26592,
        "hi": 26190,
        "hr": 26070,
        "hu": 26200,
        "hy": 26597,
        "id": 26220,
        "is": 26210,
        "it": 26230,
        "ja": 26235,
        "ka": 26600,
        "kk": 26240,
        "km": 1222,
        "ko": 26255,
        "ku": 11815,
        "ky": 26260,
        "la": 26280,
        "lt": 26300,
        "lv": 26290,
        "mg": 1362,
        "mk": 26310,
        "ml": 26598,
        "mn": 26320,
        "mr": 1201,
        "ms": 1147,
        "ne": 26330,
        "nl": 26100,
        "nn": 172,
        "no": 26340,
        "pa": 65550,
        "pl": 26380,
        "ps": 26350,
        "pt": 26390,
        "ro": 26400,
        "ru": 26410,
        "sa": 1500,
        "bs": 1399,
        "sk": 26430,
        "sl": 26440,
        "so": 26450,
        "sq": 26010,
        "sr": 26420,
        "sv": 26480,
        "sw": 26470,
        "ta": 26595,
        "te": 26596,
        "th": 26594,
        "tl": 26490,
        "tlh": 26250,
        "tn": 65578,
        "tr": 26500,
        "tw": 1499,
        "uk": 26520,
        "ur": 26530,
        "uz": 26540,
        "vi": 26550,
        "zh": 26065,
        "zh-TW": 22
      };

      var SINGLETONS = [
        ["Armenian", "hy"],
        ["Hebrew", "he"],
        ["Bengali", "bn"],
        ["Gurmukhi", "pa"],
        ["Greek", "el"],
        ["Gujarati", "gu"],
        ["Oriya", "or"],
        ["Tamil", "ta"],
        ["Telugu", "te"],
        ["Kannada", "kn"],
        ["Malayalam", "ml"],
        ["Sinhala", "si"],
        ["Thai", "th"],
        ["Lao", "lo"],
        ["Tibetan", "bo"],
        ["Burmese", "my"],
        ["Georgian", "ka"],
        ["Mongolian", "mn"],
        ["Khmer", "km"],
        ["Pahawh Hmong", "hmn"]
      ];

      var UNKNOWN = 'unknown';

      var BASIC_LATIN = ["en", "ceb", "ha", "so", "tlh", "id", "haw", "la", "sw", "eu", "nr", "nso", "zu", "xh", "ss", "st", "tn", "ts"];
      var EXTENDED_LATIN = ["hsb", "dsb", "cs", "af", "pl", "hr", "ro", "sk", "sl", "tr", "hu", "az", "et", "sq", "ca", "es", "fr", "de", "nl", "it", "da", "is", "no", "sv", "fi", "lv", "pt", "ve", "lt", "tl", "cy", "vi"];
      var ALL_LATIN = BASIC_LATIN.concat(EXTENDED_LATIN);
      var CYRILLIC = ["ru", "uk", "kk", "uz", "mn", "sr", "mk", "bg", "ky"];
      var ARABIC = ["ar", "fa", "ps", "ur"];
      var DEVANAGARI = ["hi", "ne"];
      var PT = ["pt-BR", "pt-PT"];

      // Unicode char greedy regex block range matchers
      var unicodeBlockTests = {
        "Basic Latin": /[\u0000-\u007F]/g,
        "Latin-1 Supplement": /[\u0080-\u00FF]/g,
        "Latin Extended-A": /[\u0100-\u017F]/g,
        "Latin Extended-B": /[\u0180-\u024F]/g,
        "IPA Extensions": /[\u0250-\u02AF]/g,
        "Spacing Modifier Letters": /[\u02B0-\u02FF]/g,
        "Combining Diacritical Marks": /[\u0300-\u036F]/g,
        "Greek and Coptic": /[\u0370-\u03FF]/g,
        "Cyrillic": /[\u0400-\u04FF]/g,
        "Cyrillic Supplement": /[\u0500-\u052F]/g,
        "Armenian": /[\u0530-\u058F]/g,
        "Hebrew": /[\u0590-\u05FF]/g,
        "Arabic": /[\u0600-\u06FF]/g,
        "Syriac": /[\u0700-\u074F]/g,
        "Arabic Supplement": /[\u0750-\u077F]/g,
        "Thaana": /[\u0780-\u07BF]/g,
        "NKo": /[\u07C0-\u07FF]/g,
        "Devanagari": /[\u0900-\u097F]/g,
        "Bengali": /[\u0980-\u09FF]/g,
        "Gurmukhi": /[\u0A00-\u0A7F]/g,
        "Gujarati": /[\u0A80-\u0AFF]/g,
        "Oriya": /[\u0B00-\u0B7F]/g,
        "Tamil": /[\u0B80-\u0BFF]/g,
        "Telugu": /[\u0C00-\u0C7F]/g,
        "Kannada": /[\u0C80-\u0CFF]/g,
        "Malayalam": /[\u0D00-\u0D7F]/g,
        "Sinhala": /[\u0D80-\u0DFF]/g,
        "Thai": /[\u0E00-\u0E7F]/g,
        "Lao": /[\u0E80-\u0EFF]/g,
        "Tibetan": /[\u0F00-\u0FFF]/g,
        "Burmese": /[\u1000-\u109F]/g,
        "Georgian": /[\u10A0-\u10FF]/g,
        "Hangul Jamo": /[\u1100-\u11FF]/g,
        "Ethiopic": /[\u1200-\u137F]/g,
        "Ethiopic Supplement": /[\u1380-\u139F]/g,
        "Cherokee": /[\u13A0-\u13FF]/g,
        "Unified Canadian Aboriginal Syllabics": /[\u1400-\u167F]/g,
        "Ogham": /[\u1680-\u169F]/g,
        "Runic": /[\u16A0-\u16FF]/g,
        "Pahawh Hmong": /[\u16B0-\u16B8]/g,
        "Tagalog": /[\u1700-\u171F]/g,
        "Hanunoo": /[\u1720-\u173F]/g,
        "Buhid": /[\u1740-\u175F]/g,
        "Tagbanwa": /[\u1760-\u177F]/g,
        "Khmer": /[\u1780-\u17FF]/g,
        "Mongolian": /[\u1800-\u18AF]/g,
        "Limbu": /[\u1900-\u194F]/g,
        "Tai Le": /[\u1950-\u197F]/g,
        "New Tai Lue": /[\u1980-\u19DF]/g,
        "Khmer Symbols": /[\u19E0-\u19FF]/g,
        "Buginese": /[\u1A00-\u1A1F]/g,
        "Balinese": /[\u1B00-\u1B7F]/g,
        "Phonetic Extensions": /[\u1D00-\u1D7F]/g,
        "Phonetic Extensions Supplement": /[\u1D80-\u1DBF]/g,
        "Combining Diacritical Marks Supplement": /[\u1DC0-\u1DFF]/g,
        "Latin Extended Additional": /[\u1E00-\u1EFF]/g,
        "Greek Extended": /[\u1F00-\u1FFF]/g,
        "General Punctuation": /[\u2000-\u206F]/g,
        "Superscripts and Subscripts": /[\u2070-\u209F]/g,
        "Currency Symbols": /[\u20A0-\u20CF]/g,
        "Combining Diacritical Marks for Symbols": /[\u20D0-\u20FF]/g,
        "Letterlike Symbols": /[\u2100-\u214F]/g,
        "Number Forms": /[\u2150-\u218F]/g,
        "Arrows": /[\u2190-\u21FF]/g,
        "Mathematical Operators": /[\u2200-\u22FF]/g,
        "Miscellaneous Technical": /[\u2300-\u23FF]/g,
        "Control Pictures": /[\u2400-\u243F]/g,
        "Optical Character Recognition": /[\u2440-\u245F]/g,
        "Enclosed Alphanumerics": /[\u2460-\u24FF]/g,
        "Box Drawing": /[\u2500-\u257F]/g,
        "Block Elements": /[\u2580-\u259F]/g,
        "Geometric Shapes": /[\u25A0-\u25FF]/g,
        "Miscellaneous Symbols": /[\u2600-\u26FF]/g,
        "Dingbats": /[\u2700-\u27BF]/g,
        "Miscellaneous Mathematical Symbols-A": /[\u27C0-\u27EF]/g,
        "Supplemental Arrows-A": /[\u27F0-\u27FF]/g,
        "Braille Patterns": /[\u2800-\u28FF]/g,
        "Supplemental Arrows-B": /[\u2900-\u297F]/g,
        "Miscellaneous Mathematical Symbols-B": /[\u2980-\u29FF]/g,
        "Supplemental Mathematical Operators": /[\u2A00-\u2AFF]/g,
        "Miscellaneous Symbols and Arrows": /[\u2B00-\u2BFF]/g,
        "Glagolitic": /[\u2C00-\u2C5F]/g,
        "Latin Extended-C": /[\u2C60-\u2C7F]/g,
        "Coptic": /[\u2C80-\u2CFF]/g,
        "Georgian Supplement": /[\u2D00-\u2D2F]/g,
        "Tifinagh": /[\u2D30-\u2D7F]/g,
        "Ethiopic Extended": /[\u2D80-\u2DDF]/g,
        "Supplemental Punctuation": /[\u2E00-\u2E7F]/g,
        "CJK Radicals Supplement": /[\u2E80-\u2EFF]/g,
        "KangXi Radicals": /[\u2F00-\u2FDF]/g,
        "Ideographic Description Characters": /[\u2FF0-\u2FFF]/g,
        "CJK Symbols and Punctuation": /[\u3000-\u303F]/g,
        "Hiragana": /[\u3040-\u309F]/g,
        "Katakana": /[\u30A0-\u30FF]/g,
        "Bopomofo": /[\u3100-\u312F]/g,
        "Hangul Compatibility Jamo": /[\u3130-\u318F]/g,
        "Kanbun": /[\u3190-\u319F]/g,
        "Bopomofo Extended": /[\u31A0-\u31BF]/g,
        "CJK Strokes": /[\u31C0-\u31EF]/g,
        "Katakana Phonetic Extensions": /[\u31F0-\u31FF]/g,
        "Enclosed CJK Letters and Months": /[\u3200-\u32FF]/g,
        "CJK Compatibility": /[\u3300-\u33FF]/g,
        "CJK Unified Ideographs Extension A": /[\u3400-\u4DBF]/g,
        "Yijing Hexagram Symbols": /[\u4DC0-\u4DFF]/g,
        "CJK Unified Ideographs": /[\u4E00-\u9FFF]/g,
        "Yi Syllables": /[\uA000-\uA48F]/g,
        "Yi Radicals": /[\uA490-\uA4CF]/g,
        "Modifier Tone Letters": /[\uA700-\uA71F]/g,
        "Latin Extended-D": /[\uA720-\uA7FF]/g,
        "Syloti Nagri": /[\uA800-\uA82F]/g,
        "Phags-pa": /[\uA840-\uA87F]/g,
        "Hangul Syllables": /[\uAC00-\uD7AF]/g,
        "High Surrogates": /[\uD800-\uDB7F]/g,
        "High Private Use Surrogates": /[\uDB80-\uDBFF]/g,
        "Low Surrogates": /[\uDC00-\uDFFF]/g,
        "Private Use Area": /[\uE000-\uF8FF]/g,
        "CJK Compatibility Ideographs": /[\uF900-\uFAFF]/g,
        "Alphabetic Presentation Forms": /[\uFB00-\uFB4F]/g,
        "Arabic Presentation Forms-A": /[\uFB50-\uFDFF]/g,
        "Variation Selectors": /[\uFE00-\uFE0F]/g,
        "Vertical Forms": /[\uFE10-\uFE1F]/g,
        "Combining Half Marks": /[\uFE20-\uFE2F]/g,
        "CJK Compatibility Forms": /[\uFE30-\uFE4F]/g,
        "Small Form Variants": /[\uFE50-\uFE6F]/g,
        "Arabic Presentation Forms-B": /[\uFE70-\uFEFF]/g,
        "Halfwidth and Fullwidth Forms": /[\uFF00-\uFFEF]/g,
        "Specials": /[\uFFF0-\uFFFF]/g
      };

      function findRuns(text) {

        var relevant_runs = {};

        for (var key in unicodeBlockTests) {

          // Count the number of characters in each character block.
          var charCount = text.match(unicodeBlockTests[key]);

          // return run types that used for 40% or more of the string
          // always return basic latin if found more than 15%
          // and extended additional latin if over 10% (for Vietnamese)
          var pct = (charCount ? charCount.length : 0) / text.length;

          relevant_runs[key] = pct;

        }

        return relevant_runs;
      }

      function identify(text, callback) {

        var scripts = findRuns(text);

        // Identify the language.
        if (scripts["Hangul Syllables"] + scripts["Hangul Jamo"] + scripts["Hangul Compatibility Jamo"] >= 0.4) {
          callback.apply(undefined, ["ko"]);
          return;
        }

        if (scripts["Greek and Coptic"] >= 0.4) {
          callback.apply(undefined, ["el"]);
          return;
        }

        if (scripts["Hiragana"] + scripts["Katakana"] + scripts["Katakana Phonetic Extensions"] >= 0.2) {
          callback.apply(undefined, ["ja"]);
          return;
        }

        if (scripts["CJK Unified Ideographs"] + scripts["Bopomofo"] + scripts["Bopomofo Extended"] + scripts["KangXi Radicals"] >= 0.4) {
          callback.apply(undefined, ["zh"]);
          return;
        }

        if (scripts["Cyrillic"] >= 0.4) {
          check(text, CYRILLIC, callback);
          return;
        }

        if (scripts["Arabic"] + scripts["Arabic Presentation Forms-A"] + scripts["Arabic Presentation Forms-B"] >= 0.4) {
          check(text, ARABIC, callback);
          return;
        }

        if (scripts["Devanagari"] >= 0.4) {
          check(text, DEVANAGARI, callback);
          return;
        }

        // Try languages with unique scripts
        for (var i = 0, l = SINGLETONS.length; i < l; i++) {
          if (scripts[SINGLETONS[i][0]] >= 0.4) {
            callback.apply(undefined, [SINGLETONS[i][1]]);
            return;
          }
        }

        // Extended Latin
        if (scripts["Latin-1 Supplement"] + scripts["Latin Extended-A"] + scripts["IPA Extensions"] >= 0.4) {
          check(text, EXTENDED_LATIN, function(latin_lang) {
            if (latin_lang == "pt") {
              check(text, PT, callback);
            } else {
              callback.apply(undefined, [latin_lang]);
            }
          });
          return;
        }

        if (scripts["Basic Latin"] >= 0.15) {
          check(text, ALL_LATIN, callback);
          return;
        }

        callback.apply(undefined, [UNKNOWN]);
      }

      function check(sample, langs, callback) {

        if (sample.length < MIN_LENGTH) {
          callback.apply(undefined, [UNKNOWN]);
          return;
        }

        var scores = {};
        var model = createOrderedModel(sample);
        for (var i = 0, l = langs.length; i < l; i++) {

          var lkey = langs[i].toLowerCase();

          var known_model = createKnownModel(lkey) || null;

          if (!known_model) {
            continue;
          }

          scores[lkey] = distance(model, known_model);

        }

        var scoresArr = [];
        for (var index in scores) {
          scoresArr.push([index, scores[index]]);
        }

        if (scoresArr.length == 0) {
          callback.apply(undefined, [UNKNOWN]);
          return;
        }

        // we want the lowest score, less distance = greater chance of match
        var sortedScores = scoresArr.sort(function(objA, objB) {
          return objA[1] - objB[1]; // sort low-to-high
        });

        // return the best match we've now calculated
        callback.apply(undefined, [sortedScores[0][0]]);
      }

      function createOrderedModel(content) {
        // Create a list of trigrams in content sorted by frequency.
        var trigrams = {},
            sortedTrigrams = [];
        var content = content.toLowerCase();

        var contentArr = content.split("");
        for (var i = 0, l = contentArr.length - 2; i < l; i++) {
          var trigramKey = contentArr[i] + contentArr[i + 1] + contentArr[i + 2] + "";
          if (!trigrams[trigramKey]) {
            trigrams[trigramKey] = 1;
          } else {
            trigrams[trigramKey] += 1;
          }
        }

        // convert object to array
        for (var i in trigrams) {
          sortedTrigrams[sortedTrigrams.length] = [i, trigrams[i]];
        }

        // sort array results
        return sortedTrigrams.sort(function(objA, objB) {
          return objB[1] - objA[1]; // sort high-to-low
        });
      }

      var knownModelCache = {};

      function createKnownModel(key) {
        // Check if known model has been pre-computed in cache
        if (knownModelCache[key]) {
          return knownModelCache[key];
        }

        var data = models[key];
        if (!data) {
          return {};
        }

        // Extract known trigram model data
        var dataArr = data.match(/([\s\S]{1,3})/g);
        // Contruct known trigram object based on provided raw data
        var known_model = {};
        for (var i = 0, l = dataArr.length; i < l; i++) {
          known_model[dataArr[i]] = i;
        }

        // Store in known model pre-computed cache
        knownModelCache[key] = known_model;

        return known_model;
      }

      function distance(model, known_model) {
        // Calculate the distance to the known model.
        var dist = 0;

        for (var i = 0, l = model.length; i < l; i++) {

          if (known_model[model[i][0]]) {

            dist += Math.abs(model[i][1] - known_model[model[i][0]]);

          } else {

            dist += MAX_GRAMS;

          }

        }

        return dist;
      }

      return {
        detect: function(text, callback) {
          // Return the ISO 639-2 language identifier, i.e. 'en'.

          if (!text) {
            callback.apply(undefined, [UNKNOWN]);
            return;
          }

          text = text.substr(0, MAX_LENGTH).replace(/[\u0021-\u0040]/g, '');

          identify(text, callback);

        },
        info: function(text, callback) {
          // Return language info tuple (id, code, name), i.e. ('en', 26110, 'English').

          this.detect(text, function(language) {

            if (language === UNKNOWN) {
              callback.apply(undefined, [[ UNKNOWN, UNKNOWN, UNKNOWN ]]);
              return;
            }

            callback.apply(undefined, [

              [ language, IANA_MAP[language], NAME_MAP[language] ]

            ]);;

          });

        },
        code: function(text, callback) {
          // Return the language IANA code, i.e. 26110.

          this.detect(text, function(language) {

            if (language === UNKNOWN) {
              callback.apply(undefined, [ -1 ]);;
              return;
            }

            callback.apply(undefined, [

              IANA_MAP[language]

            ]);

          });

        },
        name: function(text, callback) {
          // Return the full language name, i.e. 'English'.

          this.detect(text, function(language) {

            if (language === UNKNOWN) {
              callback.apply(undefined, [ UNKNOWN ]);;
              return;
            }

            callback.apply(undefined, [

              NAME_MAP[language]

            ]);

          });

        }
      };

  };

  global.guessLanguage = (global.module || {}).exports = new guessLanguage();

})(this);
