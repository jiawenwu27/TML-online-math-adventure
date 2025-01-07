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
      content: "24 + 27 = ___ \n 56 + 38 = ___ \n 67 - 29 = ___",
      answer: 65
    },
    word: {
      content: "Sally baked 24 cookies for the party tonight. Katy brought 27 cookies. How many cookies do they have altogether for the party?",
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
      content: "58 - 29 = ___ \n 25 + 35 + 48 = ___ \n 67 - 34 - 26 = ___",
      answer: 65
    },
    word: {
      content: "The zoo had 67 tickets available for a school trip. A class of 34 students bought tickets, and another group of 26 teachers bought tickets. How many tickets are left?",
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
      content: "34 + 28 + 15 + 49 = ___ \n 43 + 57 + 22 + 18 = ___ \n 180 - 25 - 37 - 44 = ___",
      answer: 65
    },
    word: {
      content: "Emma picks up 27 cookies for dessert. Next, she grabs 26 sandwiches for lunch. Then, she gets 41 juice boxes. Finally, she adds 39 apples for a healthy treat. How many snacks did Emma bring to her picnic in total?",
      image: "/img/word3-picnic.png",
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
      content: "368 - 127 = ___ \n 2253 - 164 + 65 = ___ \n 122 - 45 + 152 = ___",
      answer: 65
    },
    word: {
      content: "Eugene's farm has 133 chickens and 46 cows. The total number of cows and sheep they have is 141 more than the number of chickens. How many sheep are on Eugene's farm?",
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
      content: "Number Kindom adventure: The king has 147 gold coins and 176 silver coins. He wants to give 245 coins to his daughter. How many coins does he need to buy from the market to have enough?",
      image: "/img/word5-dragon.png",
      answer: 51
    },
    game: {
      image: "/img/box-game5.png",
      type: "tictactoe"
    }
  },
]; 