export interface ActivitySet {
  formal: {
    content: string;
    answer: number;
  };
  word: {
    content: string;
    image: string;
    answer: number;
  };
  game: {
    image: string;
    type: string;
  };
}

export const activitySets: ActivitySet[] = [
  // first set
  {
    formal: {
      content: "23 + 25 = ___ \n 52 + 17 = ___ \n 48 - 36 = ___",
      answer: 65
    },
    word: {
      content: "Sally baked 23 cookies for the party tonight. Katy brought 25 cookies. How many cookies do they have altogether for the party?",
      image: "/img/word1-cookies.png",
      answer: 51
    },
    game: {
      image: "/img/box-game1.png",
      type: "tictactoe"
    }
  },
  // second set
  {
    formal: {
      content: "67 - 29 = ___ \n 24 + 27 = ___ \n 56 - 38 = ___",
      answer: 65
    },
    word: {
      content: "The zoo had 56 tickets available for a school trip. A class of 38 students bought tickets. How many tickets are left?",
      image: "/img/word2-zoo.png",
      answer: 51
    },
    game: {
      image: "/img/box-tictactoe.png",
      type: "tictactoe"
    }
  },
  // third set
  {
    formal: {
      content: "34 + 28 + 15 = ___ \n 43 + 57 + 22 = ___ \n 180 - 25 - 37 = ___",
      answer: 65
    },
    word: {
      content: "Emma picks up 34 cookies for dessert. Next, she grabs 28 sandwiches for lunch. Then, she gets 15 juice boxes. How many snacks did Emma bring to her picnic in total?",
      image: "/img/word3-snacks.png",
      answer: 51
    },
    game: {
      image: "/img/box-game3.png",
      type: "tictactoe"
    }
  },
  // fourth set
  {
    formal: {
      content: "137 + 58 = ___ \n 456 - 295 = ___ \n 128 + 69 = ___",
      answer: 65
    },
    word: {
      content: "Eugene's farm has 69 ducks in one pond and 128 geese in another. How many water birds are on Eugene's farm in total?",
      image: "/img/word4-animals.png",
      answer: 51
    },
    game: {
      image: "/img/box-game4.png",
      type: "tictactoe"
    }
  },
  // fifth set
  {
    formal: {
      content: "X + 245 = 147 + 176 \n Y + X = 260 - 87 \n Find X and Y",
      answer: 65
    },
    word: {
      content: "Number Kindom adventure: I hid 147 numbers in the first cave, 176 in the second cave, and 245 in the third cave...",
      image: "/img/word5-dragon.png",
      answer: 51
    },
    game: {
      image: "/img/box-game5.png",
      type: "tictactoe"
    }
  },
]; 