import { useState, useEffect } from "react";

interface ActivityComponentProps {
  onBack: () => void;
  onComplete?: () => void;
}

interface ShoppingList {
  id: number;
  budget: number;
  items: { name: string; quantity: number; price: number }[];
  imagePath: string;
}

type Role = "parent" | "child" | null;

// Add new interface for storing answers
interface ListAnswers {
  totalAmount: string;
  hasEnoughBudget: boolean | null;
  changeAmount: string;
  shopperRole: Role;
  cashierRole: Role;
}

interface UserBehavior {
  timestamp: string;
  location: string;
  behavior: string;
  input: string;
  result: string;
}

interface BaseActivityProps {
  onBack: () => void;
  onComplete?: () => void;
}

interface Games4Props extends BaseActivityProps {
  savedAnswers?: {
    answers: Record<number, ListAnswers>;
    gameComplete: boolean;
    currentList?: number;  // Make it optional in savedAnswers
    messages?: Record<string, string>;  // Make it optional in savedAnswers
  };
  onSaveAnswers: (answers: {
    answers: Record<number, ListAnswers>;
    gameComplete: boolean;
  }) => void;
  onTrackBehavior: (behavior: UserBehavior) => void;
}

export default function Games4({ 
  onBack, 
  onComplete, 
  savedAnswers,
  onSaveAnswers,
  onTrackBehavior
}: Games4Props) {
  const [answers, setAnswers] = useState<Record<number, ListAnswers>>(
    savedAnswers?.answers ?? {}
  );
  const [messages, setMessages] = useState<Record<string, string>>(
    savedAnswers?.messages ?? {}
  );
  const [currentList, setCurrentList] = useState<number>(
    savedAnswers?.currentList ?? 1
  );
  const [gameComplete, setGameComplete] = useState<boolean>(
    savedAnswers?.gameComplete ?? false
  );

  // Add this useEffect to save state when it changes
  useEffect(() => {
    if (answers[currentList]) {
      const { totalAmount, changeAmount } = answers[currentList];
      if (totalAmount || changeAmount) {
        onSaveAnswers({
          answers,
          gameComplete
        });
      }
    }
  }, [answers]);

  const shoppingLists: ShoppingList[] = [
    {
      id: 1,
      budget: 185,
      items: [
        { name: "Groceries", quantity: 1, price: 137 },
        { name: "Fruits", quantity: 1, price: 58 },
      ],
      imagePath: "/img/game4-list1.png",
    },
    {
      id: 2,
      budget: 456,
      items: [
        { name: "Computer", quantity: 1, price: 277 },
        { name: "Milk", quantity: 1, price: 18 },
      ],
      imagePath: "/img/game4-list2.png",
    },
    {
      id: 3,
      budget: 250,
      items: [
        { name: "Bear", quantity: 1, price: 69 },
        { name: "Car", quantity: 1, price: 128 },
      ],
      imagePath: "/img/game4-list3.png",
    },
  ];

  const calculateTotal = (items: { quantity: number; price: number }[]) => {
    return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  const trackBehavior = (behavior: string, input: string, result: string) => {
    onTrackBehavior({
      timestamp: new Date().toISOString(),
      location: "",
      behavior,
      input,
      result
    });
  };

  const handleTotalAmountChange = async (value: string) => {
    trackBehavior(
      "input",
      `list:${currentList}-total:${value}`,
      "total-amount-entered"
    );
    
    setAnswers(prev => ({
      ...prev,
      [currentList]: { ...prev[currentList], totalAmount: value }
    }));
  };

  const handleChangeAmountChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentList]: { ...prev[currentList], changeAmount: value }
    }));
  };

  const checkTotalAmount = async () => {
    const currentShoppingList = shoppingLists[currentList - 1];
    const correctTotal = calculateTotal(currentShoppingList.items);
    const currentAnswer = answers[currentList]?.totalAmount;

    trackBehavior(
      "click",
      `submitted:${currentAnswer}`,
      `correct:${correctTotal}`
    );

    if (parseInt(currentAnswer) === correctTotal) {
      setMessages(prev => ({...prev, total: "Correct! Now, let's check if there's enough budget."}));
    } else {
      setMessages(prev => ({...prev, total: "That's not correct. Try calculating again!"}));
    }
  };

  const checkBudgetAnswer = (answer: boolean) => {
    const currentShoppingList = shoppingLists[currentList - 1];
    const total = calculateTotal(currentShoppingList.items);
    const hasEnough = total <= currentShoppingList.budget;

    setAnswers(prev => ({
      ...prev,
      [currentList]: { ...prev[currentList], hasEnoughBudget: answer }
    }));

    if (answer === hasEnough) {
      setMessages(prev => ({...prev, budget: "Correct! Now let's select who will be the cashier."}));
    } else {
      setMessages(prev => ({...prev, budget: "That's not correct. Think about it again!"}));
    }
  };

  const checkChangeAmount = () => {
    const currentShoppingList = shoppingLists[currentList - 1];
    const total = calculateTotal(currentShoppingList.items);
    const correctChange = Math.abs(currentShoppingList.budget - total);

    if (parseInt(answers[currentList]?.changeAmount) === correctChange) {
      if (currentList === 3) {
        setGameComplete(true);
      }
      setMessages(prev => ({...prev, change: "Correct!"}));
    } else {
      setMessages(prev => ({...prev, change: "That's not correct. Try calculating again!"}));
    }
  };

  const resetStage = () => {
    setAnswers(prev => ({
      ...prev,
      [currentList]: {
        ...prev[currentList],
        shopperRole: null,
        cashierRole: null,
        totalAmount: "",
        hasEnoughBudget: null,
        changeAmount: ""
      }
    }));
    setMessages({});
  };

  const handleRoleSelect = async (role: Role, type: 'shopper' | 'cashier') => {
    trackBehavior(
      "select",
      `${type}-role`,
      role
    );
    setAnswers(prev => ({
      ...prev,
      [currentList]: { ...prev[currentList], [type === 'shopper' ? 'shopperRole' : 'cashierRole']: role }
    }));
  };

  const renderContent = () => {
    const currentShoppingList = shoppingLists[currentList - 1];

    return (
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-3xl">
        <h1 
        className="text-4xl mb-6 font-bold text-[#13294B] text-center"
        style={{ fontFamily: "Chalkduster, fantasy" }}>
          Eugene's Shopping Spree
          </h1>
        <p className="text-xl mb-4 text-start">
          Join Eugene's Shopping Spree! Take turns as the shopper or cashier to practice adding up items, staying under budget, and giving the right change. Grab your baskets—let's get shopping!
        </p>
        <img
          src={currentShoppingList.imagePath}
          alt={`Shopping List ${currentList}`}
          className="mx-auto mb-4 w-[30rem] h-auto"
        />

        {/* Shopper Role Selection */}
        <div className="mb-8">
          <h3 className="text-2xl mb-4 text-left">Who will be the shopper?</h3>
          <div className="flex justify-center gap-8 ">
            {["parent", "child"].map((role) => (
              <button
                key={role}
                onClick={() => handleRoleSelect(role as Role, 'shopper')}
                className={`flex flex-col items-center ${
                  answers[currentList]?.shopperRole === role ? "ring-4 ring-[#FF5F05] rounded-lg" : ""
                }`}
              >
                <img
                  src={`/img/game4-${role}.png`}
                  alt={role}
                  className="w-32 h-auto"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Shopper Questions */}
        <div className="mb-8">
          <p className="text-2xl mb-4 text-left">How much do I need to buy all items?</p>
          <div className="flex items-center justify-start gap-4">
            <input
              type="number"
              value={answers[currentList]?.totalAmount || ""}
              onChange={(e) => handleTotalAmountChange(e.target.value)}
              onWheel={(e) => (e.target as HTMLInputElement).blur()}
              className="border-2 border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter amount"
              style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
            />
            <button
              onClick={checkTotalAmount}
              className="bg-[#FF5F05] text-white px-6 py-2 rounded-lg"
            >
              Check
            </button>
          </div>
          {messages.total && (
            <p className={`mt-2 ${messages.total.includes("Correct") ? "text-green-600" : "text-red-600"}`}>
              {messages.total}
            </p>
          )}
        </div>

        {/* Budget Question */}
        <div className="mb-8">
          <p className="text-2xl mb-4 text-left">
            Do I have enough money in my budget to buy everything?
          </p>
          <div className="flex justify-start gap-4">
            {["YES", "NO"].map((option) => (
              <button
                key={option}
                onClick={() => checkBudgetAnswer(option === "YES")}
                className={`px-6 py-2 rounded-lg ${
                  answers[currentList]?.hasEnoughBudget === (option === "YES")
                    ? messages.budget?.includes("Correct")
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                    : "bg-[#FF5F05] text-white"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          {messages.budget && (
            <p className={`mt-2 ${messages.budget.includes("Correct") ? "text-green-600" : "text-red-600"}`}>
              {messages.budget}
            </p>
          )}
        </div>

        <hr className="border-t-2 border-gray-200 my-8" />

        {/* Cashier Role Selection */}
        <div className="mb-8">
          <h3 className="text-2xl mb-4 text-left">Who will be the cashier?</h3>
          <div className="flex justify-center gap-8">
            {["parent", "child"].map((role) => (
              <button
                key={role}
                onClick={() => handleRoleSelect(role as Role, 'cashier')}
                className={`flex flex-col items-center ${
                  answers[currentList]?.cashierRole === role ? "ring-4 ring-[#FF5F05] rounded-lg" : ""
                }`}
              >
                <img
                  src={`/img/game4-${role}.png`}
                  alt={role}
                  className="w-32 h-auto"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Cashier Question */}
        <div className="mb-8">
          <p className="text-2xl mb-4 text-left">
            Eugene gave me all her budget money for this shopping list. How much change should I give her back?/How much does she owe?
          </p>
          <input
            type="number"
            value={answers[currentList]?.changeAmount || ""}
            onChange={(e) => handleChangeAmountChange(e.target.value)}
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
            className="border-2 border-gray-300 rounded-lg px-4 py-2 mr-4"
            placeholder="Enter change amount"
            style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
          />
          <button
            onClick={checkChangeAmount}
            className="bg-[#FF5F05] text-white px-6 py-2 rounded-lg"
          >
            Check
          </button>
          {messages.change && (
            <p className={`mt-2 ${messages.change.includes("Correct") ? "text-green-600" : "text-red-600"}`}>
              {messages.change}
            </p>
          )}
        </div>
      </div>
    );
  };

  const isCurrentListComplete = () => {
    const currentAnswers = answers[currentList];
    if (!currentAnswers) return false;

    const currentShoppingList = shoppingLists[currentList - 1];
    const total = calculateTotal(currentShoppingList.items);
    const correctChange = Math.abs(currentShoppingList.budget - total);
    const hasEnough = total <= currentShoppingList.budget;

    return (
      currentAnswers.shopperRole &&
      currentAnswers.cashierRole &&
      parseInt(currentAnswers.totalAmount) === total &&
      currentAnswers.hasEnoughBudget === hasEnough &&
      parseInt(currentAnswers.changeAmount) === correctChange
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      {renderContent()}
      <div className="flex justify-between mt-6 w-full max-w-3xl">
        <button
          onClick={() => {
            setCurrentList((prev) => Math.max(prev - 1, 1));
            setMessages({});
          }}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg"
        >
          Previous
        </button>
        {gameComplete ? (
          <button
            onClick={async () => {
              trackBehavior(
                "game-complete",
                "next-button-games4",
                "complete"
              );
              if (onComplete) {
                onComplete();
              }
            }}
            className="bg-[#FF5F05] text-2xl text-white px-6 py-2 rounded-lg"
          >
            NEXT
          </button>
        ) : (
          isCurrentListComplete() ? (
            <button
              onClick={() => {
                setCurrentList((prev) => Math.min(prev + 1, 3));
                setMessages({});
              }}
              className="bg-[#FF5F05] text-white px-6 py-2 rounded-lg"
            >
              Next
            </button>
          ) : (
            <p className="text-[#FF5F05] italic">
              Please complete all questions correctly before moving to the next shopping list!
            </p>
          )
        )}
      </div>
    </div>
  );
}
