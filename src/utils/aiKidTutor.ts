/**
 * Shercha AI - LiderKids platformasi uchun bolalar aqlli yordamchisi
 * 1-4 sinf o'quvchilari uchun maxsus moslashtirilgan bilimlar bazasi va promptlar
 */

export interface AiMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: 'gemini' | 'offline-smart';
}

export interface AiAssistantContextData {
  subject?: string;
  topic?: string;
  question?: string;
  grade?: number;
  lessonId?: string;
}

export const SHERCHA_SYSTEM_PROMPT = `
Sen "Shercha"san (Qirol Sherzod) — LiderKids ta'lim platformasining quvnoq, mehribon, dono va jasur do'stisan!
Sening vazifang 1-4 sinf o'quvchilariga (7-11 yoshdagi bolalarga) matematika, muammoli masalalar, mantiq, boshqotirma va tanqidiy fikrlash bo'yicha tushunmagan narsalarini sodda, qiziqarli va mehr bilan tushuntirish. Ular Prezident maktabiga tayyorlanmoqda!

MUHIM QOIDALAR:
1. Til: Sof va chiroyli o'zbek tilida gapir (lotin alifbosida).
2. Murojaat: Bolaga "Chempion", "Bilimdon do'stim", "Bo'lajak Lider", "Kichik dahom" deb mehr bilan murojaat qil.
3. Sodda va qisqa: Javoblaring bolaning yoshiga mos bo'lsin. Murakkab ilmiy atamalarni ishlatma. 2-4 ta tushunarli sodda qadamda misollar bilan tushuntir.
4. Emojilar: Quvnoq emojilardan foydalan (🦁, 🌟, 💡, 🍎, 👑, ✨, 🚀, 🎯, 🪙).
5. Ruhlantirish: Bolani doim maqtov va rag'bat bilan qo'llab-quvvatla ("Sen buni uddalaysan!", "Xato qilishdan qo'rqma, xato — bu yangi bilim kaliti!").
6. Agar masala berilsa: To'g'ridan-to'g'ri faqat tayyor javobni aytib qo'yma, bolani o'ylantiradigan qilib, qadamma-qadam yo'naltirib tushuntir.
7. Xavfsizlik: Faqat bolalarga mos ta'limiy va yaxshi mavzularda suhbatlash.
`;

/**
 * Agar internet yoki Gemini API kaliti bo'lmasa ham, bolaning har qanday savoliga
 * to'liq va mehr bilan o'zbek tilida javob beruvchi aqlli bilim bazasi
 */
