import { Quiz, QuizResult } from '../types';
import { Word } from '../../data/oxford3000.types';

export function analyzeQuizResult(quiz: Quiz, words: Word[]): QuizResult {
  // Doğru, yanlış ve geçilen soruları hesapla
  const correctAnswers = quiz.questions.filter(q => q.isCorrect).length;
  const wrongAnswers = quiz.questions.filter(q => q.userAnswer && !q.isCorrect).length;
  const skippedQuestions = quiz.questions.filter(q => q.isSkipped).length || 0;

  const result: QuizResult = {
    quizId: quiz.id,
    totalScore: calculateTotalScore(quiz),
    totalQuestions: quiz.totalQuestions,
    correctAnswers,
    wrongAnswers,
    skippedQuestions,
    successRate: calculateSuccessRate(quiz),
    timeSpent: calculateTotalTime(quiz),
    averageTimePerQuestion: calculateAverageTime(quiz),
    levelAnalysis: analyzeLevels(quiz, words),
    wordTypeAnalysis: analyzeWordTypes(quiz, words),
    recommendations: generateRecommendations(quiz, words),
    wrongAnswers: quiz.questions.filter(q => q.userAnswer && !q.isCorrect)
  };

  return result;
}

function calculateTotalTime(quiz: Quiz): number {
  if (!quiz.startedAt || !quiz.completedAt) return 0;
  return Math.floor((quiz.completedAt.getTime() - quiz.startedAt.getTime()) / 1000);
}

function calculateAverageTime(quiz: Quiz): number {
  return calculateTotalTime(quiz);
}

function calculateTotalScore(quiz: Quiz): number {
  const pointsPerQuestion = 100 / quiz.totalQuestions;
  const correctCount = quiz.questions.filter(q => q.isCorrect).length;
  return Math.round(correctCount * pointsPerQuestion);
}

function calculateSuccessRate(quiz: Quiz): number {
  const correctCount = quiz.questions.filter(q => q.isCorrect).length;
  return Math.round((correctCount / quiz.totalQuestions) * 100);
}

function analyzeLevels(quiz: Quiz, words: Word[]) {
  const levels: { [key: string]: { total: number; correct: number; percentage: number } } = {
    'A1': { total: 0, correct: 0, percentage: 0 },
    'A2': { total: 0, correct: 0, percentage: 0 },
    'B1': { total: 0, correct: 0, percentage: 0 },
    'B2': { total: 0, correct: 0, percentage: 0 },
    'C1': { total: 0, correct: 0, percentage: 0 }
  };

  quiz.questions.forEach(question => {
    const word = words.find(w => w.word === question.wordId);
    if (word) {
      levels[word.level].total++;
      if (question.isCorrect) {
        levels[word.level].correct++;
      }
    }
  });

  // Calculate percentages
  Object.keys(levels).forEach(level => {
    const { total, correct } = levels[level];
    levels[level].percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  });

  return levels;
}

function analyzeWordTypes(quiz: Quiz, words: Word[]) {
  const types: { [key: string]: { total: number; correct: number; percentage: number } } = {};

  // Kelime türlerini açıklamalarıyla birlikte tanımla
  const typeDescriptions: { [key: string]: string } = {
    'n.': 'n. (noun, isim)',
    'v.': 'v. (verb, fiil)',
    'adj.': 'adj. (adjective, sıfat)',
    'adv.': 'adv. (adverb, zarf)',
    'prep.': 'prep. (preposition, edat)',
    'conj.': 'conj. (conjunction, bağlaç)',
    'pron.': 'pron. (pronoun, zamir)',
    'det.': 'det. (determiner, belirteç)',
    'exclamation': 'excl. (exclamation, ünlem)',
    'modal v.': 'modal v. (modal verb, yardımcı fiil)',
    'number': 'num. (number, sayı)',
    'article': 'art. (article, tanımlık)',
    'prep., adv.': 'prep., adv. (preposition/adverb, edat/zarf)',
    'indefinite article': 'indef. art. (indefinite article, belgisiz tanımlık)',
    'adv., prep.': 'adv., prep. (adverb/preposition, zarf/edat)',
    'adj., adv.': 'adj., adv. (adjective/adverb, sıfat/zarf)',
    'adj., n.': 'adj., n. (adjective/noun, sıfat/isim)',
    'v., n.': 'v., n. (verb/noun, fiil/isim)'
  };

  quiz.questions.forEach(question => {
    const word = words.find(w => w.word === question.wordId);
    if (word) {
      const typeKey = typeDescriptions[word.type] || word.type;
      if (!types[typeKey]) {
        types[typeKey] = { total: 0, correct: 0, percentage: 0 };
      }
      types[typeKey].total++;
      if (question.isCorrect) {
        types[typeKey].correct++;
      }
    }
  });

  // Calculate percentages
  Object.keys(types).forEach(type => {
    const { total, correct } = types[type];
    types[type].percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  });

  return types;
}

function generateRecommendations(quiz: Quiz, words: Word[]): string[] {
  const recommendations: string[] = [];
  const successRate = calculateSuccessRate(quiz);

  // Overall performance recommendations
  if (successRate < 50) {
    recommendations.push('Genel performansınız geliştirilmeli. Daha fazla pratik yapmanızı öneririz.');
  } else if (successRate < 75) {
    recommendations.push('İyi gidiyorsunuz! Düzenli tekrarlarla başarınızı artırabilirsiniz.');
  } else {
    recommendations.push('Harika bir performans! Öğrendiğiniz kelimeleri pekiştirmek için düzenli tekrar yapmaya devam edin.');
  }

  // CTA'yi en sona ekle
  recommendations.push(`Daha hızlı ilerleme kaydetmek için uzman öğretmenlerimizle birebir online İngilizce dersi alabilirsiniz. 
                       <a href="https://www.ozeldersalani.com/ingilizce/online" class="text-bs-primary hover:underline font-medium">
                       Online İngilizce kursumuz hakkında detaylı bilgi alın →</a>`);

  // Level-based recommendations
  const levelAnalysis = analyzeLevels(quiz, words);
  const weakestLevel = Object.entries(levelAnalysis)
    .filter(([_, stats]) => stats.total > 0)
    .sort(([_, a], [__, b]) => a.percentage - b.percentage)[0];

  if (weakestLevel && weakestLevel[1].percentage < 70) {
    recommendations.push(`${weakestLevel[0]} seviyesindeki kelimeler üzerinde daha fazla çalışmanızı öneririz.`);
  }

  // Word type recommendations
  const typeAnalysis = analyzeWordTypes(quiz, words);
  const weakestType = Object.entries(typeAnalysis)
    .filter(([_, stats]) => stats.total > 0)
    .sort(([_, a], [__, b]) => a.percentage - b.percentage)[0];

  if (weakestType && weakestType[1].percentage < 70) {
    recommendations.push(`${weakestType[0]} türündeki kelimeler üzerinde daha fazla çalışmanızı öneririz.`);
  }

  // Time-based recommendations
  const averageTimePerQuestion = quiz.questions.reduce((acc, q) => acc + (q.timeSpent || 0), 0) / quiz.questions.length;
  if (averageTimePerQuestion > 30) {
    recommendations.push('Sorulara cevap verme sürenizi iyileştirmek için hızlı kelime tanıma alıştırmaları yapabilirsiniz.');
  }

  return recommendations;
}