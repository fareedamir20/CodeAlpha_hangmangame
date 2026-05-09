import random

def play_hangman():
    # 1. Configuration: Word bank with exactly 5 words
    word_bank = ['python', 'logic', 'device', 'syntax', 'coding']
    lives = 6
    
    # Randomly select a word from the list
    secret_word = random.choice(word_bank)
    
    # 2. Game Logic Requirements: Display series of underscores
    display = ['_'] * len(secret_word)
    guessed_letters = []
    
    print("Welcome to Hangman!")
    
    # Continuously ask the user for a letter until they win or lose
    while lives > 0 and '_' in display:
        print("\nWord:", " ".join(display))
        print(f"Lives remaining: {lives}")
        print(f"Guessed Letters: {', '.join(guessed_letters)}")
        
        guess = input("Enter a letter: ").lower()
        
        # Basic input validation
        if len(guess) != 1 or not guess.isalpha():
            print("Please enter a single valid letter.")
            continue
            
        # Check if the letter was already guessed
        if guess in guessed_letters:
            print("You already guessed that letter!")
            continue
            
        # Add the valid guess to the tracked list
        guessed_letters.append(guess)
        
        # If-else logic: check if the letter is in the word
        if guess in secret_word:
            print("Good guess!")
            # Reveal its position(s) in the underscore display
            for index, letter in enumerate(secret_word):
                if letter == guess:
                    display[index] = guess
        else:
            print("Incorrect guess!")
            # Decrement lives by 1 if not in the word
            lives -= 1
            
    # 3. Termination Conditions
    if '_' not in display:
        # Win condition
        print("\nWord:", "".join(display))
        print("Congratulations! You won!")
    else:
        # Loss condition
        print("\nGame Over")
        print(f"The correct word was: {secret_word}")

if __name__ == "__main__":
    play_hangman()
