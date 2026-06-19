export const SURAHS = [
  {
    id: 1,
    name: 'Al-Fatiha',
    arabicName: 'الفاتحة',
    totalVerses: 7,
    description: 'The Opening — recited in every prayer',
    locked: false,
    verses: [
      {
        id: 1,
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        translation: 'In the name of Allah, the Most Gracious, the Most Merciful',
        words: [
          { arabic: 'بِسْمِ', meaning: 'In the name', tajweed: [] },
          { arabic: 'اللَّهِ', meaning: 'of Allah', tajweed: [] },
          { arabic: 'الرَّحْمَٰنِ', meaning: 'the Most Gracious', tajweed: ['madd'] },
          { arabic: 'الرَّحِيمِ', meaning: 'the Most Merciful', tajweed: ['madd'] },
        ]
      },
      {
        id: 2,
        arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        translation: 'All praise is for Allah, Lord of all worlds',
        words: [
          { arabic: 'الْحَمْدُ', meaning: 'All praise', tajweed: [] },
          { arabic: 'لِلَّهِ', meaning: 'is for Allah', tajweed: [] },
          { arabic: 'رَبِّ', meaning: 'Lord of', tajweed: ['shaddah'] },
          { arabic: 'الْعَالَمِينَ', meaning: 'all worlds', tajweed: ['madd'] },
        ]
      },
      {
        id: 3,
        arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
        translation: 'The Most Gracious, the Most Merciful',
        words: [
          { arabic: 'الرَّحْمَٰنِ', meaning: 'The Most Gracious', tajweed: ['madd'] },
          { arabic: 'الرَّحِيمِ', meaning: 'the Most Merciful', tajweed: ['madd'] },
        ]
      },
      {
        id: 4,
        arabic: 'مَالِكِ يَوْمِ الدِّينِ',
        translation: 'Master of the Day of Judgment',
        words: [
          { arabic: 'مَالِكِ', meaning: 'Master of', tajweed: ['madd'] },
          { arabic: 'يَوْمِ', meaning: 'the Day', tajweed: [] },
          { arabic: 'الدِّينِ', meaning: 'of Judgment', tajweed: ['madd'] },
        ]
      },
      {
        id: 5,
        arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        translation: 'You alone we worship, You alone we ask for help',
        words: [
          { arabic: 'إِيَّاكَ', meaning: 'You alone', tajweed: ['shaddah'] },
          { arabic: 'نَعْبُدُ', meaning: 'we worship', tajweed: [] },
          { arabic: 'وَإِيَّاكَ', meaning: 'and You alone', tajweed: ['shaddah'] },
          { arabic: 'نَسْتَعِينُ', meaning: 'we ask for help', tajweed: ['madd'] },
        ]
      },
      {
        id: 6,
        arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        translation: 'Guide us on the straight path',
        words: [
          { arabic: 'اهْدِنَا', meaning: 'Guide us', tajweed: [] },
          { arabic: 'الصِّرَاطَ', meaning: 'on the path', tajweed: ['madd'] },
          { arabic: 'الْمُسْتَقِيمَ', meaning: 'the straight', tajweed: ['madd'] },
        ]
      },
      {
        id: 7,
        arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        translation: 'The path of those You have blessed, not of those who are condemned, nor those who go astray',
        words: [
          { arabic: 'صِرَاطَ', meaning: 'The path of', tajweed: ['madd'] },
          { arabic: 'الَّذِينَ', meaning: 'those who', tajweed: ['madd'] },
          { arabic: 'أَنْعَمْتَ', meaning: 'You blessed', tajweed: [] },
          { arabic: 'عَلَيْهِمْ', meaning: 'upon them', tajweed: [] },
          { arabic: 'غَيْرِ', meaning: 'not those', tajweed: [] },
          { arabic: 'الْمَغْضُوبِ', meaning: 'who are condemned', tajweed: ['madd'] },
          { arabic: 'وَلَا', meaning: 'and not', tajweed: ['madd'] },
          { arabic: 'الضَّالِّينَ', meaning: 'those who go astray', tajweed: ['madd', 'shaddah'] },
        ]
      },
    ]
  },
  {
    id: 103,
    name: 'Al-Asr',
    arabicName: 'العصر',
    totalVerses: 3,
    description: 'By Time — the formula for success',
    locked: false,
    verses: [
      {
        id: 1,
        arabic: 'وَالْعَصْرِ',
        translation: 'By time',
        words: [
          { arabic: 'وَالْعَصْرِ', meaning: 'By time', tajweed: [] },
        ]
      },
      {
        id: 2,
        arabic: 'إِنَّ الْإِنسَانَ لَفِي خُسْرٍ',
        translation: 'Indeed mankind is in loss',
        words: [
          { arabic: 'إِنَّ', meaning: 'Indeed', tajweed: ['ghunnah'] },
          { arabic: 'الْإِنسَانَ', meaning: 'mankind', tajweed: [] },
          { arabic: 'لَفِي', meaning: 'is surely in', tajweed: [] },
          { arabic: 'خُسْرٍ', meaning: 'loss', tajweed: ['tanwin'] },
        ]
      },
      {
        id: 3,
        arabic: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ',
        translation: 'Except those who believe, do good, urge truth and urge patience',
        words: [
          { arabic: 'إِلَّا', meaning: 'Except', tajweed: [] },
          { arabic: 'الَّذِينَ', meaning: 'those who', tajweed: ['madd'] },
          { arabic: 'آمَنُوا', meaning: 'believe', tajweed: ['madd'] },
          { arabic: 'وَعَمِلُوا', meaning: 'and do', tajweed: [] },
          { arabic: 'الصَّالِحَاتِ', meaning: 'good deeds', tajweed: [] },
          { arabic: 'وَتَوَاصَوْا', meaning: 'and urge one another', tajweed: [] },
          { arabic: 'بِالْحَقِّ', meaning: 'to truth', tajweed: ['shaddah'] },
          { arabic: 'بِالصَّبْرِ', meaning: 'to patience', tajweed: [] },
        ]
      },
    ]
  },
  {
    id: 108,
    name: 'Al-Kawthar',
    arabicName: 'الكوثر',
    totalVerses: 3,
    description: 'The Abundance — a gift to the Prophet',
    locked: false,
    verses: [
      {
        id: 1,
        arabic: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
        translation: 'Indeed We have granted you Al-Kawthar',
        words: [
          { arabic: 'إِنَّا', meaning: 'Indeed We', tajweed: ['ghunnah'] },
          { arabic: 'أَعْطَيْنَاكَ', meaning: 'have granted you', tajweed: ['madd'] },
          { arabic: 'الْكَوْثَرَ', meaning: 'Al-Kawthar (the abundance)', tajweed: [] },
        ]
      },
      {
        id: 2,
        arabic: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ',
        translation: 'So pray to your Lord and sacrifice',
        words: [
          { arabic: 'فَصَلِّ', meaning: 'So pray', tajweed: ['shaddah'] },
          { arabic: 'لِرَبِّكَ', meaning: 'to your Lord', tajweed: ['shaddah'] },
          { arabic: 'وَانْحَرْ', meaning: 'and sacrifice', tajweed: [] },
        ]
      },
      {
        id: 3,
        arabic: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ',
        translation: 'Indeed your enemy is the one cut off',
        words: [
          { arabic: 'إِنَّ', meaning: 'Indeed', tajweed: ['ghunnah'] },
          { arabic: 'شَانِئَكَ', meaning: 'your enemy', tajweed: [] },
          { arabic: 'هُوَ', meaning: 'he is', tajweed: [] },
          { arabic: 'الْأَبْتَرُ', meaning: 'the one cut off', tajweed: [] },
        ]
      },
    ]
  },
  {
    id: 110,
    name: 'An-Nasr',
    arabicName: 'النصر',
    totalVerses: 3,
    description: 'The Help — the last complete surah revealed',
    locked: false,
    verses: [
      {
        id: 1,
        arabic: 'إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ',
        translation: 'When the help of Allah comes and the victory',
        words: [
          { arabic: 'إِذَا', meaning: 'When', tajweed: [] },
          { arabic: 'جَاءَ', meaning: 'comes', tajweed: ['madd'] },
          { arabic: 'نَصْرُ', meaning: 'the help', tajweed: [] },
          { arabic: 'اللَّهِ', meaning: 'of Allah', tajweed: [] },
          { arabic: 'وَالْفَتْحُ', meaning: 'and the victory', tajweed: [] },
        ]
      },
      {
        id: 2,
        arabic: 'وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا',
        translation: 'And you see people entering Allah\'s religion in crowds',
        words: [
          { arabic: 'وَرَأَيْتَ', meaning: 'And you see', tajweed: [] },
          { arabic: 'النَّاسَ', meaning: 'the people', tajweed: ['ghunnah'] },
          { arabic: 'يَدْخُلُونَ', meaning: 'entering', tajweed: [] },
          { arabic: 'فِي دِينِ', meaning: 'into the religion', tajweed: [] },
          { arabic: 'اللَّهِ', meaning: 'of Allah', tajweed: [] },
          { arabic: 'أَفْوَاجًا', meaning: 'in crowds', tajweed: ['tanwin'] },
        ]
      },
      {
        id: 3,
        arabic: 'فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ إِنَّهُ كَانَ تَوَّابًا',
        translation: 'Then glorify your Lord and seek His forgiveness — He is ever accepting of repentance',
        words: [
          { arabic: 'فَسَبِّحْ', meaning: 'Then glorify', tajweed: ['shaddah'] },
          { arabic: 'بِحَمْدِ', meaning: 'with praise', tajweed: [] },
          { arabic: 'رَبِّكَ', meaning: 'of your Lord', tajweed: ['shaddah'] },
          { arabic: 'وَاسْتَغْفِرْهُ', meaning: 'and seek His forgiveness', tajweed: [] },
          { arabic: 'إِنَّهُ', meaning: 'Indeed He', tajweed: ['ghunnah'] },
          { arabic: 'تَوَّابًا', meaning: 'is accepting of repentance', tajweed: ['shaddah', 'tanwin'] },
        ]
      },
    ]
  },
  {
    id: 112,
    name: 'Al-Ikhlas',
    arabicName: 'الإخلاص',
    totalVerses: 4,
    description: 'The Sincerity — equals one third of the Quran',
    locked: false,
    verses: [
      {
        id: 1,
        arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        translation: 'Say, He is Allah, One',
        words: [
          { arabic: 'قُلْ', meaning: 'Say', tajweed: ['qalqalah'] },
          { arabic: 'هُوَ', meaning: 'He is', tajweed: [] },
          { arabic: 'اللَّهُ', meaning: 'Allah', tajweed: [] },
          { arabic: 'أَحَدٌ', meaning: 'One', tajweed: ['tanwin'] },
        ]
      },
      {
        id: 2,
        arabic: 'اللَّهُ الصَّمَدُ',
        translation: 'Allah, the Eternal Refuge',
        words: [
          { arabic: 'اللَّهُ', meaning: 'Allah', tajweed: [] },
          { arabic: 'الصَّمَدُ', meaning: 'the Eternal Refuge', tajweed: [] },
        ]
      },
      {
        id: 3,
        arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
        translation: 'He neither begets nor was born',
        words: [
          { arabic: 'لَمْ', meaning: 'He did not', tajweed: [] },
          { arabic: 'يَلِدْ', meaning: 'beget', tajweed: ['qalqalah'] },
          { arabic: 'وَلَمْ', meaning: 'and was not', tajweed: [] },
          { arabic: 'يُولَدْ', meaning: 'born', tajweed: ['qalqalah', 'madd'] },
        ]
      },
      {
        id: 4,
        arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        translation: 'And there is none equal to Him',
        words: [
          { arabic: 'وَلَمْ', meaning: 'And there is not', tajweed: [] },
          { arabic: 'يَكُن', meaning: 'equal', tajweed: [] },
          { arabic: 'لَّهُ', meaning: 'to Him', tajweed: [] },
          { arabic: 'كُفُوًا', meaning: 'any equivalent', tajweed: ['tanwin'] },
          { arabic: 'أَحَدٌ', meaning: 'anyone', tajweed: ['tanwin'] },
        ]
      },
    ]
  },
  {
    id: 113,
    name: 'Al-Falaq',
    arabicName: 'الفلق',
    totalVerses: 5,
    description: 'The Daybreak — seeking refuge from evil',
    locked: false,
    verses: [
      {
        id: 1,
        arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
        translation: 'Say, I seek refuge with the Lord of daybreak',
        words: [
          { arabic: 'قُلْ', meaning: 'Say', tajweed: ['qalqalah'] },
          { arabic: 'أَعُوذُ', meaning: 'I seek refuge', tajweed: ['madd'] },
          { arabic: 'بِرَبِّ', meaning: 'with the Lord', tajweed: ['shaddah'] },
          { arabic: 'الْفَلَقِ', meaning: 'of daybreak', tajweed: [] },
        ]
      },
      {
        id: 2,
        arabic: 'مِن شَرِّ مَا خَلَقَ',
        translation: 'From the evil of what He created',
        words: [
          { arabic: 'مِن شَرِّ', meaning: 'From the evil', tajweed: ['ghunnah', 'shaddah'] },
          { arabic: 'مَا', meaning: 'of what', tajweed: [] },
          { arabic: 'خَلَقَ', meaning: 'He created', tajweed: [] },
        ]
      },
      {
        id: 3,
        arabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
        translation: 'And from the evil of darkness when it settles',
        words: [
          { arabic: 'وَمِن شَرِّ', meaning: 'And from the evil', tajweed: ['ghunnah'] },
          { arabic: 'غَاسِقٍ', meaning: 'of darkness', tajweed: ['madd', 'tanwin'] },
          { arabic: 'إِذَا', meaning: 'when', tajweed: [] },
          { arabic: 'وَقَبَ', meaning: 'it settles', tajweed: [] },
        ]
      },
      {
        id: 4,
        arabic: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
        translation: 'And from the evil of those who blow on knots',
        words: [
          { arabic: 'وَمِن شَرِّ', meaning: 'And from the evil', tajweed: ['ghunnah'] },
          { arabic: 'النَّفَّاثَاتِ', meaning: 'of those who blow', tajweed: ['ghunnah', 'shaddah'] },
          { arabic: 'فِي الْعُقَدِ', meaning: 'on knots', tajweed: [] },
        ]
      },
      {
        id: 5,
        arabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
        translation: 'And from the evil of an envier when he envies',
        words: [
          { arabic: 'وَمِن شَرِّ', meaning: 'And from the evil', tajweed: ['ghunnah'] },
          { arabic: 'حَاسِدٍ', meaning: 'of an envier', tajweed: ['madd', 'tanwin'] },
          { arabic: 'إِذَا', meaning: 'when', tajweed: [] },
          { arabic: 'حَسَدَ', meaning: 'he envies', tajweed: [] },
        ]
      },
    ]
  },
  {
    id: 114,
    name: 'An-Nas',
    arabicName: 'الناس',
    totalVerses: 6,
    description: 'Mankind — seeking refuge from whisperers',
    locked: false,
    verses: [
      {
        id: 1,
        arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
        translation: 'Say, I seek refuge with the Lord of mankind',
        words: [
          { arabic: 'قُلْ', meaning: 'Say', tajweed: ['qalqalah'] },
          { arabic: 'أَعُوذُ', meaning: 'I seek refuge', tajweed: ['madd'] },
          { arabic: 'بِرَبِّ', meaning: 'with the Lord', tajweed: ['shaddah'] },
          { arabic: 'النَّاسِ', meaning: 'of mankind', tajweed: ['ghunnah', 'madd'] },
        ]
      },
      {
        id: 2,
        arabic: 'مَلِكِ النَّاسِ',
        translation: 'The Sovereign of mankind',
        words: [
          { arabic: 'مَلِكِ', meaning: 'The Sovereign', tajweed: [] },
          { arabic: 'النَّاسِ', meaning: 'of mankind', tajweed: ['ghunnah', 'madd'] },
        ]
      },
      {
        id: 3,
        arabic: 'إِلَٰهِ النَّاسِ',
        translation: 'The God of mankind',
        words: [
          { arabic: 'إِلَٰهِ', meaning: 'The God', tajweed: ['madd'] },
          { arabic: 'النَّاسِ', meaning: 'of mankind', tajweed: ['ghunnah', 'madd'] },
        ]
      },
      {
        id: 4,
        arabic: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
        translation: 'From the evil of the retreating whisperer',
        words: [
          { arabic: 'مِن شَرِّ', meaning: 'From the evil', tajweed: ['ghunnah'] },
          { arabic: 'الْوَسْوَاسِ', meaning: 'of the whisperer', tajweed: ['madd'] },
          { arabic: 'الْخَنَّاسِ', meaning: 'who retreats', tajweed: ['shaddah', 'madd'] },
        ]
      },
      {
        id: 5,
        arabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
        translation: 'Who whispers into the hearts of mankind',
        words: [
          { arabic: 'الَّذِي', meaning: 'Who', tajweed: [] },
          { arabic: 'يُوَسْوِسُ', meaning: 'whispers', tajweed: [] },
          { arabic: 'فِي صُدُورِ', meaning: 'into the hearts', tajweed: ['madd'] },
          { arabic: 'النَّاسِ', meaning: 'of mankind', tajweed: ['ghunnah', 'madd'] },
        ]
      },
      {
        id: 6,
        arabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ',
        translation: 'From among the jinn and mankind',
        words: [
          { arabic: 'مِنَ', meaning: 'From among', tajweed: [] },
          { arabic: 'الْجِنَّةِ', meaning: 'the jinn', tajweed: ['ghunnah'] },
          { arabic: 'وَالنَّاسِ', meaning: 'and mankind', tajweed: ['ghunnah', 'madd'] },
        ]
      },
    ]
  },
];
