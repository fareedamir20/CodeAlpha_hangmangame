import { useState, useEffect } from 'react';

const WORDS = ['PYTHON', 'JAVASCRIPT', 'REACT', 'DEVELOPER', 'HANGMAN'];
const MAX_MISTAKES = 6;

export default function App() {
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  // Initialize the game
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(randomWord);
    setGuessedLetters(new Set());
    setStatus('playing');
  };

  const handleGuess = (letter: string) => {
    if (status !== 'playing' || !letter) return;
    const upperLetter = letter.toUpperCase();
    
    if (!/^[A-Z]$/.test(upperLetter)) return;
    if (guessedLetters.has(upperLetter)) return;

    setGuessedLetters(prev => {
      const newGuesses = new Set(prev);
      newGuesses.add(upperLetter);
      return newGuesses;
    });
  };

  // Keyboard support setup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere with browser shortcuts
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      
      if (e.key === 'Enter' && status !== 'playing') {
        startNewGame();
        return;
      }
      
      if (e.key.length === 1 && status === 'playing') {
        handleGuess(e.key);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, guessedLetters]);

  // Check win/loss conditions
  const mistakes = Array.from(guessedLetters).filter(l => !word.includes(l)).length;
  
  useEffect(() => {
    if (!word) return;
    const currentMistakes = Array.from(guessedLetters).filter(l => !word.includes(l)).length;
    
    let hasWon = true;
    for (let i = 0; i < word.length; i++) {
        if (!guessedLetters.has(word[i])) {
            hasWon = false;
            break;
        }
    }

    if (hasWon) {
      setStatus('won');
    } else if (currentMistakes >= MAX_MISTAKES) {
      setStatus('lost');
    }
  }, [guessedLetters, word]);

  const incorrectLetters = Array.from(guessedLetters).filter(l => !word.includes(l)).sort();
  const QWERTY_ROWS = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['Z','X','C','V','B','N','M']
  ];

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#1A1A1A] font-serif flex flex-col overflow-hidden select-none">
      {/* Top Navigation Bar */}
      <header className="flex justify-between items-center px-12 py-8 border-b border-[#1A1A1A]/10">
        <div className="flex items-baseline space-x-4">
          <span className="text-xs tracking-widest uppercase font-sans font-bold">Round 04</span>
          <h1 className="text-4xl italic font-light">The Executioner's Word</h1>
        </div>
        <div className="flex space-x-12">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest opacity-50 font-sans">Status</span>
            <span className="text-xl uppercase">
              {status === 'playing' ? 'Active' : status === 'won' ? 'Survived' : 'Hanged'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest opacity-50 font-sans">Attempts</span>
            <span className="text-xl">{mistakes}/{MAX_MISTAKES}</span>
          </div>
        </div>
      </header>

      {/* Main Gameplay Area */}
      <main className="flex-1 flex flex-row">
        {/* Vertical Status Rail */}
        <aside className="w-24 border-r border-[#1A1A1A]/10 flex flex-col items-center justify-between py-12">
          <span className="rotate-[-90deg] whitespace-nowrap text-[10px] uppercase tracking-[0.4em] opacity-40 font-sans">
            Session: Alpha-09
          </span>
          <div className="space-y-4 flex flex-col items-center">
            <div className={`w-1 h-1 ${status === 'playing' ? 'bg-[#1A1A1A]' : 'border border-[#1A1A1A] rounded-full'}`}></div>
            <div className={`w-1 h-1 ${status === 'lost' ? 'bg-[#1A1A1A] rounded-none' : 'bg-transparent border border-[#1A1A1A] rounded-full'}`}></div>
            <div className={`w-1 h-1 ${status === 'won' ? 'bg-[#1A1A1A] rounded-none' : 'bg-transparent border border-[#1A1A1A] rounded-full'}`}></div>
          </div>
        </aside>

        {/* Central Display */}
        <section className="flex-1 grid grid-cols-2 gap-0 relative">
          {/* Left: The Visual Hangman */}
          <div className="flex flex-col items-center justify-center border-r border-[#1A1A1A]/10 p-12">
            <div className="relative w-64 h-80">
              {/* Gallow Structure always visible */}
              <div className="absolute bottom-0 w-48 h-1 bg-[#1A1A1A]"></div>
              <div className="absolute bottom-0 left-12 w-1 h-full bg-[#1A1A1A]"></div>
              <div className="absolute top-0 left-12 w-32 h-1 bg-[#1A1A1A]"></div>
              <div className="absolute top-0 right-20 w-1 h-8 bg-[#1A1A1A]"></div>
              
              {/* Figure (Editorial Style) */}
              {mistakes > 0 && <div className="absolute top-8 right-[72px] w-10 h-10 border-2 border-[#1A1A1A] rounded-full transition-all duration-500"></div>}
              {mistakes > 1 && <div className="absolute top-[72px] right-[91px] w-[2px] h-24 bg-[#1A1A1A] transition-all duration-500"></div>}
              {mistakes > 2 && <div className="absolute top-[80px] right-[91px] w-12 h-[2px] bg-[#1A1A1A] -rotate-[30deg] origin-left transition-all duration-500"></div>}
              {mistakes > 3 && <div className="absolute top-[80px] right-[45px] w-12 h-[2px] bg-[#1A1A1A] rotate-[30deg] origin-right transition-all duration-500"></div>}
              {mistakes > 4 && <div className="absolute top-[168px] right-[91px] w-16 h-[2px] bg-[#1A1A1A] -rotate-[60deg] origin-left transition-all duration-500"></div>}
              {mistakes > 5 && <div className="absolute top-[168px] right-[29px] w-16 h-[2px] bg-[#1A1A1A] rotate-[60deg] origin-right transition-all duration-500"></div>}
            </div>
            <p className="mt-12 text-sm italic font-light opacity-60 uppercase tracking-widest">
              {mistakes} / {MAX_MISTAKES} Incorrect Attempts
            </p>
          </div>

          {/* Right: The Word */}
          <div className="flex flex-col justify-center px-16 relative">
            <div className="mb-8">
              <span className="text-[10px] uppercase tracking-widest opacity-50 font-sans mb-2 block">Hidden Word</span>
              <div className="flex flex-wrap gap-4 gap-y-8">
                {word.split('').map((letter, i) => {
                  const isGuessed = guessedLetters.has(letter) || status === 'lost';
                  const isRevealed = status === 'lost' && !guessedLetters.has(letter);
                  
                  return (
                    <span 
                      key={i} 
                      className={`text-6xl sm:text-7xl font-sans border-b-2 border-[#1A1A1A] pb-2 px-1 min-w-[50px] text-center
                        ${!isGuessed ? 'text-transparent underline decoration-[#1A1A1A]/20 underline-offset-8' : ''}
                        ${isRevealed ? 'opacity-40 italic' : ''}  
                      `}
                    >
                      {isGuessed ? letter : '_'}
                    </span>
                  );
                })}
              </div>
            </div>
            
            <div className="mt-12 h-32">
              <span className="text-[10px] uppercase tracking-widest opacity-50 font-sans mb-4 block">Discarded Elements</span>
              <div className="flex flex-wrap gap-4">
                {incorrectLetters.map(letter => (
                  <span key={letter} className="text-2xl line-through opacity-30 italic">
                    {letter}
                  </span>
                ))}
                {incorrectLetters.length === 0 && (
                  <span className="text-sm italic opacity-30">None</span>
                )}
              </div>
            </div>

            {status !== 'playing' && (
              <div className="absolute bottom-16 right-16">
                <button 
                  onClick={startNewGame}
                  className="font-sans font-bold uppercase tracking-widest text-xs px-8 py-4 border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F5F2ED] transition-colors"
                >
                  Play Again
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Bottom Keyboard Interface */}
      <footer className="border-t border-[#1A1A1A] p-8 sm:p-12 flex flex-col xl:flex-row items-center justify-between gap-8">
        <div className="flex flex-col gap-2 w-full max-w-4xl opacity-80">
          {QWERTY_ROWS.map((row, rowIndex) => (
             <div key={rowIndex} className={`flex gap-1 sm:gap-2 justify-center ${rowIndex === 1 ? 'ml-4 sm:ml-8' : rowIndex === 2 ? 'ml-8 sm:ml-16' : ''}`}>
               {row.map((letter) => {
                 const isGuessed = guessedLetters.has(letter);
                 const isIncorrect = isGuessed && !word.includes(letter);
                 const isCorrect = isGuessed && word.includes(letter);
                 
                 return (
                   <div 
                    key={letter}
                    onClick={() => handleGuess(letter)}
                    className={`
                      w-8 h-10 sm:w-10 sm:h-14 border flex items-center justify-center text-sm sm:text-lg font-sans transition-colors cursor-pointer
                      ${isCorrect ? 'border-[#1A1A1A] bg-[#1A1A1A] text-[#F5F2ED]' : 
                        isIncorrect ? 'border-[#1A1A1A]/10 text-[#1A1A1A]/20 line-through' : 
                        status === 'playing' ? 'border-[#1A1A1A]/30 hover:bg-[#1A1A1A] hover:text-[#F5F2ED]' : 
                        'border-[#1A1A1A]/10 opacity-50 cursor-default'}
                    `}
                   >
                     {letter}
                   </div>
                 );
               })}
             </div>
          ))}
        </div>
        
        <div className="text-center xl:text-right xl:border-l xl:border-[#1A1A1A]/10 xl:pl-12 w-full xl:w-auto flex flex-col justify-center">
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-sans mb-1 hidden xl:block">System Input</p>
          <div className="flex items-center justify-center xl:justify-end gap-4">
             <span className="text-[10px] uppercase tracking-widest font-sans font-bold border border-[#1A1A1A]/20 px-4 py-2">
               {status === 'playing' ? 'Type Letter To Guess' : 'Game Over'}
             </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
