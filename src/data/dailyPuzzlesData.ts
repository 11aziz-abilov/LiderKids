import { GradeLevel } from '@/types';
import { DailyPuzzle } from '@/types/puzzle';

export const DAILY_PUZZLES: DailyPuzzle[] = [
  // ==========================================
  // 1-SINF: KICHKINTOY SHERCHA (BOSHLANG'ICH MANTIQ)
  // ==========================================
  {
    id: 'p-g1-d1',
    grade: 1,
    dayIndex: 0,
    title: 'Sehrli Mevali Shifr',
    category: 'cipher',
    categoryTitle: 'Maxfiy Shifr & Belgilar',
    difficultyLabel: 'Qiziqarli Jumboq',
    difficultyStars: 3,
    story: 'O‘rmon do‘konida har bir mevaning o‘z maxfiy qiymati bor. Shercha quyidagi narxlarni ko‘rib qoldi. Oxirgi qatordagi savol belgisini topa olasizmi?',
    visualData: {
      type: 'equation',
      equations: [
        {
          leftItems: [{ emoji: '🍎', op: '+' }, { emoji: '🍎' }],
          result: 10,
        },
        {
          leftItems: [{ emoji: '🍎', op: '+' }, { emoji: '🍌' }],
          result: 9,
        },
        {
          leftItems: [{ emoji: '🍌', op: '+' }, { emoji: '🍓' }],
          result: 7,
        },
        {
          leftItems: [{ emoji: '🍎', op: '+' }, { emoji: '🍓' }],
          result: '?',
        },
      ],
    },
    questionPrompt: 'Qizil olma va qulupnayning birgalikdagi yig‘indisi (🍎 + 🍓) nechaga teng?',
    options: [
      { id: 'opt-1', text: '7', subtext: 'Kamroq hisoblandi' },
      { id: 'opt-2', text: '8', subtext: 'To‘g‘ri mantiqiy xulosa!' },
      { id: 'opt-3', text: '9', subtext: 'Ortiqcha bo‘lib ketdi' },
      { id: 'opt-4', text: '10', subtext: 'Ikkita olma narxi' },
    ],
    correctOptionIndex: 1,
    hint: 'Birinchi qatordan boshlang: ikkita bir xil olma 10 bo‘lsa, bitta olma nechi bo‘ladi?',
    thinkingSteps: [
      '1-qadam: 🍎 + 🍎 = 10. Demak, 1 ta olma 🍎 = 5 ga teng.',
      '2-qadam: 🍎 + 🍌 = 9. Olma 5 bo‘lgani uchun, banan 🍌 = 9 - 5 = 4 bo‘ladi.',
      '3-qadam: 🍌 + 🍓 = 7. Banan 4 bo‘lgani uchun, qulupnay 🍓 = 7 - 4 = 3 bo‘ladi.',
      '4-qadam: Oxirgi qator: 🍎 (5) + 🍓 (3) = 8!',
    ],
    explanation: 'Har bir qatorda yashiringan mevani bosqichma-bosqich topish orqali 🍎=5 va 🍓=3 ekanligini aniqladik. 5 + 3 = 8 bo‘ladi.',
    keyTakeaway: 'Katta jumboqlarni bo‘laklarga ajratib, eng oson ma‘lumotdan boshlash kerak!',
    rewardCoins: 100,
    rewardXp: 50,
  },
  {
    id: 'p-g1-d2',
    grade: 1,
    dayIndex: 1,
    title: 'Sehrli Tarozi va Quvnoq Ayiqchalar',
    category: 'scale',
    categoryTitle: 'Tarozi & Muvozanat',
    difficultyLabel: 'Mantiqiy Balans',
    difficultyStars: 3,
    story: 'O‘yinchoqlar do‘konidagi sehrli pallali tarozi muvozanatda turibdi. 1-tarozida bitta katta ayiqcha ikkita quyonchaga teng keldi. Quyonchalar esa yong‘oqlar bilan tenglashdi!',
    visualData: {
      type: 'scale',
      scales: [
        {
          scaleNumber: 1,
          leftItems: [{ emoji: '🧸', label: '1 ta Katta Ayiqcha', count: 1 }],
          rightItems: [{ emoji: '🐰', label: '2 ta Quyoncha', count: 2 }],
          isBalanced: true,
          note: '1 ta Ayiqcha = 2 ta Quyoncha',
        },
        {
          scaleNumber: 2,
          leftItems: [{ emoji: '🐰', label: '1 ta Quyoncha', count: 1 }],
          rightItems: [{ emoji: '🌰', label: '4 ta Yong‘oq', count: 4 }],
          isBalanced: true,
          note: '1 ta Quyoncha = 4 ta Yong‘oq',
        },
      ],
    },
    questionPrompt: '1 ta Katta Ayiqchani (🧸) muvozanatda ushlab turish uchun tarozining ikkinchi pallasiga nechta yong‘oq (🌰) qo‘yish kerak?',
    options: [
      { id: 'opt-1', text: '6 ta yong‘oq', subtext: 'Yetarli emas' },
      { id: 'opt-2', text: '8 ta yong‘oq', subtext: 'To‘liq muvozanat!' },
      { id: 'opt-3', text: '10 ta yong‘oq', subtext: 'Og‘irroq bo‘lib ketadi' },
      { id: 'opt-4', text: '4 ta yong‘oq', subtext: 'Faqat 1 ta quyonchaga teng' },
    ],
    correctOptionIndex: 1,
    hint: 'Bitta quyonchaga 4 ta yong‘oq kerak bo‘lsa, ikkita quyonchaga nechta yong‘oq kerak bo‘ladi?',
    thinkingSteps: [
      '1-qadam: 1 ta Ayiqcha = 2 ta Quyonchaga teng.',
      '2-qadam: Har bir Quyoncha 4 ta Yong‘oqqa teng.',
      '3-qadam: 2 ta Quyoncha uchun: 4 + 4 = 8 ta Yong‘oq kerak bo‘ladi.',
      '4-qadam: Demak, 1 ta Ayiqcha to‘g‘ridan-to‘g‘ri 8 ta yong‘oqqa teng!',
    ],
    explanation: 'Ayiqcha 2 ta quyonchaga, har bir quyoncha esa 4 tadan yong‘oqqa teng bo‘lgani sababli: 2 × 4 = 8 ta yong‘oq bo‘ladi.',
    keyTakeaway: 'O‘rniga qo‘yish qoidasi: Bir narsaning o‘rniga unga teng boshqa narsani qo‘yish mumkin!',
    rewardCoins: 100,
    rewardXp: 50,
  },
  {
    id: 'p-g1-d3',
    grade: 1,
    dayIndex: 2,
    title: 'O‘rmon Hayvonlari Poygasi',
    category: 'detective',
    categoryTitle: 'Detektiv Mantiq',
    difficultyLabel: 'Topqirlik Sinovi',
    difficultyStars: 3,
    story: 'Tipratikan, Toshbaqa va Quyoncha 50 metrga yugurish musobaqasida qatnashishdi. Musobaqa yakunida quyidagi dalillar ma‘lum bo‘ldi:',
    visualData: {
      type: 'clues',
      clues: [
        { number: 1, icon: '🐢', text: 'Toshbaqa eng oxirgi (3-o‘rin) bo‘lib kelmadi.' },
        { number: 2, icon: '🦔', text: 'Tipratikan Quyonchadan oldin keldi, lekin marraga 1-bo‘lib yetib kelmadi.' },
        { number: 3, icon: '🏁', text: 'Har bir hayvon turli o‘rinlarni egalladi.' },
      ],
    },
    questionPrompt: 'Ushbu qiziqarli poygada kim 1-o‘rinni egallab, oltin medalni qo‘lga kiritdi?',
    options: [
      { id: 'opt-1', text: 'Tipratikan 🦔', subtext: 'U 1-bo‘lib kelmagani aytilgan' },
      { id: 'opt-2', text: 'Quyoncha 🐰', subtext: 'U Tipratikandan ham orqada qoldi' },
      { id: 'opt-3', text: 'Toshbaqa 🐢', subtext: 'G‘alati, lekin aynan Toshbaqa!' },
      { id: 'opt-4', text: 'Durrang bo‘ldi', subtext: 'Har bir hayvon turli o‘rin olgan' },
    ],
    correctOptionIndex: 2,
    hint: 'Tipratikan 1-bo‘lmagan bo‘lsa va Quyonchadan oldinda bo‘lsa, u nechanchi o‘rinda bo‘ladi?',
    thinkingSteps: [
      '1-qadam: Tipratikan 1-o‘rin emas va Quyonchadan oldinda, demak u 2-o‘rinni egallagan.',
      '2-qadam: Quyoncha Tipratikandan orqada bo‘lgani uchun, u eng oxirgi — 3-o‘rinda kelgan.',
      '3-qadam: Toshbaqa eng oxirgi bo‘lmagan va 2-o‘rinda Tipratikan bor, demak Toshbaqa 1-o‘rinda!',
    ],
    explanation: 'Tipratikan 2-o‘rinni, Quyoncha 3-o‘rinni olgani aniq bo‘lgach, 1-o‘rin faqat shoshmasdan yugurgan Toshbaqaga qoladi.',
    keyTakeaway: 'Barcha variantlarni rad etish orqali haqiqatni aniqlash mumkin!',
    rewardCoins: 100,
    rewardXp: 50,
  },
  {
    id: 'p-g1-d4',
    grade: 1,
    dayIndex: 3,
    title: 'Sehrli Rangli Qutilar Jumboqi',
    category: 'detective',
    categoryTitle: 'Mantiqiy Qidiruv',
    difficultyLabel: 'Diqqat Sinovi',
    difficultyStars: 3,
    story: 'Stol ustida 3 ta quti turibdi: Qizil, Ko‘k va Yashil. Ulardan faqat bittasida LiderKids oltin yulduzchasi yashiringan. Qutilar yonida 3 ta yozuv bor:',
    visualData: {
      type: 'clues',
      clues: [
        { number: 1, icon: '🔴', text: 'Qizil qutida: "Yulduzcha bu qutida EMAS."' },
        { number: 2, icon: '🟢', text: 'Yashil qutida: "Bu yerda faqat shirin olma bor."' },
        { number: 3, icon: '🔵', text: 'Ko‘k qutida: "Yulduzcha aynan shu yerda."' },
      ],
    },
    questionPrompt: 'Agar barcha yozuvlar rost bo‘lsa, oltin yulduzcha qaysi rangli qutida saqlanmoqda?',
    options: [
      { id: 'opt-1', text: 'Qizil qutida 🔴', subtext: 'Yozuvda "emas" deyilgan' },
      { id: 'opt-2', text: 'Ko‘k qutida 🔵', subtext: 'To‘g‘ri va aniq xulosa!' },
      { id: 'opt-3', text: 'Yashil qutida 🟢', subtext: 'Bu yerda faqat olma bor' },
      { id: 'opt-4', text: 'Hech qaysisida yo‘q', subtext: 'Yulduzcha bitta qutida bor' },
    ],
    correctOptionIndex: 1,
    hint: 'Yashil qutidagi olma va Qizil qutidagi inkorga e‘tibor bering.',
    thinkingSteps: [
      '1-qadam: Yashil qutida faqat olma borligi aytilgan, demak unda yulduzcha yo‘q.',
      '2-qadam: Qizil qutidagi yozuv to‘g‘ri, demak Qizil qutida ham yulduzcha yo‘q.',
      '3-qadam: Yagona qolgan quti — Ko‘k quti! Ko‘k qutidagi yozuv ham buni tasdiqlaydi.',
    ],
    explanation: 'Har ikkala boshqa quti tekshirilib inkor etilgach, yulduzcha faqat Ko‘k qutida bo‘lishi isbotlandi.',
    keyTakeaway: 'Diqqat bilan o‘qish va noto‘g‘ri yo‘llarni o‘chirish to‘g‘ri javobga eltadi.',
    rewardCoins: 100,
    rewardXp: 50,
  },

  // ==========================================
  // 2-SINF: O‘YNOQI SHERCHA (IKKI BOSQICHLI MANTIQ)
  // ==========================================
  {
    id: 'p-g2-d1',
    grade: 2,
    dayIndex: 0,
    title: 'Ehtiyotkor Haydovchi va Amallar Tartibi',
    category: 'cipher',
    categoryTitle: 'Ko‘paytirish & Shifr',
    difficultyLabel: 'Prezident Maktabi Tuzog‘i',
    difficultyStars: 4,
    story: 'Ko‘pchilik o‘quvchilar ushbu shifrda adashib ketishadi, chunki oxirgi qatorda amallar tartibi va ko‘paytirish belgisi bor! Diqqat bilan hisoblang:',
    visualData: {
      type: 'equation',
      equations: [
        {
          leftItems: [{ emoji: '🚗', op: '+' }, { emoji: '🚗', op: '+' }, { emoji: '🚗' }],
          result: 30,
        },
        {
          leftItems: [{ emoji: '🚗', op: '+' }, { emoji: '🚁', op: '+' }, { emoji: '🚁' }],
          result: 20,
        },
        {
          leftItems: [{ emoji: '🚁', op: '+' }, { emoji: '🚲', op: '+' }, { emoji: '🚲' }],
          result: 9,
        },
        {
          leftItems: [{ emoji: '🚲', op: '+' }, { emoji: '🚗', op: '×' }, { emoji: '🚁' }],
          result: '?',
        },
      ],
    },
    questionPrompt: 'Oxirgi qatorning to‘g‘ri qiymati nechaga teng: 🚲 + 🚗 × 🚁 = ?',
    options: [
      { id: 'opt-1', text: '60', subtext: '(2 + 10) × 5 deb adashganlar javobi' },
      { id: 'opt-2', text: '52', subtext: 'Matematika qonunlariga 100% to‘g‘ri!' },
      { id: 'opt-3', text: '25', subtext: 'Noto‘g‘ri hisoblangan' },
      { id: 'opt-4', text: '50', subtext: 'Velosiped qo‘shilmadi' },
    ],
    correctOptionIndex: 1,
    hint: 'Matematikada avval ko‘paytirish (×) bajariladi, keyin esa qo‘shish (+)!',
    thinkingSteps: [
      '1-qadam: 🚗 + 🚗 + 🚗 = 30. Demak, 1 ta Mashina 🚗 = 10.',
      '2-qadam: 10 + 🚁 + 🚁 = 20. Demak, 2 ta Vertolyot = 10, 1 ta Vertolyot 🚁 = 5.',
      '3-qadam: 5 + 🚲 + 🚲 = 9. Demak, 2 ta Velosiped = 4, 1 ta Velosiped 🚲 = 2.',
      '4-qadam: Oxirgi qatorda: 2 + 10 × 5. Avval ko‘paytirish: 10 × 5 = 50. Keyin qo‘shish: 2 + 50 = 52!',
    ],
    explanation: 'Agar bolakay amallar tartibini bilsa: avval 10 × 5 = 50, so‘ngra 2 qo‘shilib 52 chiqadi.',
    keyTakeaway: 'Amallar tartibi: Qavs -> Ko‘paytirish/Bo‘lish -> Qo‘shish/Ayirish!',
    rewardCoins: 100,
    rewardXp: 50,
  },
  {
    id: 'p-g2-d2',
    grade: 2,
    dayIndex: 1,
    title: 'Navbatdagi Sirli O‘quvchi',
    category: 'paradox',
    categoryTitle: 'Qator & Pozitsiya Mantiqi',
    difficultyLabel: 'Mantiqiy Qator',
    difficultyStars: 4,
    story: 'Maktab oshxonasiga kirish uchun bolalar bitta qatorda navbatda turishibdi. Jasur navbatning oldidan sanalganda 6-o‘rinda, eng oxiridan sanalganda esa 7-o‘rinda turibdi.',
    visualData: {
      type: 'clues',
      clues: [
        { number: 1, icon: '🧍‍♂️', text: 'Oldidan sanalganda: Jasur 6-o‘rinda (uning oldida 5 kishi bor).' },
        { number: 2, icon: '🎯', text: 'Jasurning o‘zi qatorda turibdi.' },
        { number: 3, icon: '🚶‍♂️', text: 'Orqasidan sanalganda: Jasur 7-o‘rinda (uning orqasida 6 kishi bor).' },
      ],
    },
    questionPrompt: 'Navbatda jami nechta bola turibdi?',
    options: [
      { id: 'opt-1', text: '13 ta bola', subtext: '6 + 7 deb Jasurni ikki marta sanash xatosi' },
      { id: 'opt-2', text: '12 ta bola', subtext: 'To‘g‘ri, barcha odamlar to‘liq hisoblandi!' },
      { id: 'opt-3', text: '11 ta bola', subtext: 'Bitta bola tushib qoldi' },
      { id: 'opt-4', text: '14 ta bola', subtext: 'Ortiqcha qo‘shildi' },
    ],
    correctOptionIndex: 1,
    hint: 'Jasurning oldida nechta odam bor va orqasida nechta odam borligini Jasurning o‘ziga qo‘shing.',
    thinkingSteps: [
      '1-qadam: Jasur oldidan 6-o‘rinda bo‘lsa, uning oldida roppa-rosa 5 ta bola bor.',
      '2-qadam: Jasur orqasidan 7-o‘rinda bo‘lsa, uning orqasida roppa-rosa 6 ta bola bor.',
      '3-qadam: Endi barchasini qo‘shamiz: Oldidagi bolalar (5) + Jasurning o‘zi (1) + Orqasidagi bolalar (6) = 12 ta bola!',
      '4-qadam: Yoki qisqa formula: 6 + 7 - 1 = 12.',
    ],
    explanation: 'Jasurni ikki marta sanab yubormaslik kerak: 6 + 7 = 13 emas, balki 13 - 1 = 12 ta bola bor.',
    keyTakeaway: 'Ikki tomondan sanalganda, bitta ob‘ekt ikki marta hisobga olinmasligi uchun 1 ayriladi!',
    rewardCoins: 100,
    rewardXp: 50,
  },
  {
    id: 'p-g2-d3',
    grade: 2,
    dayIndex: 2,
    title: 'Archa Ko‘chatlari Oralig‘i',
    category: 'paradox',
    categoryTitle: 'Oraliqlar & Kesmalar',
    difficultyLabel: 'Olimpiada Nozikligi',
    difficultyStars: 4,
    story: 'Maktab bog‘boni to‘g‘ri yo‘lak bo‘ylab bir xil masofada 5 ta archa ko‘chati o‘tqazdi. Har ikkita qo‘shni archa orasidagi masofa 4 metrni tashkil qiladi.',
    visualData: {
      type: 'clues',
      clues: [
        { number: 1, icon: '🌲', text: 'Jami 5 ta archa ketma-ket bir to‘g‘ri chiziqda ekilgan.' },
        { number: 2, icon: '📏', text: 'Ixtiyoriy ikki qo‘shni archa orasidagi masofa 4 metr.' },
      ],
    },
    questionPrompt: 'Birinchi va oxirgi (beshinchi) archa orasidagi umumiy masofa necha metr?',
    options: [
      { id: 'opt-1', text: '20 metr', subtext: '5 × 4 deb oraliqlarni emas, daraxtlarni ko‘paytirish xatosi' },
      { id: 'opt-2', text: '16 metr', subtext: 'Aynan shunday! 4 ta oraliq bor!' },
      { id: 'opt-3', text: '12 metr', subtext: '3 ta oraliq masofasi' },
      { id: 'opt-4', text: '18 metr', subtext: 'Noto‘g‘ri hisob' },
    ],
    correctOptionIndex: 1,
    hint: 'Qo‘lingizdagi 5 ta barmoqqa qarang. 5 ta barmoq orasida nechta bo‘shliq (oraliq) bor?',
    thinkingSteps: [
      '1-qadam: 5 ta archa orasida jami nechta oraliq borligini sanaymiz: 1-va 2-archa, 2-va 3-archa, 3-va 4-archa, 4-va 5-archa.',
      '2-qadam: Jami 4 ta oraliq mavjud (daraxtlar sonidan 1 ta kam!).',
      '3-qadam: Har bir oraliq 4 metr bo‘lsa: 4 ta oraliq × 4 metr = 16 metr!',
    ],
    explanation: '5 ta daraxt o‘rtasida faqat 4 ta oraliq bo‘ladi. Shuning uchun 4 × 4 = 16 metr.',
    keyTakeaway: 'Daraxtlar, ustunlar va qadamlarda doimo oraliqlar soni daraxtlar sonidan 1 taga kam bo‘ladi!',
    rewardCoins: 100,
    rewardXp: 50,
  },
  {
    id: 'p-g2-d4',
    grade: 2,
    dayIndex: 3,
    title: 'Sehrli Muvozanatli Qovun va Tarvuz',
    category: 'scale',
    categoryTitle: 'Zanjirli Tarozi',
    difficultyLabel: 'Mantiqiy Zanjir',
    difficultyStars: 4,
    story: 'Polizda pishgan mevalar tarozida tortilmoqda. 1 ta shirin qovun 2 ta tarvuzchaga teng keldi. Har bitta tarvuzcha esa 3 ta anorga teng. 1 ta anor esa roppa-rosa 200 gramm tosh bosadi.',
    visualData: {
      type: 'scale',
      scales: [
        {
          scaleNumber: 1,
          leftItems: [{ emoji: '🍈', label: '1 ta Qovun', count: 1 }],
          rightItems: [{ emoji: '🍉', label: '2 ta Tarvuzcha', count: 2 }],
          isBalanced: true,
          note: '1 ta Qovun = 2 ta Tarvuzcha',
        },
        {
          scaleNumber: 2,
          leftItems: [{ emoji: '🍉', label: '1 ta Tarvuzcha', count: 1 }],
          rightItems: [{ emoji: '🍎', label: '3 ta Anor (har biri 200 g)', count: 3 }],
          isBalanced: true,
          note: '1 ta Tarvuzcha = 3 ta Anor',
        },
      ],
    },
    questionPrompt: 'Tarozidagi 1 ta shirin Qovunning (🍈) og‘irligi necha gramm?',
    options: [
      { id: 'opt-1', text: '600 gramm', subtext: 'Faqat 1 ta tarvuzchaning og‘irligi' },
      { id: 'opt-2', text: '1200 gramm (1 kg 200 g)', subtext: 'To‘liq va mukammal yechim!' },
      { id: 'opt-3', text: '800 gramm', subtext: 'Yetarli emas' },
      { id: 'opt-4', text: '1000 gramm (1 kg)', subtext: 'Taxminiy xato' },
    ],
    correctOptionIndex: 1,
    hint: 'Avval 1 ta tarvuzcha necha gramm ekanligini toping, keyin qovun uchun 2 ga ko‘paytiring.',
    thinkingSteps: [
      '1-qadam: 1 ta Anor = 200 gramm.',
      '2-qadam: 1 ta Tarvuzcha = 3 ta Anor = 3 × 200 = 600 gramm.',
      '3-qadam: 1 ta Qovun = 2 ta Tarvuzcha = 2 × 600 = 1200 gramm!',
    ],
    explanation: 'Qovun 2 ta tarvuzga teng. 1 ta tarvuz 600 g bo‘lsa, qovun 600 × 2 = 1200 gramm (1 kg 200 g) chiqadi.',
    keyTakeaway: 'Zanjirli masalalarda ma‘lum son qiymatidan noma‘lum sari qadamma-qadam boriladi!',
    rewardCoins: 100,
    rewardXp: 50,
  },

  // ==========================================
  // 3-SINF: O‘SMIR SHER (CHUQUR TAHLIL & PARADOKSLAR)
  // ==========================================
  {
    id: 'p-g3-d1',
    grade: 3,
    dayIndex: 0,
    title: 'Quduqdagi Qat‘iyatli Shillakurt',
    category: 'paradox',
    categoryTitle: 'Harakat & Chegara Paradoksi',
    difficultyLabel: 'Klassik Mantiq Masalasi',
    difficultyStars: 4,
    story: 'Chuqurligi 10 metr bo‘lgan quduq tubida kichkina shillakurt yashaydi. U har kuni quyosh chiqqanda yuqoriga qarab 3 metr ko‘tariladi, lekin kechasi uxlab qolib 2 metr pastga sirg‘alib ketadi.',
    visualData: {
      type: 'clues',
      clues: [
        { number: 1, icon: '☀️', text: 'Kunduzi: +3 metr yuqoriga chiqadi.' },
        { number: 2, icon: '🌙', text: 'Kechasi: -2 metr pastga sirg‘aladi.' },
        { number: 3, icon: '📏', text: 'Har to‘liq sutkada sof natija: 3 - 2 = 1 metr.' },
        { number: 4, icon: '🏆', text: 'Quduq chetiga (10 metrga) yetib borsa, darhol tashqariga chiqib ketadi va qaytib tushmaydi!' },
      ],
    },
    questionPrompt: 'Shillakurt quduqdan nechanchi kunning kunduzida butunlay chiqib ketadi?',
    options: [
      { id: 'opt-1', text: '10-kuni', subtext: 'Oxirgi kunduzgi sakrash hisobga olinmadi' },
      { id: 'opt-2', text: '8-kuni', subtext: 'Daho darajasidagi to‘g‘ri mantiq!' },
      { id: 'opt-3', text: '9-kuni', subtext: 'Kechasi sirg‘alish hisoblanib ketdi' },
      { id: 'opt-4', text: '7-kuni', subtext: 'Yetib bormaydi (faqat 7 metr bo‘ladi)' },
    ],
    correctOptionIndex: 1,
    hint: '7-kunning kechasi tugaganida shillakurt qaysi balandlikda bo‘ladi? 8-kuni kunduzi u qancha ko‘tariladi?',
    thinkingSteps: [
      '1-qadam: Har sutkada shillakurt 1 metr yuqoriga siljiydi (3 - 2 = 1).',
      '2-qadam: 7 sutka o‘tgach, u 7 metr balandlikda turgan bo‘ladi.',
      '3-qadam: 8-kuni kunduzi u 3 metr ko‘tariladi: 7 + 3 = 10 metr! U quduq labiga yetdi va chiqib ketdi!',
      '4-qadam: U endi quduqdan chiqib ketgani uchun, kechasi sirg‘alib tushmaydi!',
    ],
    explanation: '7 kun o‘tgach shillakurt 7-metrda bo‘ladi. 8-kuni kunduzi +3 metr ko‘tarilib 10-metrga yetadi va erkinlikka chiqadi. Kechasi qaytib tushmaydi.',
    keyTakeaway: 'Chegara shartlariga e‘tibor bering: Maqsadga yetgandan keyin ortga qaytish sodir bo‘lmaydi!',
    rewardCoins: 100,
    rewardXp: 50,
  },
  {
    id: 'p-g3-d2',
    grade: 3,
    dayIndex: 1,
    title: 'Ko‘p Qavatli Bino Zinalari',
    category: 'paradox',
    categoryTitle: 'Qavatlar & Oraliqlar',
    difficultyLabel: 'Mantiqiy Qopqon',
    difficultyStars: 4,
    story: 'Ali do‘stining uyiga mehmonga bordi. U 1-qavatdan 3-qavatga ko‘tarilish uchun roppa-rosa 36 ta zinapoyani bosib o‘tdi. Barcha qavatlar orasidagi zinalar soni bir xil.',
    visualData: {
      type: 'clues',
      clues: [
        { number: 1, icon: '🏢', text: '1-qavatdan 3-qavatgacha: 36 ta zina bosib o‘tildi.' },
        { number: 2, icon: '📐', text: 'Har bir qavat oralig‘ida bir xil sondagi zinalar bor.' },
      ],
    },
    questionPrompt: 'Agar Ali 1-qavatdan 6-qavatga chiqmoqchi bo‘lsa, u jami nechta zinapoyani bosib o‘tishi kerak bo‘ladi?',
    options: [
      { id: 'opt-1', text: '72 ta zina', subtext: 'Faqat 2 baravar ko‘paytirish xatosi' },
      { id: 'opt-2', text: '90 ta zina', subtext: 'To‘liq to‘g‘ri! 5 ta qavat oralig‘i bor!' },
      { id: 'opt-3', text: '108 ta zina', subtext: '6-qavat deb 6 ga ko‘paytirish xatosi' },
      { id: 'opt-4', text: '80 ta zina', subtext: 'Noto‘g‘ri oraliq' },
    ],
    correctOptionIndex: 1,
    hint: '1-qavatdan 3-qavatga chiqish uchun nechta qavat oralig‘i (marsh) bosiladi?',
    thinkingSteps: [
      '1-qadam: 1-qavatdan 3-qavatgacha atigi 2 ta qavat oralig‘i bor (1->2 va 2->3).',
      '2-qadam: 2 ta oraliq = 36 ta zina. Demak, 1 ta oraliq = 36 / 2 = 18 ta zina.',
      '3-qadam: 1-qavatdan 6-qavatgacha esa 5 ta qavat oralig‘i bor (1->2, 2->3, 3->4, 4->5, 5->6).',
      '4-qadam: 5 ta oraliq × 18 ta zina = 90 ta zina!',
    ],
    explanation: '1-dan 3-gacha 2 ta qavat ko‘tarilishi kerak: 36/2=18 zina bitta qavat uchun. 1-dan 6-gacha 5 ta oraliq bor: 5 × 18 = 90 ta zina.',
    keyTakeaway: 'Qavat raqami bilan qavatlar orasidagi oraliq sonini adashtirmaslik lozim!',
    rewardCoins: 100,
    rewardXp: 50,
  },
  {
    id: 'p-g3-d3',
    grade: 3,
    dayIndex: 2,
    title: 'Rangli Paypoqlar va Kafolatlangan Juftlik',
    category: 'detective',
    categoryTitle: 'Dirixle Prinsipi & Kafolat',
    difficultyLabel: 'Tanqidiy Fikrlash',
    difficultyStars: 4,
    story: 'Xonada chiroq o‘chib qoldi va qorong‘i bo‘lib qoldi. Javonda 10 ta qizil paypoq, 10 ta ko‘k paypoq va 10 ta oq paypoq tartibsiz aralashib yotibdi. Siz ularning rangini ko‘ra olmaysiz.',
    visualData: {
      type: 'clues',
      clues: [
        { number: 1, icon: '🔴', text: '10 ta qizil paypoq.' },
        { number: 2, icon: '🔵', text: '10 ta ko‘k paypoq.' },
        { number: 3, icon: '⚪', text: '10 ta oq paypoq.' },
        { number: 4, icon: '🕯️', text: 'Xona qorong‘i, ranglarni ko‘rib bo‘lmaydi.' },
      ],
    },
    questionPrompt: 'Bir xil rangdagi kamida bitta to‘liq JUFTLIK (2 ta bir xil rangli paypoq) chiqishiga 100% KAFOLAT bo‘lishi uchun javondan kamida nechta paypoq olish kerak?',
    options: [
      { id: 'opt-1', text: '3 ta paypoq', subtext: 'Uchalasi uch xil rang bo‘lib qolishi mumkin' },
      { id: 'opt-2', text: '4 ta paypoq', subtext: 'Haqiqiy matematik kafolat!' },
      { id: 'opt-3', text: '11 ta paypoq', subtext: 'Ortiqcha ko‘p son' },
      { id: 'opt-4', text: '21 ta paypoq', subtext: 'Bir rangni tugatish talab qilinmadi' },
    ],
    correctOptionIndex: 1,
    hint: 'Eng yomon holatni tasavvur qiling: dastlab olingan barcha paypoqlar har xil rangda bo‘lsa, keyingi olinadigani qaysi rang bo‘ladi?',
    thinkingSteps: [
      '1-qadam: Jami 3 xil rang mavjud: Qizil, Ko‘k, Oq.',
      '2-qadam: Eng omadsiz holatda, dastlabki 3 ta olingan paypoq har xil rangda (1 ta qizil, 1 ta ko‘k, 1 ta oq) bo‘lib chiqishi mumkin.',
      '3-qadam: To‘rtinchi (4-) paypoq olinganda, u qaysi rang bo‘lishidan qat‘i nazar, avvalgi 3 tadan biriga juft bo‘ladi!',
      '4-qadam: Demak, kamida 4 ta paypoq olinsa, 100% bitta juftlik paydo bo‘ladi.',
    ],
    explanation: 'Mavjud ranglar soni 3 ta bo‘lgani uchun (Dirixle qoidasi), 3 + 1 = 4 ta paypoq olinganda albatta bir xil rangli juftlik kafolatlanadi.',
    keyTakeaway: 'Eng noqulay vaziyatni tahlil qilish orqali mutlaq kafolatlangan yechim topiladi!',
    rewardCoins: 100,
    rewardXp: 50,
  },
  {
    id: 'p-g3-d4',
    grade: 3,
    dayIndex: 3,
    title: 'Ota va O‘g‘il Yosh Masalasi',
    category: 'logic_math',
    categoryTitle: 'Tenglamalar & Nisbatlar',
    difficultyLabel: 'Prezident Maktabi Mantiqi',
    difficultyStars: 4,
    story: 'Bugungi kunda ota 36 yoshda, uning o‘g‘li esa 8 yoshda. Yillar o‘tishi bilan ikkalasining yoshi ham bir xilda ulg‘ayib boradi.',
    visualData: {
      type: 'clues',
      clues: [
        { number: 1, icon: '👨', text: 'Otaning bugungi yoshi: 36 da.' },
        { number: 2, icon: '👦', text: 'O‘g‘ilning bugungi yoshi: 8 da.' },
        { number: 3, icon: '⚖️', text: 'Oraliq farq: 36 - 8 = 28 yosh (bu farq hech qachon o‘zgarmaydi!).' },
      ],
    },
    questionPrompt: 'Necha yildan so‘ng otaning yoshi o‘g‘lining yoshidan roppa-rosa 3 baravar katta bo‘ladi?',
    options: [
      { id: 'opt-1', text: '4 yildan keyin', subtext: 'Ota 40, o‘g‘il 12 bo‘ladi (nisbat 3,33)' },
      { id: 'opt-2', text: '6 yildan keyin', subtext: 'Ajoyib! Ota 42, o‘g‘il 14 bo‘ladi (42 / 14 = 3)!' },
      { id: 'opt-3', text: '8 yildan keyin', subtext: 'Ota 44, o‘g‘il 16 bo‘ladi' },
      { id: 'opt-4', text: '5 yildan keyin', subtext: 'Tekshirib ko‘ring' },
    ],
    correctOptionIndex: 1,
    hint: 'Har yili ikkalasi ham 1 yoshga qariydi. 6 yildan keyin ota necha yoshda, o‘g‘il necha yoshda bo‘lishini hisoblab ko‘ring.',
    thinkingSteps: [
      '1-qadam: Ota va o‘g‘il yoshlari orasidagi farq: 36 - 8 = 28 yosh.',
      '2-qadam: Ota o‘g‘lidan 3 baravar katta bo‘lgan paytda, ularning yoshlari nisbati 3:1 bo‘ladi. Farq 3 - 1 = 2 qism bo‘ladi.',
      '3-qadam: 2 qism = 28 yosh bo‘lsa, 1 qism = 28 / 2 = 14 yosh (o‘g‘ilning kelajakdagi yoshi).',
      '4-qadam: O‘g‘il hozir 8 yoshda, 14 yoshga yetishi uchun: 14 - 8 = 6 yil kerak bo‘ladi!',
    ],
    explanation: '6 yildan keyin ota 42 yoshda (36+6), o‘g‘il esa 14 yoshda (8+6) bo‘ladi. 42 / 14 = 3 baravar!',
    keyTakeaway: 'Yosh masalalarida insonlar orasidagi yosh farqi yillar o‘tsa ham mutlaqo o‘zgarmas bo‘lib qoladi!',
    rewardCoins: 100,
    rewardXp: 50,
  },

  // ==========================================
  // 4-SINF: QIROL SHER (PREZIDENT MAKTABI TAYYORGARLIGI)
  // ==========================================
  {
    id: 'p-g4-d1',
    grade: 4,
    dayIndex: 0,
    title: 'Prezident Maktabi: Velosipedlar va Samokatlar',
    category: 'logic_math',
    categoryTitle: 'Prezident Maktabi Masalasi',
    difficultyLabel: 'Olimpiada Darajasi',
    difficultyStars: 5,
    story: 'Bolalar maydonchasida jami 16 ta bolalar velosipedi va uch g‘ildirakli samokatlari turibdi. Bolalar ularning barcha g‘ildiraklarini sanab chiqishganda, jami 39 ta g‘ildirak borligi aniqlandi. Velosipedlar 2 g‘ildirakli, samokatlar esa 3 g‘ildirakli.',
    visualData: {
      type: 'clues',
      clues: [
        { number: 1, icon: '🚲', text: 'Har bir oddiy velosipedda: 2 ta g‘ildirak bor.' },
        { number: 2, icon: '🛴', text: 'Har bir bolalar samokatida: 3 ta g‘ildirak bor.' },
        { number: 3, icon: '🔢', text: 'Jami transportlar soni: 16 ta.' },
        { number: 4, icon: '⚙️', text: 'Jami g‘ildiraklar soni: 39 ta.' },
      ],
    },
    questionPrompt: 'Maydonchada nechta 3 g‘ildirakli samokat bor?',
    options: [
      { id: 'opt-1', text: '5 ta samokat', subtext: 'G‘ildiraklar soni yetmaydi' },
      { id: 'opt-2', text: '7 ta samokat', subtext: 'Haqiqiy chempionlik hisobi! (7 × 3 + 9 × 2 = 39)' },
      { id: 'opt-3', text: '9 ta samokat', subtext: 'Bu 2 g‘ildirakli velosipedlar soni!' },
      { id: 'opt-4', text: '8 ta samokat', subtext: '38 ta g‘ildirak bo‘lib qoladi' },
    ],
    correctOptionIndex: 1,
    hint: 'Faraz qilish usulidan foydalaning: Agar barcha 16 ta transport 2 g‘ildirakli bo‘lganida, nechta g‘ildirak bo‘lardi? Ortiqcha chiqqan g‘ildiraklar kimniki?',
    thinkingSteps: [
      '1-qadam: Faraz qilaylik, maydonchadagi barcha 16 ta transport oddiy 2 g‘ildirakli velosiped bo‘lsin.',
      '2-qadam: Unda jami: 16 × 2 = 32 ta g‘ildirak bo‘lardi.',
      '3-qadam: Haqiqatda esa 39 ta g‘ildirak bor. Farq: 39 - 32 = 7 ta ortiqcha g‘ildirak!',
      '4-qadam: Har bir 3 g‘ildirakli samokat velosipeddan 1 ta ko‘p g‘ildirakka ega (3 - 2 = 1). Demak, bu 7 ta ortiqcha g‘ildirak aynan 7 ta samokatga tegishli!',
      '5-qadam: Tekshiramiz: 7 ta samokat (7 × 3 = 21) va 9 ta velosiped (9 × 2 = 18). Jami: 21 + 18 = 39 g‘ildirak!',
    ],
    explanation: 'Faraz qilish usuli orqali 32 ta deb topdik. Haqiqiy 39 ta g‘ildirakdan 7 tasi ortiqcha, bu esa 7 ta 3 g‘ildirakli samokat borligini isbotlaydi.',
    keyTakeaway: 'Prezident maktabi imtihonlaridagi klassik "Quyonlar va tovuqlar oyoqlari" masalasining eng tezkor usuli — faraz qilish algoritmidir!',
    rewardCoins: 120,
    rewardXp: 60,
  },
  {
    id: 'p-g4-d2',
    grade: 4,
    dayIndex: 1,
    title: 'To‘rt Gumonlanuvchi va Yagona Rostgo‘y',
    category: 'detective',
    categoryTitle: 'Mantiqiy Deduksiya',
    difficultyLabel: 'Detektiv Paradoks',
    difficultyStars: 5,
    story: 'Sinfdagi eng murakkab olimpiada masalasini kimdir doskaga to‘liq yechib qo‘ydi. O‘qituvchi 4 nafar o‘quvchidan so‘raganda, ular shunday javob berishdi:',
    visualData: {
      type: 'clues',
      clues: [
        { number: 1, icon: '👦', text: 'Aziz: "Masalani Bobur yechdi."' },
        { number: 2, icon: '🧒', text: 'Bobur: "Masalani Doniyor yechdi."' },
        { number: 3, icon: '🧑', text: 'Sardor: "Men bu masalani yechganim yo‘q."' },
        { number: 4, icon: '👦', text: 'Doniyor: "Bobur yolg‘on gapiryapti."' },
        { number: 5, icon: '⚖️', text: 'DIQQAT: Ushbu 4 kishidan FAQAT BITTASI ROST gapirgan, qolgan 3 tasi esa aldamoqda!' },
      ],
    },
    questionPrompt: 'Ushbu mashhur jumboqli masalani doskaga ASLIDA kim yechgan edi?',
    options: [
      { id: 'opt-1', text: 'Aziz', subtext: 'Deduksiyani tekshirib ko‘ring' },
      { id: 'opt-2', text: 'Bobur', subtext: 'Bobur yechgan bo‘lsa shart buziladi' },
      { id: 'opt-3', text: 'Sardor', subtext: 'Daho darajasidagi to‘g‘ri mantiqiy xulosa!' },
      { id: 'opt-4', text: 'Doniyor', subtext: 'Ikkita rostgo‘y paydo bo‘lib qoladi' },
    ],
    correctOptionIndex: 2,
    hint: 'Bobur va Doniyorning gaplariga e‘tibor bering: biri "Doniyor yechdi", ikkinchisi "Bobur yolg‘on aytyapti" demoqda. Ular bir vaqtda ikkalasi ham yolg‘onchi bo‘la oladimi?',
    thinkingSteps: [
      '1-qadam: Bobur va Doniyor bir-biriga zid gapirmoqda. Biri ikkinchisini yolg‘onchi deyapti. Demak, ulardan biri ALBATTA ROSTGO‘Y, ikkinchisi esa yolg‘onchi!',
      '2-qadam: Shartda esa "faqat 1 kishi rost gapirgan" deyilgan. Demak, o‘sha yagona rostgo‘y yo Bobur, yo Doniyor!',
      '3-qadam: Bu shuni anglatadiki, qolgan barcha bolalar (Aziz va Sardor) 100% YOLG‘ON GAPIRMOQDA!',
      '4-qadam: Endi Sardorning gapiga qaraymiz: Sardor "Men yechganim yo‘q" dedi. Lekin biz uning aldayotganini aniqladik!',
      '5-qadam: Agar "Men yechganim yo‘q" degani yolg‘on bo‘lsa, demak haqiqatda masalani aynan SARDOR yechgan!',
    ],
    explanation: 'Bobur va Doniyor qarama-qarshi bo‘lgani uchun bitta rostgo‘y ularning orasida. Shuning uchun Sardor aldayotgan bo‘lib chiqadi. "Men yechmadim" yolg‘on bo‘lsa, demak aynan Sardor yechgan!',
    keyTakeaway: 'Zid (qarama-qarshi) fikrlar tahlili boshqa barcha shaxslarning yolg‘onchiligini fosh qiladi!',
    rewardCoins: 120,
    rewardXp: 60,
  },
  {
    id: 'p-g4-d3',
    grade: 4,
    dayIndex: 2,
    title: 'Tezkor Qushcha va Ikki Poyezd',
    category: 'logic_math',
    categoryTitle: 'Harakat & Masofa Mantiqi',
    difficultyLabel: 'Olimpiada Nozikligi',
    difficultyStars: 5,
    story: 'Toshkent va Samarqand shaharlari orasidagi masofa 300 km. Bir vaqtda bir-biriga qarab ikkita tezyurar poyezd yo‘lga chiqdi: birinchisining tezligi 60 km/soat, ikkinchisining tezligi 40 km/soat. Birinchi poyezd tumshug‘idan tezligi 80 km/soat bo‘lgan qushcha uchib, ikkinchi poyezd tomon yo‘l oldi va poyezdlar uchrashgunga qadar tinmay ikki poyezd orasida uchib turdi.',
    visualData: {
      type: 'clues',
      clues: [
        { number: 1, icon: '🚆', text: '1-poyezd tezligi: 60 km/soat.' },
        { number: 2, icon: '🚄', text: '2-poyezd tezligi: 40 km/soat.' },
        { number: 3, icon: '🛤️', text: 'Shaharlar orasidagi umumiy masofa: 300 km.' },
        { number: 4, icon: '🕊️', text: 'Qushchaning to‘xtovsiz uchish tezligi: 80 km/soat.' },
      ],
    },
    questionPrompt: 'Poyezdlar bir-biri bilan uchrashgunga qadar qushcha JAMI necha kilometr masofani bosib o‘tadi?',
    options: [
      { id: 'opt-1', text: '160 km', subtext: 'Kamroq vaqt hisoblandi' },
      { id: 'opt-2', text: '240 km', subtext: 'Faqat daho matematiklar uchun oson! 3 soat × 80 = 240!' },
      { id: 'opt-3', text: '300 km', subtext: 'Poyezdlar masofasi bilan adashtirildi' },
      { id: 'opt-4', text: '200 km', subtext: 'Noto‘g‘ri hisob' },
    ],
    correctOptionIndex: 1,
    hint: 'Qushchaning orqaga-oldinga murakkab uchganini emas, uning NECHA SOAT davomida havoda uchganini aniqlang!',
    thinkingSteps: [
      '1-qadam: Poyezdlar bir-biriga qarab harakatlanmoqda. Ularning yaqinlashish tezligi: 60 + 40 = 100 km/soat.',
      '2-qadam: Ular uchrashishi uchun ketadigan vaqt: Masofa / Tezlik = 300 km / 100 km/soat = 3 soat!',
      '3-qadam: Demak, qushcha to‘xtovsiz roppa-rosa 3 soat davomida parvoz qilgan.',
      '4-qadam: Qushcha bosib o‘tgan masofa: Tezlik × Vaqt = 80 km/soat × 3 soat = 240 km!',
    ],
    explanation: 'Qushchaning qanday burchak ostida uchishi muhim emas, u jami 3 soat havoda 80 km/soat tezlikda uchgan: 3 × 80 = 240 km.',
    keyTakeaway: 'Chalkash tuyulgan geometrik traektoriyalarni emas, umumiy vaqt ko‘rsatkichini topish masalani 1 daqiqada yechadi!',
    rewardCoins: 120,
    rewardXp: 60,
  },
  {
    id: 'p-g4-d4',
    grade: 4,
    dayIndex: 3,
    title: '9 Tanga va Yagona Soxta Tanga',
    category: 'scale',
    categoryTitle: 'Tarozida Qidirish Algoritmi',
    difficultyLabel: 'Prezident Maktabi Algoritmi',
    difficultyStars: 5,
    story: 'Xazinabon oldida tashqi ko‘rinishi va rangi mutlaqo bir xil bo‘lgan 9 ta tilla tanga turibdi. Lekin ulardan bittasi soxta bo‘lib, u qolgan haqiqiy tangalardan salgina yengilroq. Qo‘lingizda toshsiz (pallali) tarozi bor.',
    visualData: {
      type: 'clues',
      clues: [
        { number: 1, icon: '🪙', text: 'Jami 9 ta tanga bor, 1 tasi soxta (yengilroq).' },
        { number: 2, icon: '⚖️', text: 'Pallali tarozi faqat qaysi palla og‘ir yoki yengilligini ko‘rsatadi.' },
        { number: 3, icon: '🎯', text: 'Maqsad: Eng kam tortishlar sonida soxta tangani aniq topish.' },
      ],
    },
    questionPrompt: 'Pallali tarozida KAMIDA necha marta tortish orqali soxta tangani 100% kafolat bilan topish mumkin?',
    options: [
      { id: 'opt-1', text: '1 marta', subtext: 'Faqat omadga tayanib kafolatlab bo‘lmaydi' },
      { id: 'opt-2', text: '2 marta', subtext: 'Matematik daho javobi! 3-lik guruhlash algoritmi!' },
      { id: 'opt-3', text: '3 marta', subtext: 'Ortiqcha tortish' },
      { id: 'opt-4', text: '4 marta', subtext: 'Juda ko‘p' },
    ],
    correctOptionIndex: 1,
    hint: '9 ta tangani ikkiga emas, uchta teng guruhga (3 ta, 3 ta, 3 ta) ajrating!',
    thinkingSteps: [
      '1-qadam: 9 ta tangani 3 ta guruhga bo‘lamiz: A (3 ta), B (3 ta), C (3 ta).',
      '2-qadam: 1-tortish: A guruhni chap pallaga, B guruhni o‘ng pallaga qo‘yamiz. Agar ular teng kelsa — soxta tanga C guruhda! Agar biri yengil kelsa — soxta tanga o‘sha yengil pallasidagi guruhda!',
      '3-qadam: 1-tortishdan so‘ng bizda atigi 3 ta tanga qoladi.',
      '4-qadam: 2-tortish: Shu 3 ta tangadan 1 tasini chapga, 1 tasini o‘ngga qo‘yamiz. Agar teng bo‘lsa — chetda qolgan 3-tanga soxta! Agar biri yengil bo‘lsa — aynan o‘sha soxta!',
      '5-qadam: Jami atigi 2 marta tortish kifoya!',
    ],
    explanation: 'Uchlik bo‘lish algoritmi (Ternary search) har bir tortishda variantlar sonini 3 barobarga kamaytiradi: 9 -> 3 -> 1. Shuning uchun 2 marta yetarli.',
    keyTakeaway: 'Ikki pallali tarozida ikkiga emas, uchtaga bo‘lish eng samarali algoritmdir!',
    rewardCoins: 120,
    rewardXp: 60,
  },
];

