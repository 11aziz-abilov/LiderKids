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
1. Til: MUTLAQO FAQAT SOF O'ZBEK TILIDA (LOTIN ALIFBOSIDA) GAPIR! Rus, ingliz yoki boshqa tillarni aslo aralashtirma. Barcha tushuntirishlar, so'zlar va atamalarni sof, ravon va tushunarli o'zbek tilida ayt.
2. Murojaat: Bolaga "Chempion", "Bilimdon do'stim", "Bo'lajak Lider", "Kichik dahom" deb mehr bilan murojaat qil.
3. To'g'ridan-to'g'ri va aniq javob ber: Bola bergan savolga birinchi jumladanoq aniq va sodda javobni tushuntir.
4. Emojilar: Quvnoq emojilardan foydalan (🦁, 🌟, 💡, 🍎, 👑, ✨, 🚀, 🎯, 🪙).
5. Matematika/Misol berilsa: Aniq javobini ko'rsat va uni qanday oson hisoblashni (1-2 qadamda) o'zbek tilida erinmasdan tushuntir.
6. Ruhlantirish: Bolani doim maqtov va rag'bat bilan qo'llab-quvvatla ("Barakalla!", "Sen buni ajoyib uddalaysan!").
`;

/**
 * Har qanday arifmetik ifodani (masalan "2+11-8", "15 * 3", "100 - 45 + 10")
 * xavfsiz hisoblab, bolaga qadam-baqadam tushuntirib beruvchi funksiya
 */
export function evaluateKidMathExpression(query: string): string | null {
  const cleanExpr = query
    .replace(/[xX×]/g, '*')
    .replace(/÷/g, '/')
    .replace(/karra/gi, '*')
    .replace(/plyus/gi, '+')
    .replace(/minus/gi, '-')
    .replace(/qo['`’]?shish/gi, '+')
    .replace(/ayirish/gi, '-')
    .replace(/ko['`’]?paytirish/gi, '*')
    .replace(/bo['`’]?lish/gi, '/');

  const mathMatch = cleanExpr.match(/(\(?\d+\.?\d*\)?\s*[\+\-\*\/]\s*)+[\(?\d+\.?\d*\)?]+/);
  if (!mathMatch) return null;

  const rawMath = mathMatch[0].trim();
  if (!/^[0-9+\-*/().\s]+$/.test(rawMath)) return null;

  try {
    if (/\/\s*0(?!\d)/.test(rawMath)) {
      return `Ehtiyot bo'l, aziz bilimdonim! 🦁 Matematikada hech qanday sonni **0 ga bo'lib bo'lmaydi**! Bu qat'iy qoida! ✨`;
    }

    const calcFunc = new Function(`"use strict"; return (${rawMath})`);
    const result = calcFunc();

    if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
      return null;
    }

    const rounded = Math.round(result * 100) / 100;

    const prettyExpr = rawMath
      .replace(/\*/g, ' × ')
      .replace(/\//g, ' ÷ ')
      .replace(/\+/g, ' + ')
      .replace(/\-/g, ' - ')
      .replace(/\s+/g, ' ')
      .trim();

    return `Barakalla, chempion! 🦁🔢

Misolimiz: **${prettyExpr}**
Yechim natijasi: **${rounded}**! 🎉

💡 **Sherchaning qadamma-qadam tushuntirishi:**
${prettyExpr.includes('+') && prettyExpr.includes('-')
  ? `1️⃣ Ketma-ketlik bo'yicha amallarni bajaramiz.\n2️⃣ Qadam-baqadam hisoblaganimizda to'g'ri natija **${rounded}** chiqadi!`
  : `Matematikada amallarni to'g'ri tartibda bajarsak, har doim eng to'g'ri natija chiqadi!`}

Qoyilmaqom! Sen matematikani juda tez o'rganyapsan! Yana biror misol yechamizmi? 🚀👑`;
  } catch {
    return null;
  }
}

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
1️⃣ **Diqqat bilan o'qiymiz:** Masalada nima berilganini va nima so'ralayotganini ko'z oldingga keltir (masalan, olma yoki qutilar 🍎).
2️⃣ **Amalni aniqlaymiz:** Ko'payaptimi (qo'shish/ko'paytirish) yoki kamayaptimi (ayirish/bo'lish)?
3️⃣ **Tekshiramiz:** Natijani variantlar bilan solishtirib ko'r.

${context.topic ? `✨ **Kichik sir:** ${context.topic}` : ''}
Sen albatta to'g'ri javobni topasan! Variantlardan birini tanlab ko'r-chi! 🚀👑`;
  }

  // 2. To'g'ridan-to'g'ri arifmetik hisob-kitoblar (masalan: "2+11-8", "15*4", "100-35")
  const mathEvaluation = evaluateKidMathExpression(query);
  if (mathEvaluation) {
    return mathEvaluation;
  }

  // 3. Ko'paytirish jadvali
  if (query.includes('karra') || query.includes('ko\'paytirish') || query.includes('kopaytirish') || query.includes('jadval')) {
    return `Ajoyib savol, mening kichik do'stim! 🦁✖️
Ko'paytirish jadvali — bu bir xil sonlarni tez qo'shish demakdir!
Masalan: 3 × 4 bu 3 ta 4 ni qo'shish (4 + 4 + 4 = 12).

🌟 **Sherchaning 9 ga ko'paytirish mo'jizasi:**
Qo'llaringizni oching! Masalan, 9 × 3 ni topish uchun chapdan 3-barmog'ingizni buking:
Chap tomonda 2 ta barmoq, o'ng tomonda 7 ta barmoq qoladi. Javob: **27**! Qoyil-a? ✨
Har kuni 10 daqiqa mashq qilsak, barcha sonlar do'stingga aylanadi! 👑`;
  }

  // 4. Qo'shish va ayirish sirlari
  if (query.includes('qo\'shish') || query.includes('qoshish') || query.includes('ayirish') || query.includes('hisoblash') || query.includes('tez hisob')) {
    return `Tez hisoblash sirini bilmoqchimisan, bilimdonim? 🦁⚡
Prezident maktabiga tayyorlanishda "Yaxlitlash usuli" eng zo'r yordamchi:

Masalan: **48 + 37** ni qo'shmoqchisan:
1️⃣ 48 ga 2 ni qo'shib yaxlit **50** qilib ol!
2️⃣ Endi 50 ga 37 ni qo'sh: **87**.
3️⃣ Boya qo'shib olgan 2 ni ayirib tashla: 87 - 2 = **85**!

Qara, qog'ozsiz, xayolda bir zumda to'g'ri chiqdi! Sen ham sinab ko'r-chi! 🌟🧠`;
  }

  // 5. Tenglama
  if (query.includes('tenglama') || query.includes('noma\'lum') || query.includes('x ni topish')) {
    return `Tenglama — bu haqiqiy detektivlik jumbog'i! 🦁🔍
Tenglamadagi "X" (iks) bu bekinmachoq o'ynayotgan yashirin son.

Masalan: **X + 7 = 15**
Buni shunday tasavvur qil: Savatchada nechta olma borligini bilmaysan (X), unga 7 ta olma qo'shgandik, jami 15 ta bo'ldi.
X ni topish uchun orqaga qaytamiz: **15 - 7 = 8**! Demak, X = 8 ekan!
Qo'shishning teskarisi — ayirish, ko'paytirishning teskarisi — bo'lish! Judayam oson, to'g'rimi? 🎯`;
  }

  // 6. Prezident maktabi
  if (query.includes('prezident maktabi') || query.includes('imtihon') || query.includes('qanday kirsa') || query.includes('pm')) {
    return `Prezident maktabi — eng iqtidorli va tirishqoq bolalar maskani! 👑🦁
U yerga kirishning 4 ta oltin siri bor:

1. **Har kuni doimiy mashq:** Bir kunda ko'p emas, lekin har kuni kamida 20-30 daqiqa test va jumboq yechish (olovchalarni saqlab qolish! 🔥).
2. **Shoshilmaslik:** Savol shartini 2 marta diqqat bilan oxirigacha o'qish.
3. **Mantiqiy o'yinlar:** Shashka, shaxmat, boshqotirmalar yechish — ular miyangni kompyuterdan ham tez ishlatadi! 🧠
4. **O'zingga ishonish:** Xato qilsang aslo xafa bo'lma, xatoni to'g'rilagan bola haqiqiy Qirol Sherga aylanadi! 🦁✨

Men senga ishonaman, sen albatta Prezident maktabi o'quvchisi bo'lasan! 🚀`;
  }

  // 7. Hayvonlar va Koinot
  if (query.includes('hayvon') || query.includes('sher') || query.includes('fil') || query.includes('kit') || query.includes('dinozavr')) {
    return `Tabiat olami ajoyib mo'jizalarga to'la, do'stim! 🦁🌍
- **Dunyodagi eng katta hayvon** — bu Moviy Kit (Ko'k kit) 🐋. U 30 ta fildan ham og'irroq!
- **Eng tez yuguruvchi hayvon** — Gepard 🐆 (100 km/soat tezlikda yuguradi!).
- **Hayvonlar qiroli** esa albatta Sher! 👑🦁 Chunki u jasur, kuchli va o'z oilasini doimo himoya qiladi.
Yana qaysi hayvon haqida bilishni xohlaysan? 🐾`;
  }

  if (query.includes('quyosh') || query.includes('oy') || query.includes('koinot') || query.includes('sayyora') || query.includes('yulduz')) {
    return `Koinot sirlari senga qiziqmi? Bu ajoyib! 🚀✨
- **Quyosh** — bu juda ulkan va issiq olovli yulduz ☀️. U Yer sayyoramizdan 1 million marta kattaroq!
- **Yer** — biz yashayotgan 3-sayyora bo'lib, Quyosh atrofida 365 kunda (1 yilda) to'liq aylanib chiqadi 🌍.
- **Oy** — Yerning eng yaqin tungi yo'ldoshi, u tunda bizga nur sochadi 🌙.
Prezident maktabiga kirganingda astronomiya va fizikani yanada chuqur o'rganasan! 🔭`;
  }

  // 8. Jumboq
  if (query.includes('jumboq') || query.includes('topishmoq') || query.includes('boshqotirma') || query.includes('savol ber')) {
    const riddles = [
      `Senga bir qiziq jumboq aytaman, top-chi! 🦁🧩\n\n"Bir oilada 5 nafar o'g'il bor. Har bir o'g'ilning 1 tadan singlisi bor. Bu oilada jami nechta bola bor?"\n\nJavob: **6 ta bola**! Chunki 1 ta singil 5 ta o'g'ilning hammasiga umumiy singil bo'ladi! 😉👑`,
      `Qani, detektiv bilimdonim, buni top-chi! 🦁🕵️‍♂️\n\n"Stol ustida 4 ta yonib turgan sham bor edi. Shamol esib, ulardan 2 tasini o'chirib qo'ydi. Ertalab stolda nechta sham qoladi?"\n\nJavob: **2 ta**! Chunki o'chmagan 2 ta sham erib tugaydi, o'chgan 2 tasi esa stolda qoladi! 🕯️✨`,
      `Mana senga Prezident maktabi uslubidagi mantiqiy savol! 🦁🎯\n\n"Qaysi idishga hech qachon suv quyib to'ldirib bo'lmaydi?"\n\nJavob: **Teshik idishga** yoki **G'alvirga**! 😄💧`
    ];
    return riddles[Math.floor(Math.random() * riddles.length)];
  }

  // 9. Motivatsiya va tushkunlik
  if (query.includes('charchadim') || query.includes('qiyin') || query.includes('yecholmayapman') || query.includes('zerikdim') || query.includes('xato')) {
    return `Keling, seni qattiq bag'rimga bosay, chempion! 🦁❤️
Bilasanmi, hatto dunyodagi eng zo'r olimlar ham ko'p marta xato qilishgan. Xato — bu seni yanada kuchli qiladigan saboq!

✨ Hozir ozgina chuqur nafas ol, bir qultum toza suv ich va o'rningdan turib 5 marta sakrab ol! 🏃‍♂️💧
Keyin platformamizdagi **«Tanaffus 🎮»** bo'limida 2 daqiqa mini-o'yin o'ynab kel. Kayfiyating ko'tarilgach, yana birga dars qilamiz! Men doim sen bilanman! 🔥👑`;
  }

  // 10. Salomlashish
  if (query.includes('salom') || query.includes('assalom') || query.includes('qalesan') || query.includes('qalaysan') || query.includes('kim san') || query.includes('kimsan')) {
    return `Assalomu alaykum, mening sevimli do'stim! 🦁👋
Men — **Shercha (Qirol Sherzod)**, LiderKids platformasidagi aqlli do'sting va ustozingman!

Mendan xohlagan narsangni so'rashing mumkin:
➕ Matematika misollari (masalan "2+11-8" yoki "7 * 8")
🧩 Qiziqarli mantiqiy jumboqlar
👑 Prezident maktabiga tayyorgarlik sirlari
🌍 Koinot, hayvonlar va tabiat qiziqarliklari!

Menga qanday savoling bor? Menga yoz yoki mikrofonga gapir! 🎤✨`;
  }

  // 11. Mukofotlar, tangalar va sovg'alar
  if (query.includes('tanga') || query.includes('olov') || query.includes('market') || query.includes('sovg\'a') || query.includes('sovrin')) {
    return `LiderKids mukofotlari juda zo'r, shunday emasmi! 🦁🪙🔥
- **Tangalar (🪙):** Testlarni yechsang, darslarni ko'rsang va kunlik jumboqlarni topsang beriladi. Marketdan Sherchang uchun tojlar va kiyimlar olasan! 👑
- **Olovchalar (🔥) & Brend Sovg'alar:**
  🎁 **7 kunlik streak** — LiderKids brend ruchkasi! 🖊️
  🎁 **30 kun** — Chiroyli kepka! 🧢
  🎁 **60 kun** — Maxsus stakan! ☕
  🎁 **100 kun** — Qirol Sher futbolkasi! 👕

Bugun darslarni yakunlab, olovchangni oshirib oldingmi? Olg'a! 🚀`;
  }

  // 12. Boshqa har qanday savolga
  return `Barakalla, ajoyib savol berding, mening bilimdonim! 🦁💡
"${userQuery}" haqida bilish juda qiziq!

Buni sodda qilib tushuntiraman:
🌟 Har qanday jumboq yoki yangi narsani o'rganishda avval uning asosiy qismlarini tushunib olish kerak.
Agar bu matematik misol bo'lsa (masalan "25 + 14 - 9"), menga sonlarini yoz, darhol hisoblab tushuntiraman!
Agar darsdagi biror mavzu bo'lsa, qaysi fandan ekanligini ayt — birgalikda o'rganamiz! 🚀🧠`;
}

