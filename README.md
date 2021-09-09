# NPTA!
An online version of the classic word game Name Place Animal Thing.
Check it out [here](https://npta.herokuapp.com)

## Features

* Game of Name Place Thing Animal with time limit
* Chat while playing, includes profanity filter
* Auto-validation of words using dictionaries
* UX Designed for native mobile app experience with Ionic
* No registration, just fun.

## Rules

### Input

* Fill the four input fields with a word starting with the given letter for each of the four category, viz., Name, Place, Thing, and Animal.
* You have maximum alotted time of 30 seconds to submit your inputs. You can lock your inputs before the alloted time to earn bonus points.
* You can change your inputs even after locking. Just be sure to lock your inputs again for the changes to be registered.
      
### Assessment

* Your inputs will be first matched against our dictionary words to assess the correctness of the word. Valid inputs will be highlighted in Green.
* Invalid inputs will be shown as striked-off words.
* The rest of the input will be assessed by a majority of upvotes by the players.
* To upvote an answer, tap once on the word chip. Tapping again will discard your upvote.
* Once a word gains majority upvote, it will be considered a valid input and highlighted in Green.
* When there is two or more instances of the same word in the same category, it will be highlighted in a shade of Yellow.
* If a word has been used in a previous round, it will be considered as invalid.

### Score

* Scoring will be done by the app itself based on the following rules-
* Each correct and unique answer will carry 10 points each.
* Correct but non-unique answers will carry 5 points each.
* Time bonus will be calculated as <br /><var>t</var> / <var>30</var> x <var>initial-score</var><br />where <var>t</var> is the time left after locking your answers.
      
## TODO

* Improve wordlist
* Access Logging
* Error Logging
* Transfer host rights to a co-host when host leaves
