import { DayScheduleConfig, ScheduledLesson } from '@/types/schedule';
import { GradeLevel, SubjectId, QuizQuestion } from '@/types';
import { DayOfWeekKey } from '@/utils/tashkentTime';
import { ALL_QUIZ_QUESTIONS } from './quizQuestionsData';

/**
 * ========================================================
 * HAFTALIK DARS JADVALI ASOSIY SOZLAMALARI (CONFIG)
 * Kunlar yoki fanlar taqsimotini shu yerdan osongina o'zgartirish mumkin!
 * ========================================================
 */
export const WEEKLY_DAYS_CONFIG: DayScheduleConfig[] = [
  {
    dayKey: 'monday',
    dayName: 'Dushanba',
    subjects: ['math', 'english'],
    description: 'Matematika va Ingliz tili sirlarini ochish bilan haftani shiddatli boshlaymiz!',
  },
  {
    dayKey: 'tuesday',
    dayName: 'Seshanba',
    subjects: ['logic', 'critical'],
    description: 'Muammoli masalalarni hal qilish va teran tanqidiy fikrlash kuni!',
  },
  {
    dayKey: 'wednesday',
    dayName: 'Chorshanba',
    subjects: ['math', 'english'],
    description: 'Matematik hisob-kitoblar va yangi inglizcha so‘z boyligi kuni!',
  },
  {
    dayKey: 'thursday',
    dayName: 'Payshanba',
    subjects: ['logic', 'critical'],
    description: 'Prezident maktabi darajasidagi mantiq va fazoviy tasavvur mashqlari!',
  },
  {
    dayKey: 'friday',
    dayName: 'Juma',
    subjects: ['math', 'english'],
    description: 'Tezkor hisoblash texnikasi va erkin inglizcha muloqot sari qadam!',
  },
  {
    dayKey: 'saturday',
    dayName: 'Shanba',
    subjects: ['logic', 'critical'],
    description: 'Eng qiziqarli detektiv jumboqlar va analitik xulosa chiqarish kuni!',
  },
  {
    dayKey: 'sunday',
    dayName: 'Yakshanba',
    subjects: ['math', 'logic', 'critical', 'english'],
    isExamDay: true,
    description: 'Haftalik Katta Test: 4 ta fan bo‘yicha 20 ta savoldan iborat intellektual sinov!',
  },
];

/**
 * ========================================================
 * BARCHA SINFLAR UCHUN HAFTALIK BELGILANGAN DARSLAR BAZASI
 * 1-4 sinflar uchun haftada 12 ta dars (Dush-Shan)
 * ========================================================
 */