/**
 * Universal Client & Server AI query runner
 * Brauzerda ham (static export / Capacitor / Vercel), serverda ham ishlaydi!
 */
export async function askSherchaAi(params: {
  userText: string;
  history?: Array<{ sender: 'user' | 'assistant'; text: string }>;
  context?: AiAssistantContextData;
  studentName?: string;
  grade?: number;
}): Promise<{ reply: string; source: 'gemini' | 'offline-smart' }> {
  const { userText, history = [], context, studentName = 'Bilimdon', grade = 1 } = params;

  // 1. Agar foydalanuvchi to'g'ridan-to'g'ri hisoblash misoli yozgan bo'lsa (masalan "2+11-8"):
  const mathQuick = evaluateKidMathExpression(userText);
  if (mathQuick) {
    return {
      reply: mathQuick,
      source: 'offline-smart',
    };
  }

  // 2. Gemini API orqali so'rash
  const apiKey =
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    '';

  if (apiKey) {
    const studentInfoPrompt = `
Hozir sen bilan gaplashayotgan bola ma'lumoti:
- Ismi: ${studentName}
- Sinfe: ${grade}-sinf o'quvchisi
${context?.subject ? `- Fan: ${context.subject}` : ''}
${context?.topic ? `- Mavzu: ${context.topic}` : ''}
${context?.question ? `- Ishlayotgan savoli: "${context.question}"` : ''}
`;

    const fullSystemPrompt = `${SHERCHA_SYSTEM_PROMPT}\n${studentInfoPrompt}`;

    const contents = history.map((m) => ({
      role: m.sender === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    contents.push({
      role: 'user',
      parts: [{ text: userText }],
    });

    const models = ['gemini-3-flash-preview', 'gemini-3.5-flash'];

    for (const model of models) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: fullSystemPrompt }] },
              contents,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 800,
              },
            }),
          }
        );

        clearTimeout(timeoutId);

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const candidate = data.candidates?.[0];
          const text = candidate?.content?.parts?.[0]?.text;
          if (text && text.trim().length > 0) {
            return {
              reply: text.trim(),
              source: 'gemini',
            };
          }
        }
      } catch (err) {
        console.warn(`Gemini model ${model} fetch error:`, err);
      }
    }
  }

  // 3. Agar Gemini ulanmasa yoki javob bermasa: Aqlli Offline Shercha
  const offlineText = generateOfflineKidResponse(userText, context);
  return {
    reply: offlineText,
    source: 'offline-smart',
  };
}
