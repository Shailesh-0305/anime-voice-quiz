/**
 * Anime Scene Voice Quiz — Scenes Database
 *
 * Built from the actual MP4 files present in the Scenes/ folder.
 * The quiz extracts audio from these videos during the guessing phase,
 * then reveals the full video upon answering.
 */

export const SCENES = [
  {
    id: 'gojo',
    characterName: 'Satoru Gojo',
    anime: 'Jujutsu Kaisen',
    voiceActor: 'Yuichi Nakamura',
    difficulty: 'easy',
    quote: 'Daijoubu, boku saikyou dakara. (Don\'t worry, I\'m the strongest.)',
    videoFilename: 'gojo.mp4',
    characterAvatar: '🤞'
  },
  {
    id: 'naruto',
    characterName: 'Naruto Uzumaki',
    anime: 'Naruto',
    voiceActor: 'Junko Takeuchi',
    difficulty: 'easy',
    quote: 'Dattebayo! I never go back on my word — that\'s my ninja way!',
    videoFilename: 'Naruto Uzumaki.mp4',
    characterAvatar: '🍜'
  },
  {
    id: 'luffy',
    characterName: 'Monkey D. Luffy',
    anime: 'One Piece',
    voiceActor: 'Mayumi Tanaka',
    difficulty: 'easy',
    quote: 'Kaizoku ou ni, ore wa naru! (I\'m going to be King of the Pirates!)',
    videoFilename: 'Monkey D Luffy.mp4',
    characterAvatar: '👒'
  },
  {
    id: 'vegeta',
    characterName: 'Vegeta',
    anime: 'Dragon Ball Z',
    voiceActor: 'Ryo Horikawa',
    difficulty: 'easy',
    quote: 'I am the prince of all Saiyans! Final Flash!',
    videoFilename: 'Vegeta.mp4',
    characterAvatar: '⚡'
  },
  {
    id: 'zoro',
    characterName: 'Roronoa Zoro',
    anime: 'One Piece',
    voiceActor: 'Kazuya Nakai',
    difficulty: 'medium',
    quote: 'Santoryu Ougi: Sanzen Sekai! Nothing happened.',
    videoFilename: 'Zoro.mp4',
    characterAvatar: '⚔️'
  },
  {
    id: 'sukuna',
    characterName: 'Ryomen Sukuna',
    anime: 'Jujutsu Kaisen',
    voiceActor: 'Junichi Suwabe',
    difficulty: 'medium',
    quote: 'Fukuma Mizushi — Malevolent Shrine. Know your place.',
    videoFilename: '5ukuna.mp4',
    characterAvatar: '😈'
  },
  {
    id: 'megumi',
    characterName: 'Megumi Fushiguro',
    anime: 'Jujutsu Kaisen',
    voiceActor: 'Yuma Uchida',
    difficulty: 'medium',
    quote: 'With this treasure I summon… Eight-Handled Sword Divergent Sila Divine General Mahoraga!',
    videoFilename: 'megumi.mp4',
    characterAvatar: '🐺'
  },
  {
    id: 'yuji',
    characterName: 'Yuji Itadori',
    anime: 'Jujutsu Kaisen',
    voiceActor: 'Junya Enoki',
    difficulty: 'medium',
    quote: 'I\'m going to find the proper death for the people I kill.',
    videoFilename: 'Yuji.mp4',
    characterAvatar: '👊'
  },
  {
    id: 'light',
    characterName: 'Light Yagami',
    anime: 'Death Note',
    voiceActor: 'Mamoru Miyano',
    difficulty: 'medium',
    quote: 'I am Justice! I will create a new world!',
    videoFilename: 'light yagami.mp4',
    characterAvatar: '📓'
  },
  {
    id: 'l',
    characterName: 'L Lawliet',
    anime: 'Death Note',
    voiceActor: 'Kappei Yamaguchi',
    difficulty: 'hard',
    quote: 'I am L. The probability of you being Kira is roughly 5%.',
    videoFilename: 'L deathnote.mp4',
    characterAvatar: '🍰'
  },
  {
    id: 'erwin',
    characterName: 'Erwin Smith',
    anime: 'Attack on Titan',
    voiceActor: 'Daisuke Ono',
    difficulty: 'hard',
    quote: 'Shinzou wo Sasageyo! Dedicate your hearts!',
    videoFilename: 'Erwin.mp4',
    characterAvatar: '🗡️'
  },
  {
    id: 'anya',
    characterName: 'Anya Forger',
    anime: 'Spy × Family',
    voiceActor: 'Atsumi Tanezaki',
    difficulty: 'easy',
    quote: 'Waku waku! Heh heh heh.',
    videoFilename: 'anya.mp4',
    characterAvatar: '🥜'
  },
  {
    id: 'ash',
    characterName: 'Ash Ketchum',
    anime: 'Pokémon',
    voiceActor: 'Rica Matsumoto',
    difficulty: 'easy',
    quote: 'Pikachu, I choose you! I\'m going to be a Pokémon Master!',
    videoFilename: 'Ash.mp4',
    characterAvatar: '⚡'
  },
  {
    id: 'nobita',
    characterName: 'Nobita Nobi',
    anime: 'Doraemon',
    voiceActor: 'Megumi Ohara',
    difficulty: 'easy',
    quote: 'Doraemon! Help me, Doraemon!',
    videoFilename: 'nobita.mp4',
    characterAvatar: '📘'
  }
];