/**
 * Returns the daily puzzle for the specified date string (YYYY-MM-DD) and grade.
 * Deterministic: every student of the same grade sees the exact same puzzle for that day.
 */
export function getDailyPuzzleForDate(dateStr: string, grade: GradeLevel): DailyPuzzle {
  const puzzlesForGrade = DAILY_PUZZLES.filter((p) => p.grade === grade);
  if (puzzlesForGrade.length === 0) {
    // Fallback to any puzzle
    return DAILY_PUZZLES[0];
  }

  // Parse date string into day of year or day seed
  let seed = 0;
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      const startOfYear = new Date(year, 0, 1);
      const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
      seed = Math.abs(dayOfYear);
    }
  } catch {
    seed = new Date().getDate();
  }

  const index = seed % puzzlesForGrade.length;
  return puzzlesForGrade[index];
}

/**
 * Formats date into readable Uzbek string, e.g. "12-oktabr, 2026-yil, Dushanba"
 */
export function formatUzbekDate(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    const year = parseInt(parts[0], 10);
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(year, monthIndex, day);

    const monthsUz = [
      'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
      'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'
    ];
    const daysUz = [
      'Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba',
      'Payshanba', 'Juma', 'Shanba'
    ];

    const monthName = monthsUz[monthIndex] || '';
    const dayOfWeek = daysUz[date.getDay()] || '';

    return `${day}-${monthName}, ${dayOfWeek}`;
  } catch {
    return dateStr;
  }
}