export function generateOfflineKidResponse(
  userQuery: string,
  context?: AiAssistantContextData
): string {
  const query = userQuery.toLowerCase().trim();

  // 1. Agar dars yoki savol konteksti bo'lsa
  if (context?.question && (query.includes('tushunmadim') || query.includes('yordam') || query.includes('tushuntir') || query.includes('yech') || query.includes('savol') || query.length < 15)) {
    return `Salom, chempion! 🦁 Keling, bu savolni birgalikda oson usulda tahlil qilamiz:

📌 **Savol:** "${context.question}"

💡 **Sherchaning 3 ta oson qadami:**
1️⃣ **Diqqat bilan o'qiymiz:** Masalada nima berilganini va nima so'ralayotganini tasavvur qil (masalan, ko'z oldingga olmalar yoki qutilarni keltir 🍎).
2️⃣ **Amalni aniqlaymiz:** Ko'payaptimi (qo'shish/ko'paytirish) yoki kamayaptimi (ayirish/bo'lish)?
3️⃣ **Tekshiramiz:** Natijani qaytadan solishtirib ko'r.

${context.topic ? `✨ **Kichik sir:** ${context.topic}` : ''}
Sen albatta to'g'ri javobni topasan! Variantlardan birini sinab ko'r-chi, natijasini birga ko'ramiz! 🚀👑`;
  }

  // 2. Ko'paytirish jadvali (karra jadvali)
  if (query.includes('karra') || query.includes('ko\'paytirish') || query.includes('kopaytirish') || query.includes('jadval')) {
    return `Ajoyib savol, mening kichik do'stim! 🦁✖️
Ko'paytirish jadvali — bu bir xil sonlarni tez qo'shish demakdir!
Masalan: 3 × 4 bu 3 ta 4 ni qo'shish (4 + 4 + 4 = 12).

🌟 **Sherchaning 9 ga ko'paytirish mo'jizasi:**
Qo'llaringizni oching! Masalan, 9 × 3 ni topish uchun chapdan 3-barmog'ingizni buking:
Chap tomonda 2 ta barmoq, o'ng tomonda 7 ta barmoq qoladi. Javob: **27**! Qoyil-a? ✨
Har kuni 10 daqiqa mashq qilsak, barcha sonlar do'stingga aylanadi! 👑`;
  }

  // 3. Qo'shish va ayirish
  if (query.includes('qo\'shish') || query.includes('qoshish') || query.includes('ayirish') || query.includes('hisoblash') || query.includes('tez hisob')) {
    return `Tez hisoblash sirini bilmoqchimisan, bilimdonim? 🦁⚡
Prezident maktabiga tayyorlanishda "Yaxlitlash usuli" eng zo'r yordamchi:

Masalan: **48 + 37** ni qo'shmoqchisan:
1️⃣ 48 ga 2 ni qo'shib yaxlit **50** qilib ol!
2️⃣ Endi 50 ga 37 ni qo'sh: **87**.
3️⃣ Boya olgan 2 ni ayirib tashla: 87 - 2 = **85**!

Qara, qog'ozsiz, xayolda bir zumda chiqdi! Sen ham sinab ko'r-chi! 🌟🧠`;
  }

  // 4. Tenglama va x ni topish
  if (query.includes('tenglama') || query.includes('noma\'lum') || query.includes('x ni topish')) {
    return `Tenglama — bu haqiqiy detektivlik jumbog'i! 🦁🔍
Tenglamadagi "X" (iks) bu bekinmachoq o'ynayotgan yashirin son.

Masalan: **X + 7 = 15**
Buni shunday tasavvur qil: Savatchada nechta olma borligini bilmaysan (X), unga 7 ta olma qo'shgandik, jami 15 ta bo'ldi.
X ni topish uchun orqaga qaytamiz: **15 - 7 = 8**! Demak, X = 8 ekan!
Qo'shishning teskarisi — ayirish, ko'paytirishning teskarisi — bo'lish! Judayam oson, to'g'rimi? 🎯`;
  }

  // 5. Prezident maktabiga tayyorgarlik va sirlari
  if (query.includes('prezident maktabi') || query.includes('imtihon') || query.includes('qanday kirsa') || query.includes('pm')) {
    return `Prezident maktabi — eng iqtidorli va tirishqoq bolalar maskani! 👑🦁
U yerga kirishning 4 ta oltin siri bor:

1. **Har kuni doimiy mashq:** Bir kunda ko'p emas, lekin har kuni kamida 20-30 daqiqa test va jumboq yechish (olovchalarni saqlab qolish! 🔥).
2. **Shoshilmaslik:** Savol shartini 2 marta diqqat bilan oxirigacha o'qish.
3. **Mantiqiy o'yinlar:** Shashka, shaxmat, boshqotirmalar yechish — ular miyangni kompyuterdan ham tez ishlatadi! 🧠
4. **O'zingga ishonish:** Xato qilsang aslo xafa bo'lma, xatoni to'g'rilagan bola haqiqiy Qirol Sherga aylanadi! 🦁✨

Men senga ishonaman, sen albatta Prezident maktabi o'quvchisi bo'lasan! 🚀`;
  }

  // 6. Jumboq yoki boshqotirma so'rash
  if (query.includes('jumboq') || query.includes('topishmoq') || query.includes('boshqotirma') || query.includes('savol ber')) {
    const riddles = [
      `Senga bir qiziq jumboq aytaman, top-chi! 🦁🧩\n\n"Bir oilada 5 nafar o'g'il bor. Har bir o'g'ilning 1 tadan singlisi bor. Bu oilada jami nechta bola bor?"\n\nO'ylab ko'r va menga javobingni yoz! (Kichik sir: singil hammaga umumiy bo'lishi mumkinmi? 😉)`,
      `Qani, detektiv bilimdonim, buni top-chi! 🦁🕵️‍♂️\n\n"Stol ustida 4 ta yonib turgan sham bor edi. Shamol esib, ulardan 2 tasini o'chirib qo'ydi. Ertalab stolda nechta sham qoladi?"\n\nJavobingni kutaman, faqat yaxshilab mulohaza qil! 🕯️✨`,
      `Mana senga Prezident maktabi uslubidagi mantiqiy savol! 🦁🎯\n\n"Qaysi idishga hech qachon suv quyib to'ldirib bo'lmaydi?"\n\nTopa olasanmi, bo'lajak lider? 💧😄`
    ];
    return riddles[Math.floor(Math.random() * riddles.length)];
  }

  // 7. Motivatsiya, charchoq, tushkunlik
  if (query.includes('charchadim') || query.includes('qiyin') || query.includes('yecholmayapman') || query.includes('yig\'la') || query.includes('zerikdim') || query.includes('xato')) {
    return `Keling, seni qattiq bag'rimga bosay, chempion! 🦁❤️
Bilasanmi, hatto dunyodagi eng zo'r olimlar ham ko'p marta xato qilishgan. Xato — bu seni yanada kuchli qiladigan sinov!

✨ Hozir ozgina chuqur nafas ol, bir qultum toza suv ich va o'rningdan turib 5 marta sakrab ol! 🏃‍♂️💧
Agar xohlasang, platformamizdagi **«Tanaffus 🎮»** bo'limiga kirib 2 daqiqa mini-o'yin o'ynab kel. Kayfiyating ko'tarilgach, bu masalani birgalikda 'paq-paq' yechib tashlaymiz! Men doim sen bilanman! 🔥👑`;
  }

  // 8. Shercha haqida, salomlashish
  if (query.includes('salom') || query.includes('assalom') || query.includes('qalesan') || query.includes('qalaysan') || query.includes('kim san') || query.includes('kimsan')) {
    return `Assalomu alaykum, aziz do'stim! 🦁👋
Men — **Shercha (Qirol Sherzod)**, LiderKids ta'lim platformasining eng sodiq do'sting va aqlli ustozingman!

Men senga:
➕ Matematikadan tushunmagan misollaringni oson usulda tushuntirib beraman;
🧩 Mantiqiy jumboqlarni yechish sirlarini ochaman;
👑 Prezident maktabi imtihonlariga eng zo'r tavsiyalarni aytaman;
🔥 Va albatta, kayfiyatingni ko'tarib, doim seni qo'llab-quvvatlayman!

Bugun nimani o'rganamiz yoki qaysi savolga javob topmoqchisan? Menga yoz yoki mikrofon orqali gapir! 🎤✨`;
  }

  // 9. Tangalar, olovchalar, market va sovg'alar
  if (query.includes('tanga') || query.includes('olov') || query.includes('market') || query.includes('sovg\'a') || query.includes('ruchka') || query.includes('kepka')) {
    return `LiderKids mukofotlari juda zo'r, shunday emasmi! 🦁🪙🔥
- **Tangalar (🪙):** Testlarni to'g'ri yechganingda, darslarni ko'rganingda va kundalik jumboqlarni yechganingda beriladi. Ularga Marketdan Sherchang uchun kiyimlar, tojlar va aksessuarlar sotib olishing mumkin! 👑
- **Olovchalar (🔥) & Brend Sovg'alar:** Har kuni platformaga kirib dars qilsang, olovchalaring (Streak) uzilmaydi:
  🎁 **7 kun** — LiderKids brend ruchkasi! 🖊️
  🎁 **30 kun** — Chiroyli kepka! 🧢
  🎁 **60 kun** — Maxsus stakan! ☕
  🎁 **100 kun** — Qirol Sher futbolkasi! 👕

Bugun darslarni yakunlab, olovchangni oshirib oldingmi? Olg'a! 🚀`;
  }

  // 10. Umumiy bolalarga mos javob
  return `Ajoyib fikr, bilimdon do'stim! 🦁✨
"${userQuery}" haqida bilish juda qiziq!

Buni doim esda tut: har bir yangi savol — bu yangi bilimlarga ochilgan sehrli eshikdir!
Keling, bu mavzuni yanada yaxshiroq o'rganish uchun menga:
1️⃣ Qaysi fandan ekanligini (Matematika, Mantiq yoki Boshqotirma);
2️⃣ Yoki aynan qaysi misol tushunarsiz bo'lganini yozib yubor.

Men senga uni eng oson va qiziqarli qilib tushuntirib beraman! Qani, davom etamizmi? 🚀🧠`;
}