/**
 * Pool of character names used to generate wrong-answer distractors.
 * Includes all scene characters plus extras so quizzes always have 4 unique choices.
 */
export const ALL_CHARACTERS_POOL = [
  { name: 'Satoru Gojo', anime: 'Jujutsu Kaisen' },
  { name: 'Naruto Uzumaki', anime: 'Naruto' },
  { name: 'Monkey D. Luffy', anime: 'One Piece' },
  { name: 'Vegeta', anime: 'Dragon Ball Z' },
  { name: 'Roronoa Zoro', anime: 'One Piece' },
  { name: 'Ryomen Sukuna', anime: 'Jujutsu Kaisen' },
  { name: 'Megumi Fushiguro', anime: 'Jujutsu Kaisen' },
  { name: 'Yuji Itadori', anime: 'Jujutsu Kaisen' },
  { name: 'Light Yagami', anime: 'Death Note' },
  { name: 'L Lawliet', anime: 'Death Note' },
  { name: 'Erwin Smith', anime: 'Attack on Titan' },
  { name: 'Anya Forger', anime: 'Spy × Family' },
  { name: 'Ash Ketchum', anime: 'Pokémon' },
  { name: 'Nobita Nobi', anime: 'Doraemon' },
  // Extra distractor characters (not in scenes)
  { name: 'Son Goku', anime: 'Dragon Ball Z' },
  { name: 'Sasuke Uchiha', anime: 'Naruto' },
  { name: 'Kakashi Hatake', anime: 'Naruto' },
  { name: 'Eren Yeager', anime: 'Attack on Titan' },
  { name: 'Levi Ackerman', anime: 'Attack on Titan' },
  { name: 'Tanjiro Kamado', anime: 'Demon Slayer' },
  { name: 'Zenitsu Agatsuma', anime: 'Demon Slayer' },
  { name: 'Killua Zoldyck', anime: 'Hunter × Hunter' },
  { name: 'Gon Freecss', anime: 'Hunter × Hunter' },
  { name: 'Makima', anime: 'Chainsaw Man' },
  { name: 'Dio Brando', anime: "JoJo's Bizarre Adventure" },
  { name: 'Shoto Todoroki', anime: 'My Hero Academia' },
  { name: 'Edward Elric', anime: 'Fullmetal Alchemist' },
  { name: 'Mikasa Ackerman', anime: 'Attack on Titan' },
  { name: 'Itachi Uchiha', anime: 'Naruto' },
  { name: 'Nezuko Kamado', anime: 'Demon Slayer' },
  { name: 'Sanji', anime: 'One Piece' }
];