export const SCHEDULED_LESSONS: ScheduledLesson[] = [
  // ==========================================
  // 1-SINF DARSLARI (KICHKINTOY SHERCHA)
  // ==========================================
  // Dushanba: Math + English
  {
    id: 'sch-g1-mon-math',
    dayKey: 'monday',
    subjectId: 'math',
    grade: 1,
    title: '10 sonining sehrli do‘stlari va o‘nliklar',
    topic: 'Qo‘shish (10 gacha)',
    durationMinutes: 6,
    youtubeId: '3A_bX2q1f6E',
    description: '10 hosil qiluvchi juftliklar (1+9, 2+8, 3+7, 4+6, 5+5) orqali og‘zaki hisoblashni o‘rganamiz.',
    learningPoints: ['10 sonining juftliklari', 'Barmoqlarsiz xayolda hisoblash', 'Oson qo‘shish usullari'],
  },
  {
    id: 'sch-g1-mon-eng',
    dayKey: 'monday',
    subjectId: 'english',
    grade: 1,
    title: 'Sehrli ABC: Harflar va quvnoq ranglar',
    topic: 'Alifbo va ranglar',
    durationMinutes: 5,
    youtubeId: '75p-NQuAEzr',
    description: 'Ingliz alifbosidagi dastlabki harflar, to‘g‘ri talaffuz va sevimli ranglar nomlari.',
    learningPoints: ['A, B, C, D harflari va tovushlari', 'Red, Blue, Green, Yellow ranglari', 'Quvnoq inglizcha salomlashish'],
  },
  // Seshanba: Logic + Critical
  {
    id: 'sch-g1-tue-logic',
    dayKey: 'tuesday',
    subjectId: 'logic',
    grade: 1,
    title: 'Mantiqiy jumboq: Qaysi biri ortiqcha?',
    topic: 'Ortiqchasini topish',
    durationMinutes: 5,
    youtubeId: '4-X2Fj0e-0c',
    description: 'Narsalarning rangi, shakli va vazifasiga ko‘ra umumiy guruhdan ajralib turuvchisini topamiz.',
    learningPoints: ['Belgilarga qarab guruhlash', 'Ortiqcha buyumni payqash', 'Kuzatuvchanlik sirlari'],
  },
  {
    id: 'sch-g1-tue-crit',
    dayKey: 'tuesday',
    subjectId: 'critical',
    grade: 1,
    title: 'Shakllar zanjiri va ritm sirlari',
    topic: 'Ketma-ketliklar',
    durationMinutes: 6,
    youtubeId: 'Wd71J2V-z2Q',
    description: 'Doira, uchburchak va kvadratlar qanday tartibda kelayotganini tahlil qilamiz.',
    learningPoints: ['Shakllar almashinishi', 'Keyingi qadamni oldindan ko‘rish', 'Diqqatni jamlash'],
  },
  // Chorshanba: Math + English
  {
    id: 'sch-g1-wed-math',
    dayKey: 'wednesday',
    subjectId: 'math',
    grade: 1,
    title: 'Ayirish mo‘jizasi: Kamayuvchi va ayiriluvchi',
    topic: 'Ayirish (10 gacha)',
    durationMinutes: 6,
    youtubeId: '3A_bX2q1f6E',
    description: 'Narsalarni olib tashlash va orqaga qarab sanash orqali chaqqon ayirish sirlari.',
    learningPoints: ['10 dan orqaga sanash', 'Ayirish amali ma’nosi', 'O‘yinlar orqali tezkor javob'],
  },
  {
    id: 'sch-g1-wed-eng',
    dayKey: 'wednesday',
    subjectId: 'english',
    grade: 1,
    title: 'Hayvonlar olami: Sehrli Zoo park',
    topic: 'Hayvonlar va tabiat',
    durationMinutes: 5,
    youtubeId: 'ea4Tq7k8U5c',
    description: 'Lion, Elephant, Monkey, Cat, Dog — inglizcha hayvonlar bilan tanishamiz va tovushlarini o‘rganamiz.',
    learningPoints: ['Hayvonlar inglizcha nomlari', '"It is a..." jumlasi', 'Qiziqarli mimikalar'],
  },
  // Payshanba: Logic + Critical
  {
    id: 'sch-g1-thu-logic',
    dayKey: 'thursday',
    subjectId: 'logic',
    grade: 1,
    title: 'Sehrli tarozi: Kim og‘ir, kim yengil?',
    topic: 'Taqqoslash va tarozi',
    durationMinutes: 6,
    youtubeId: '4-X2Fj0e-0c',
    description: 'Meva va hayvonlarning og‘irligini tarozining og‘ishiga qarab taqqoslash mahorati.',
    learningPoints: ['Tarozining pastga va tepaga og‘ishi', 'Tenglik tushunchasi', 'Ko‘z bilan chamalash'],
  },
  {
    id: 'sch-g1-thu-crit',
    dayKey: 'thursday',
    subjectId: 'critical',
    grade: 1,
    title: 'Soyalar va siluetlar siri',
    topic: 'Fazoviy shakllar',
    durationMinutes: 5,
    youtubeId: 'y6120QOlsfU',
    description: 'Har bir buyum va hayvonning soyasini uning nozik chiziqlaridan topish.',
    learningPoints: ['Siluetni asl nusxa bilan taqqoslash', 'Shakl konturlarini ilg‘ash', 'Tezkor qiyoslash'],
  },
  // Juma: Math + English
  {
    id: 'sch-g1-fri-math',
    dayKey: 'friday',
    subjectId: 'math',
    grade: 1,
    title: 'Sonlar pillapoyasi: Kattaroq va kichikroq',
    topic: 'Sonlarni taqqoslash',
    durationMinutes: 6,
    youtubeId: 'k42_E7w8S_M',
    description: 'Sonlarni taqqoslash belgilari: >, <, = timsoh og‘zi qoidasi orqali oson yodlash.',
    learningPoints: ['Timsoh og‘zi ochilishi qoidasi', 'Teng sonlar', 'Sonlar o‘qi bo‘ylab yurish'],
  },
  {
    id: 'sch-g1-fri-eng',
    dayKey: 'friday',
    subjectId: 'english',
    grade: 1,
    title: '1 dan 10 gacha quvnoq sanash',
    topic: 'Sonlar va sanoq',
    durationMinutes: 5,
    youtubeId: 'ea4Tq7k8U5c',
    description: 'One, two, three, four, five... inglizcha qo‘shiq bilan 10 gacha xatosiz sanash.',
    learningPoints: ['Numbers from 1 to 10', '"How many?" savoliga javob berish', 'O‘yinchoqlarni sanash'],
  },
  // Shanba: Logic + Critical
  {
    id: 'sch-g1-sat-logic',
    dayKey: 'saturday',
    subjectId: 'logic',
    grade: 1,
    title: 'Labirintdan chiqish: Sherchaga yordam ber!',
    topic: 'Yo‘nalishlar va labirint',
    durationMinutes: 6,
    youtubeId: '4-X2Fj0e-0c',
    description: 'Chigal yo‘laklardan eng to‘g‘ri va xavfsiz yo‘lni topish strategiyasi.',
    learningPoints: ['O‘ng, chap, tepa, past yo‘nalishlari', 'Tupiklarni oldindan ko‘rish', 'Qat’iyatlilik'],
  },
  {
    id: 'sch-g1-sat-crit',
    dayKey: 'saturday',
    subjectId: 'critical',
    grade: 1,
    title: 'Qurilma bo‘laklari: Butun va qism',
    topic: 'Geometrik shakllar',
    durationMinutes: 6,
    youtubeId: 'y6120QOlsfU',
    description: 'Mayda bo‘laklardan katta rasmni hosil qilish va yetishmayotgan qismni topish.',
    learningPoints: ['Tushib qolgan bo‘lakni aniqlash', 'Shakllarni tutashtirish', 'Ertangi testga tayyorgarlik'],
  },

  // ==========================================
  // 2-SINF DARSLARI (O‘YNOQI SHERCHA)
  // ==========================================
  {
    id: 'sch-g2-mon-math',
    dayKey: 'monday',
    subjectId: 'math',
    grade: 2,
    title: '20 ichida tezkor qo‘shish va ayirish',
    topic: 'Qo‘shish (20 gacha)',
    durationMinutes: 7,
    youtubeId: '3A_bX2q1f6E',
    description: 'O‘nlikdan o‘tib qo‘shish siri: 8 + 5 = 8 + 2 + 3 = 13 usuli.',
    learningPoints: ['O‘nlikka to‘ldirish usuli', 'Xotirada 1 ni saqlash', 'Tezkor amaliy mashqlar'],
  },
  {
    id: 'sch-g2-mon-eng',
    dayKey: 'monday',
    subjectId: 'english',
    grade: 2,
    title: 'Mening oilam: Daily Family English',
    topic: 'Oila a’zolari',
    durationMinutes: 6,
    youtubeId: 'ea4Tq7k8U5c',
    description: 'Mother, Father, Brother, Sister, Baby so‘zlarini gapda ishlatish.',
    learningPoints: ['"This is my mother"', 'Sodda oilaviy muloqot', 'Hurmat iboralari'],
  },
  {
    id: 'sch-g2-tue-logic',
    dayKey: 'tuesday',
    subjectId: 'logic',
    grade: 2,
    title: 'Shakllar almashinuvi va qonuniyatlar',
    topic: 'Ketma-ketlik va qonuniyatlar',
    durationMinutes: 7,
    youtubeId: 'Wd71J2V-z2Q',
    description: 'Prezident maktabi imtihonlaridagi shakllar va sonlar ketma-ketligining sirli qonuniyatlari.',
    learningPoints: ['Qadamlar soni', 'Soat mili bo‘yicha harakat', 'Xayoliy aylantirish'],
  },
  {
    id: 'sch-g2-tue-crit',
    dayKey: 'tuesday',
    subjectId: 'critical',
    grade: 2,
    title: 'Aks sado va Ko‘zgu simmetriyasi',
    topic: 'Simmetriya va ko‘zgu',
    durationMinutes: 6,
    youtubeId: 'y6120QOlsfU',
    description: 'Ko‘zguda qaysi tomon o‘zgaradi? O‘ng va chap qanday aks etishini chuqur tahlil qilamiz.',
    learningPoints: ['Simmetriya o‘qi', 'Ko‘zgu akslanishi', 'Shakllar mosligi'],
  },
  {
    id: 'sch-g2-wed-math',
    dayKey: 'wednesday',
    subjectId: 'math',
    grade: 2,
    title: 'Noma’lum qo‘shiluvchini topish formulasi',
    topic: 'Noma’lum qo‘shiluvchi',
    durationMinutes: 7,
    youtubeId: '3A_bX2q1f6E',
    description: 'Yashiringan sonni bir zumda topish: x + 7 = 15 tenglamalari boshlang‘ich sinfda.',
    learningPoints: ['Yig‘indidan ma’lum sonni ayirish', 'Tenglik muvozanati', 'Teskari amal'],
  },
  {
    id: 'sch-g2-wed-eng',
    dayKey: 'wednesday',
    subjectId: 'english',
    grade: 2,
    title: 'Maktab buyumlari: My School Bag',
    topic: 'Maktab buyumlari',
    durationMinutes: 6,
    youtubeId: 'Ocvw0f8jEa4',
    description: 'Pen, pencil, ruler, eraser, book, bag so‘zlarini amalda qo‘llaymiz.',
    learningPoints: ['"I have a pencil"', 'Rang va buyumni birga aytish', 'Buyruq gaplar'],
  },
  {
    id: 'sch-g2-thu-logic',
    dayKey: 'thursday',
    subjectId: 'logic',
    grade: 2,
    title: 'Vaqt mashinasi: Soat va daqiqalar',
    topic: 'Vaqt va soat masalalari',
    durationMinutes: 7,
    youtubeId: '4-X2Fj0e-0c',
    description: 'Katta va kichik millar, yarim soat va 15 daqiqalik intervallarni o‘rganish.',
    learningPoints: ['Soat millari vazifasi', 'Vaqt o‘tishini hisoblash', 'Prezident maktabi vaqt masalalari'],
  },
  {
    id: 'sch-g2-thu-crit',
    dayKey: 'thursday',
    subjectId: 'critical',
    grade: 2,
    title: 'Rasm ostidagi sirlar: Haqiqatmi yoki uydirma?',
    topic: 'Mantiqiy xulosa',
    durationMinutes: 6,
    youtubeId: 'y6120QOlsfU',
    description: 'Matn va rasmga qarab qaysi gap haqiqat, qaysi biri yolg‘on ekanini tekshirish.',
    learningPoints: ['Fakt va taxminni ajratish', 'Dalillarga tayanish', 'Tanqidiy baholash'],
  },
  {
    id: 'sch-g2-fri-math',
    dayKey: 'friday',
    subjectId: 'math',
    grade: 2,
    title: 'Geometriya olami: Perimetrga ilk qadam',
    topic: 'Geometrik shakllar',
    durationMinutes: 7,
    youtubeId: 'k42_E7w8S_M',
    description: 'Ko‘pburchaklarning tomonlari uzunligini o‘lchash va perimetrini topish.',
    learningPoints: ['Tomonlar uzunligi yig‘indisi', 'To‘g‘ri to‘rtburchak sirlari', 'Chizg‘ichdan foydalanish'],
  },
  {
    id: 'sch-g2-fri-eng',
    dayKey: 'friday',
    subjectId: 'english',
    grade: 2,
    title: 'Harakat fe’llari: Run, Jump, Sing, Read',
    topic: 'Harakat fe’llari',
    durationMinutes: 6,
    youtubeId: 'ea4Tq7k8U5c',
    description: 'Harakatlarni ifodalash va "I can swim / I can read" jumlalarini tuzish.',
    learningPoints: ['Can modal fe’li', 'Sevimli mashg‘ulotlar', 'Qiziqarli mimika o‘yini'],
  },
  {
    id: 'sch-g2-sat-logic',
    dayKey: 'saturday',
    subjectId: 'logic',
    grade: 2,
    title: 'Sehrli kvadratlar: Yig‘indisi bir xil qatorlar',
    topic: 'Sehrli kvadratlar',
    durationMinutes: 7,
    youtubeId: '4-X2Fj0e-0c',
    description: 'Har tomonga qo‘shganda 15 chiqishi kerak bo‘lgan 3x3 jadval sirlari.',
    learningPoints: ['Markazdagi son siri', 'Qator va ustunlar muvozanati', 'Xotirani charxlash'],
  },
  {
    id: 'sch-g2-sat-crit',
    dayKey: 'saturday',
    subjectId: 'critical',
    grade: 2,
    title: 'Tugallanmagan shakllar va fazoviy mantiq',
    topic: 'Fazoviy shakllar',
    durationMinutes: 6,
    youtubeId: 'y6120QOlsfU',
    description: 'Chala qolgan chizmalarni to‘ldirib, bir butun buyumni ko‘rish san’ati.',
    learningPoints: ['Shaklni xayolda to‘ldirish', 'Burchaklar va egri chiziqlar', 'Yakshanba testiga tayyorgarlik'],
  },

  // ==========================================
  // 3-SINF DARSLARI (O‘SMIR SHER)
  // ==========================================
  {
    id: 'sch-g3-mon-math',
    dayKey: 'monday',
    subjectId: 'math',
    grade: 3,
    title: 'Gaus usuli: Katta sonlarni 5 soniyada qo‘shish',
    topic: 'Tezkor hisoblash',
    durationMinutes: 7,
    youtubeId: 'k42_E7w8S_M',
    description: '1 dan 100 gacha bo‘lgan sonlarni juftlash orqali zumda hisoblash usuli.',
    learningPoints: ['Bosh va oxirgi sonlarni juftlash', 'Formulasiz tezkor hisob', 'Prezident maktabi usullari'],
  },
  {
    id: 'sch-g3-mon-eng',
    dayKey: 'monday',
    subjectId: 'english',
    grade: 3,
    title: 'To Be sehrli kaliti: Am, Is, Are va Sifatlar',
    topic: 'To Be fe’li va sifatlar',
    durationMinutes: 7,
    youtubeId: 'Ocvw0f8jEa4',
    description: 'Gap tuzishda to be fe’lidan xatosiz foydalanish va narsalarni ta’riflash.',
    learningPoints: ['Am, Is, Are farqlari', 'Big/Small, Fast/Slow sifatlari', 'To‘g‘ri gap tartibi'],
  },
  {
    id: 'sch-g3-tue-logic',
    dayKey: 'tuesday',
    subjectId: 'logic',
    grade: 3,
    title: 'Kombinatorika: Necha xil usulda tanlash mumkin?',
    topic: 'Kombinatorika va variantlar',
    durationMinutes: 8,
    youtubeId: '4-X2Fj0e-0c',
    description: '3 ta ko‘ylak va 2 ta shimdan necha xil kiyinish mumkin? Ko‘paytirish qoidasi.',
    learningPoints: ['Variantlar daraxti', 'Ko‘paytirish orqali topish', 'Hech birini qoldirmasdan hisoblash'],
  },
  {
    id: 'sch-g3-tue-crit',
    dayKey: 'tuesday',
    subjectId: 'critical',
    grade: 3,
    title: 'Mantiqiy zanjirlar: Kim qayerda yashaydi?',
    topic: 'Mantiqiy jadval masalalari',
    durationMinutes: 7,
    youtubeId: 'Wd71J2V-z2Q',
    description: 'Ali, Vali va G‘anining kasblarini shartlar jadvali tuzib yechish siri.',
    learningPoints: ['Jadval usuli (+) va (-)', 'Zid shartlarni yo‘qotish', 'Xulosa chiqarish'],
  },
  {
    id: 'sch-g3-wed-math',
    dayKey: 'wednesday',
    subjectId: 'math',
    grade: 3,
    title: 'Ko‘paytirish va bo‘lish: Qoldiqli bo‘lish sirlari',
    topic: 'Qoldiqli bo‘lish',
    durationMinutes: 7,
    youtubeId: 'k42_E7w8S_M',
    description: 'Qoldiq doimo bo‘luvchidan kichik bo‘lishi qoidasi va hayotiy masalalar.',
    learningPoints: ['Qoldiq qoidasi', 'Teng taqsimlash', 'Tekshirish formulasi'],
  },
  {
    id: 'sch-g3-wed-eng',
    dayKey: 'wednesday',
    subjectId: 'english',
    grade: 3,
    title: 'Present Simple: Har kungi odatlarimiz',
    topic: 'Kundalik fe’llar',
    durationMinutes: 7,
    youtubeId: 'Ocvw0f8jEa4',
    description: '"I wake up at 7:00, he plays football" — kundalik fe’llarni to‘g‘ri qo‘llash.',
    learningPoints: ['He/She/It uchun -s qo‘shimchasi', 'Kun tartibini inglizcha aytish', 'Inkor gaplar'],
  },
  {
    id: 'sch-g3-thu-logic',
    dayKey: 'thursday',
    subjectId: 'logic',
    grade: 3,
    title: 'Yolg‘onchilar va haqgo‘ylar oroli',
    topic: 'Ritsarlar va yolg‘onchilar',
    durationMinutes: 8,
    youtubeId: '4-X2Fj0e-0c',
    description: 'Biri doim haqiqat, ikkinchisi doim yolg‘on aytadigan jumboqli orol masalalari.',
    learningPoints: ['Faraz qilish usuli', 'Qarama-qarshilikni aniqlash', 'Prezident maktabi imtihon savollari'],
  },
  {
    id: 'sch-g3-thu-crit',
    dayKey: 'thursday',
    subjectId: 'critical',
    grade: 3,
    title: '3D kub yoyilmalari: Qaysi rasm hosil bo‘ladi?',
    topic: 'Kub yoyilmalari',
    durationMinutes: 7,
    youtubeId: 'y6120QOlsfU',
    description: 'Qog‘oz yoyilmasini xayolan buklab quti yasash va qarama-qarshi tomonlarni topish.',
    learningPoints: ['Qarama-qarshi yoqlar qoidasi', 'Xayolan buklash', 'Fazoviy nigoh'],
  },
  {
    id: 'sch-g3-fri-math',
    dayKey: 'friday',
    subjectId: 'math',
    grade: 3,
    title: 'Yuzani hisoblash: To‘g‘ri to‘rtburchak va Kvadrat',
    topic: 'Yuzani hisoblash',
    durationMinutes: 7,
    youtubeId: 'k42_E7w8S_M',
    description: 'S = a * b formulasi va polga gilam yotqizish kabi hayotiy masalalar.',
    learningPoints: ['Kvadrat santimetr tushunchasi', 'Murakkab shakllar yuzasi', 'Perimetrdan farqi'],
  },
  {
    id: 'sch-g3-fri-eng',
    dayKey: 'friday',
    subjectId: 'english',
    grade: 3,
    title: 'Qiyoslash darajalari: Faster, Bigger, Stronger',
    topic: 'Sifat darajalari',
    durationMinutes: 6,
    youtubeId: 'ea4Tq7k8U5c',
    description: '"Cheetah is faster than lion" — hayvonlar va narsalarni taqqoslash.',
    learningPoints: ['-er qo‘shimchasi', '"Than" bog‘lovchisi', 'Prezident maktabi testlaridagi sifatlar'],
  },
  {
    id: 'sch-g3-sat-logic',
    dayKey: 'saturday',
    subjectId: 'logic',
    grade: 3,
    title: 'Taqvim masalalari: Bugun dushanba bo‘lsa, 100 kundan keyin...?',
    topic: 'Taqvim va davriylik',
    durationMinutes: 8,
    youtubeId: '4-X2Fj0e-0c',
    description: '7 kunlik davriylik orqali kelajakdagi kunni 5 soniyada aytib berish usuli.',
    learningPoints: ['7 ga bo‘lish va qoldiqni hisoblash', 'Taqvim sirini ochish', 'Og‘zaki hisoblash'],
  },
  {
    id: 'sch-g3-sat-crit',
    dayKey: 'saturday',
    subjectId: 'critical',
    grade: 3,
    title: 'Matnni chuqur tahlil qilish: Asosiy fikr qayerda?',
    topic: 'Analitik xulosa',
    durationMinutes: 7,
    youtubeId: 'Wd71J2V-z2Q',
    description: 'Kichik hikoyadan muallif nima demoqchi bo‘lganini anglash va asosiy xulosani topish.',
    learningPoints: ['Kalit so‘zlarni topish', 'Ikkinchi darajali fikrlarni chetga surish', 'Xulosa yasash'],
  },

  // ==========================================
  // 4-SINF DARSLARI (QIROL SHER — PREZIDENT MAKTABIGA TAYYORGARLIK)
  // ==========================================
  {
    id: 'sch-g4-mon-math',
    dayKey: 'monday',
    subjectId: 'math',
    grade: 4,
    title: 'Harakatga doir masalalar: Tezlik, Vaqt va Masofa',
    topic: 'Harakat masalalari',
    durationMinutes: 8,
    youtubeId: 'k42_E7w8S_M',
    description: 'S = V * t sehrli uchburchagi: qarama-qarshi va bir yo‘nalishdagi harakatlar tahlili.',
    learningPoints: ['Yaqinlashish tezligi', 'Uzoqlashish tezligi', 'Chizmalar bilan ishlash'],
  },
  {
    id: 'sch-g4-mon-eng',
    dayKey: 'monday',
    subjectId: 'english',
    grade: 4,
    title: 'Prezident maktabiga tayyorlov: Reading & Scanning',
    topic: 'Reading & Vocabulary',
    durationMinutes: 8,
    youtubeId: '98_C4QzT8c8',
    description: 'Matnni to‘liq o‘qimasdan savol javobini 15 soniyada skanerlash texnikasi.',
    learningPoints: ['Scanning va Skimming usullari', 'Sinonimlarni payqash', 'Vaqtni tejash'],
  },
  {
    id: 'sch-g4-tue-logic',
    dayKey: 'tuesday',
    subjectId: 'logic',
    grade: 4,
    title: 'Eyler doiralari va to‘plamlar bilan masalalar',
    topic: 'Eyler doiralari',
    durationMinutes: 9,
    youtubeId: 'dQw4w9WgXcQ',
    description: 'Qaysi o‘quvchi ingliz tili, qaysi biri shaxmat to‘garagiga boradi? Murakkab masalalarni doiralar bilan bir zumda yeching.',
    learningPoints: ['Eyler doiralarini kesishtirish', 'Umumiy qismni ayirish', 'PM 4-sinf imtihon savollari'],
  },
  {
    id: 'sch-g4-tue-crit',
    dayKey: 'tuesday',
    subjectId: 'critical',
    grade: 4,
    title: 'Fazoviy tasavvur: Qirqilgan kublar va shakllar',
    topic: 'Fazoviy shakllar',
    durationMinutes: 8,
    youtubeId: 'y6120QOlsfU',
    description: 'Katta bo‘yalgan kub 27 ta kichik kubchalarga bo‘linganda 1, 2 yoki 3 tomoni bo‘yalganlarini topish.',
    learningPoints: ['Uchlar, qirralar va yoqlardagi kubchalar', 'Ko‘rinmas kublarni hisoblash', 'PM testlari tahlili'],
  },
  {
    id: 'sch-g4-wed-math',
    dayKey: 'wednesday',
    subjectId: 'math',
    grade: 4,
    title: 'Kasrlar va ulushlar: Butunning qismini topish',
    topic: 'Kasrlar va ulushlar',
    durationMinutes: 8,
    youtubeId: 'k42_E7w8S_M',
    description: 'Sonning kasrini va kasriga ko‘ra sonning o‘zini topishning Prezident maktabi sirlari.',
    learningPoints: ['Maxraj va surat ma’nosi', 'Bo‘laklarga bo‘lib ko‘paytirish', 'Amaliy masalalar'],
  },
  {
    id: 'sch-g4-wed-eng',
    dayKey: 'wednesday',
    subjectId: 'english',
    grade: 4,
    title: 'Past Simple: Tarix va o‘tgan zamon hikoyalari',
    topic: 'Past Simple',
    durationMinutes: 8,
    youtubeId: '98_C4QzT8c8',
    description: 'Noto‘g‘ri fe’llar (went, saw, ate) va hikoyani o‘tgan zamonda so‘zlash qobiliyati.',
    learningPoints: ['Did yordamchi fe’li', 'Ko‘p ishlatiladigan noto‘g‘ri fe’llar', 'Matnli testlarni yechish'],
  },
  {
    id: 'sch-g4-thu-logic',
    dayKey: 'thursday',
    subjectId: 'logic',
    grade: 4,
    title: 'Dirixle prinsipi: Qafaslar va quyonlar',
    topic: 'Dirixle prinsipi',
    durationMinutes: 9,
    youtubeId: '4-X2Fj0e-0c',
    description: 'Agar 5 ta qafasga 6 ta quyon qamalsa, kamida bitta qafasda 2 ta quyon bo‘lishi isboti.',
    learningPoints: ['Eng yomon holat strategiyasi', 'Kafolatlangan xulosa', 'Olimpiada va PM savollari'],
  },
  {
    id: 'sch-g4-thu-crit',
    dayKey: 'thursday',
    subjectId: 'critical',
    grade: 4,
    title: 'Sabab va oqibat: Chalkash zanjirlarni yechish',
    topic: 'Sabab-oqibat tahlili',
    durationMinutes: 8,
    youtubeId: 'Wd71J2V-z2Q',
    description: 'Qaysi hodisa sabab, qaysi biri oqibat ekanligini chuqur tahliliy ko‘z bilan aniqlash.',
    learningPoints: ['Voqealar xronologiyasi', 'Mantiqiy uzviylik', 'Xato xulosalarni inkor qilish'],
  },
  {
    id: 'sch-g4-fri-math',
    dayKey: 'friday',
    subjectId: 'math',
    grade: 4,
    title: 'O‘rta arifmetik va statistika',
    topic: 'O‘rta arifmetik',
    durationMinutes: 8,
    youtubeId: 'k42_E7w8S_M',
    description: 'Baholar o‘rtachasi, tezliklar o‘rtachasi va umumiy ko‘rsatkichlarni hisoblash.',
    learningPoints: ['Yig‘indini songa bo‘lish', 'Og‘zaki tezkor hisob', 'Real hayotiy misollar'],
  },
  {
    id: 'sch-g4-fri-eng',
    dayKey: 'friday',
    subjectId: 'english',
    grade: 4,
    title: 'Odd-one-out va Sinonimlar sinovi',
    topic: 'Odd-one-out & Vocabulary',
    durationMinutes: 7,
    youtubeId: '98_C4QzT8c8',
    description: 'Ma’no jihatdan mos kelmaydigan so‘zni topish va so‘z boyligini kengaytirish.',
    learningPoints: ['Mavzuga doir so‘z guruhlari', 'Antonim va sinonimlar', 'PM test uslubi'],
  },
  {
    id: 'sch-g4-sat-logic',
    dayKey: 'saturday',
    subjectId: 'logic',
    grade: 4,
    title: 'Hovuz va quvurlar masalasi: Birgalikda ishlash',
    topic: 'Birgalikda ishlash masalalari',
    durationMinutes: 9,
    youtubeId: '4-X2Fj0e-0c',
    description: 'Ikkita quvur birga ochilsa hovuz necha soatda to‘ladi? 1 soatda bajarilgan qism siri.',
    learningPoints: ['Mehnat unumdorligi', 'Kasrlar orqali yechish', 'Imtihon savollari'],
  },
  {
    id: 'sch-g4-sat-crit',
    dayKey: 'saturday',
    subjectId: 'critical',
    grade: 4,
    title: 'Prezident maktabi imtihoniga to‘liq tayyorgarlik',
    topic: 'Kompleks tanqidiy fikrlash',
    durationMinutes: 8,
    youtubeId: 'y6120QOlsfU',
    description: 'Ertangi Katta Yakshanba Testiga kirish oldidan strategiya, vaqt taqsimoti va diqqatni jamlash sirlari.',
    learningPoints: ['Savolni diqqat bilan o‘qish', 'Noto‘g‘ri javoblarni yo‘qotish (elimination)', 'O‘z kuchiga ishonch'],
  },
];

