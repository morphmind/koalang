
import { Word } from '../../data/oxford3000.types';
import { QuizQuestion, QuestionType } from '../types';

function filterWordsByLevel(words: Word[], level: string): Word[] {
  if (level === 'mixed') return words;
  return words.filter(word => word.level === level.toUpperCase());
}

function getRandomWordsForOptions(words: Word[], currentWord: Word, count: number): Word[] {
  // Önce aynı seviye ve türden kelimeler
  const sameTypeAndLevel = words.filter(w => 
    w.level === currentWord.level && 
    w.type === currentWord.type && 
    w.word !== currentWord.word
  );

  // Yeterli kelime yoksa, sadece aynı türden kelimeler
  if (sameTypeAndLevel.length < count) {
    const sameType = words.filter(w => 
      w.type === currentWord.type && 
      w.word !== currentWord.word
    );
    return shuffleArray(sameType).slice(0, count);
  }

  return shuffleArray(sameTypeAndLevel).slice(0, count);
}

function getSimilarWords(words: Word[], currentWord: Word, count: number): Word[] {
  // Benzer uzunlukta ve aynı türde kelimeler
  const similarWords = words.filter(w => 
    w.word !== currentWord.word &&
    w.type === currentWord.type &&
    Math.abs(w.word.length - currentWord.word.length) <= 2
  );

  // Aynı seviyeden benzer kelimeler
  const sameLevelSimilar = similarWords.filter(w => w.level === currentWord.level);
  
  if (sameLevelSimilar.length >= count) {
    return shuffleArray(sameLevelSimilar).slice(0, count);
  }
  
  return shuffleArray(similarWords).slice(0, count);
}

export function generateQuestions(
  learnedWords: Word[],
  settings: { count: number, types: QuestionType[], difficulty: string },
  allWords: Word[]
): QuizQuestion[] {
  // Zorluk seviyesine göre kelimeleri filtrele
  const filteredWords = filterWordsByLevel(learnedWords, settings.difficulty);
  
  if (filteredWords.length === 0) {
    // Demo kelimeler kullan
    const demoWords = filterWordsByLevel(allWords, settings.difficulty).slice(0, 100);
    if (demoWords.length === 0) {
      throw new Error('Bu seviyede kelime bulunmamaktadır.');
    }
    return generateQuestionsFromWords(demoWords, settings, allWords);
  }
  
  return generateQuestionsFromWords(filteredWords, settings, allWords);
}

function generateQuestionsFromWords(
  sourceWords: Word[],
  settings: { count: number, types: QuestionType[] },
  allWords: Word[]
): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const shuffledWords = shuffleArray([...sourceWords]);
  const questionCount = Math.min(settings.count, shuffledWords.length);

  for (let i = 0; i < questionCount; i++) {
    const word = shuffledWords[i];
    const questionType = settings.types[Math.floor(Math.random() * settings.types.length)];
    questions.push(createQuestion(word, questionType, allWords));
  }

  return questions;
}

function createQuestion(word: Word, type: QuestionType, allWords: Word[]): QuizQuestion {
  switch (type) {
    case 'multiple-choice':
      return createMultipleChoiceQuestion(word, allWords);
    case 'sentence-completion':
      return createSentenceCompletionQuestion(word, allWords);
    case 'pronunciation':
      return createPronunciationQuestion(word, allWords);
    case 'example-matching':
      return createExampleMatchingQuestion(word, allWords);
    default:
      return createMultipleChoiceQuestion(word, allWords);
  }
}

function createMultipleChoiceQuestion(word: Word, allWords: Word[]): QuizQuestion {
  const incorrectWords = getRandomWordsForOptions(allWords, word, 3);
  const incorrectOptions = incorrectWords.map(w => w.meaning);

  const options = shuffleArray([word.meaning, ...incorrectOptions]);

  return {
    id: generateQuestionId(),
    wordId: word.word,
    type: 'multiple-choice',
    question: `"${word.word}" kelimesinin anlamı nedir?`,
    options,
    correctAnswer: word.meaning,
    isSkipped: false,
    explanation: `"${word.word}" kelimesi "${word.meaning}" anlamına gelir. 
                 Örnek: ${word.examples[0]?.en || ''}`
  };
}

function createSentenceCompletionQuestion(word: Word, allWords: Word[]): QuizQuestion {
  const example = word.examples[0]?.en || '';
  // Kelimeyi büyük/küçük harf duyarlı şekilde bul ve değiştir
  const regex = new RegExp(word.word, 'gi');
  const question = example.replace(regex, '_____');

  // Benzer kelimeler al
  const similarWords = getSimilarWords(allWords, word, 3);
  const incorrectOptions = similarWords.map(w => w.word);

  const options = shuffleArray([word.word, ...incorrectOptions]);

  return {
    id: generateQuestionId(),
    wordId: word.word,
    type: 'sentence-completion',
    question: `Boşluğa uygun kelimeyi seçiniz: ${question}`,
    options,
    correctAnswer: word.word,
    isSkipped: false,
    explanation: `Doğru cevap "${word.word}". 
                 Tam cümle: ${example}`
  };
}

function createPronunciationQuestion(word: Word, allWords: Word[]): QuizQuestion {
  const incorrectWords = getRandomWordsForOptions(allWords, word, 3);
  const incorrectOptions = incorrectWords.map(w => w.word);

  const options = shuffleArray([word.word, ...incorrectOptions]);

  return {
    id: generateQuestionId(),
    wordId: word.word,
    type: 'pronunciation',
    question: `Telaffuzu dinlediğiniz kelimeyi seçiniz: [${word.pronunciation}]`,
    options,
    correctAnswer: word.word,
    isSkipped: false,
    explanation: `"${word.word}" kelimesinin telaffuzu ${word.pronunciation} şeklindedir.`
  };
}

function createExampleMatchingQuestion(word: Word, allWords: Word[]): QuizQuestion {
  const example = word.examples[0]?.en || '';
  const incorrectWords = getRandomWordsForOptions(allWords, word, 3);
  const incorrectOptions = incorrectWords.map(w => w.word);

  const options = shuffleArray([word.word, ...incorrectOptions]);

  return {
    id: generateQuestionId(),
    wordId: word.word,
    type: 'example-matching',
    question: `Hangi kelime bu cümlede kullanılmıştır: "${example}"`,
    options,
    correctAnswer: word.word,
    isSkipped: false,
    explanation: `"${word.word}" kelimesi bu cümlede kullanılmıştır: ${example}`
  };
}

// Utility functions
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function generateQuestionId(): string {
  return Math.random().toString(36).substring(2, 15);
}
