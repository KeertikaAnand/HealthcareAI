import { FC } from "react";

interface WelcomeCardProps {
  onTopicSelect: (topic: string) => void;
}

const WelcomeCard: FC<WelcomeCardProps> = ({ onTopicSelect }) => {
  const quickTopics = [
    "Common cold symptoms",
    "Headache remedies",
    "Stress management",
    "COVID-19 info"
  ];
  
  return (
    <div className="bg-white rounded-xl shadow-md p-5 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">Welcome to HealthChat AI</h2>
      <p className="text-gray-600 mb-4">
        I'm your personal healthcare assistant, ready to provide information about symptoms, conditions, and general health advice.
      </p>
      <p className="text-gray-600 mb-4">
        <span className="text-primary font-medium">Note:</span> I'm not a replacement for professional medical care. Always consult a healthcare provider for medical concerns.
      </p>
      <div className="flex flex-wrap gap-2 mt-4">
        {quickTopics.map((topic, index) => (
          <button
            key={index}
            onClick={() => onTopicSelect(topic)}
            className="quick-topic px-4 py-2 rounded-full bg-blue-100 text-primary hover:bg-blue-200 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeCard;
