interface ProgressBarProps {
    totalSteps: number;
    currentStep: number;
    completedSteps: number;
    onStepClick: (index: number) => void;
    selections: (string | null)[];
  }
  
  export default function ProgressBar({
    totalSteps,
    currentStep,
    completedSteps,
    onStepClick,
    selections
  }: ProgressBarProps) {
    return (
      <div className="w-full max-w-3xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <button
                onClick={() => onStepClick(index)}
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold
                  ${selections[index] 
                    ? 'bg-[#13294B] text-white cursor-pointer' 
                    : index === currentStep - 1
                    ? 'bg-[#FF5F05] text-white'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
                `}
                disabled={!selections[index]}
              >
                {index + 1}
              </button>
              {selections[index] && (
                <span className="text-sm mt-1">
                  {selections[index]?.charAt(0).toUpperCase() + selections[index]?.slice(1)}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full mt-2">
          <div 
            className="h-full bg-[#13294B] rounded-full transition-all duration-300"
            style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    );
  }