/**
 * ========================================================
 * YORDAMCHI FUNKSIYALAR
 * ========================================================
 */

/**
 * Berilgan sinf va kun bo'yicha belgilangan darslarni olish (odatda 2 ta dars)
 */
export function getScheduledLessonsForDay(grade: GradeLevel, dayKey: DayOfWeekKey): ScheduledLesson[] {
  return SCHEDULED_LESSONS.filter((l) => l.grade === grade && l.dayKey === dayKey);
}

/**
 * Berilgan sinf uchun butun haftaning barcha 12 ta darsini olish
 */
export function getScheduledLessonsForWeek(grade: GradeLevel): ScheduledLesson[] {
  return SCHEDULED_LESSONS.filter((l) => l.grade === grade);
}

/**
 * ID bo'yicha belgilangan darsni topish
 */
export function getScheduledLessonById(lessonId: string): ScheduledLesson | undefined {
  return SCHEDULED_LESSONS.find((l) => l.id === lessonId);
}

/**
 * Yakshanba Haftalik Katta Testi uchun 20 ta savolni tanlab berish:
 * Har bir 4 ta fandan aynan 5 tadan savol!
 * Savollar shu haftada o'tilgan mavzulardan (topics) saralanadi.
 */
export function getWeeklyExamQuestions(grade: GradeLevel): QuizQuestion[] {
  const subjects: SubjectId[] = ['math', 'logic', 'critical', 'english'];
  const weekLessons = getScheduledLessonsForWeek(grade);
  const examQuestions: QuizQuestion[] = [];

  subjects.forEach((subj) => {
    // Shu fanga tegishli haftalik darslarning topiclari
    const subjLessons = weekLessons.filter((l) => l.subjectId === subj);
    const topics = subjLessons.map((l) => l.topic.toLowerCase());

    // Savollar bazasidan shu sinf va shu fanga tegishli savollar
    const candidateQuestions = ALL_QUIZ_QUESTIONS.filter(
      (q) => q.grade === grade && q.subjectId === subj
    );

    // Birinchi navbatda shu haftadagi mavzularga mos savollar
    const topicMatched = candidateQuestions.filter((q) => {
      const qTopic = (q.topic || '').toLowerCase();
      return topics.some((t) => qTopic.includes(t) || t.includes(qTopic));
    });

    // Qolgan savollar
    const remaining = candidateQuestions.filter((q) => !topicMatched.includes(q));

    // Birlashtirib, deterministik / random usulda 5 ta savol olamiz
    const pool = [...topicMatched, ...remaining];

    // Har xil qiyinlik darajasidan (oson, o'rta, qiyin) 5 ta tanlash
    const selected: QuizQuestion[] = [];
    const usedIds = new Set<string>();

    for (const q of pool) {
      if (!usedIds.has(q.id)) {
        selected.push(q);
        usedIds.add(q.id);
        if (selected.length === 5) break;
      }
    }

    // Agar 5 taga yetmasa, kandidatlardan to'ldiramiz
    if (selected.length < 5) {
      for (const q of candidateQuestions) {
        if (!usedIds.has(q.id)) {
          selected.push(q);
          usedIds.add(q.id);
          if (selected.length === 5) break;
        }
      }
    }

    examQuestions.push(...selected);
  });

  return examQuestions;
}
