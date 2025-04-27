import { useState, useRef } from 'react'

function App() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState('');
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const segments = [
    '🌀 Smoke on the house',
    '🛍️ Restroworks Swag Bag',
    '😅 Better Luck Next Time!',
    '🥃 Get a free shot',
    '🍬 Fresh mints'
  ];

  const segmentColors = [
    'bg-orange-500',
    'bg-amber-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-orange-500',
  ];

  const spinWheel = () => {
    if (spinning) return;
    
    // Reset previous result
    setResult('');
    setSpinning(true);
    
    // Random rotation between 2000 and 5000 degrees
    const spinDegrees = 2000 + Math.random() * 3000;
    const newRotation = rotation + spinDegrees;
    setRotation(newRotation);
    
    // Calculate which segment won based on final position
    setTimeout(() => {
      const segmentSize = 360 / segments.length;
      const normDegrees = newRotation % 360;
      const segmentIndex = Math.floor(normDegrees / segmentSize);
      const winningSegment = segments[(segments.length - segmentIndex) % segments.length];
      
      setResult(winningSegment);
      setSpinning(false);
    }, 5000); // Animation takes 5 seconds
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center justify-start py-8 px-4">
      <div className="mb-4 text-center">
        <div className="text-3xl font-bold text-gray-800 bg-white px-6 py-3 rounded-lg shadow-md border-b-4 border-orange-600">
          Restroworks
        </div>
      </div>
      
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
        Spin to Win! <span className="text-yellow-500">🥳</span>
      </h1>
      
      {/* Increased size of the wheel */}
      <div className="relative w-[350px] h-[350px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] mb-8">
        {/* Outer ring decoration */}
        <div className="absolute inset-[-8px] rounded-full border-8 border-yellow-400 z-0"></div>
        
        <div 
          ref={wheelRef} 
          className={`absolute inset-0 rounded-full shadow-xl overflow-hidden border-8 border-gray-800 ${spinning ? 'transition-transform duration-[5000ms] ease-out' : 'transition-none'}`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {segments.map((segment, index) => {
            const rotateAngle = (index * 360) / segments.length;
            const skewAngle = 90 - (360 / segments.length);
            
            return (
              <div 
                key={index}
                className={`absolute w-1/2 h-1/2 left-1/2 top-0 origin-bottom-left ${segmentColors[index]} border-r border-gray-800/20`}
                style={{
                  transform: `rotate(${rotateAngle}deg) skew(${skewAngle}deg)`,
                }}
              >
                <div 
                  className="absolute w-full h-full -left-full origin-right"
                  style={{ 
                    transform: `skew(-${skewAngle}deg) rotate(${360 / segments.length / 2}deg)`
                  }}
                >
                  {/* Horizontal text positioning */}
                  <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-white font-bold text-center text-shadow">
                    <div className="md:text-lg text-base whitespace-nowrap px-2 -rotate-[20deg]">
                      {segment.split(' ')[0]}
                    </div>
                    <div className="md:text-sm text-xs whitespace-nowrap px-2 -rotate-[20deg] mt-1">
                      {segment.split(' ').slice(1).join(' ')}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Larger pointer */}
        <div className="absolute w-0 h-0 top-0 left-1/2 -mt-6 transform -translate-x-1/2 z-10">
          <div className="w-10 h-10 bg-gray-800 rotate-45 transform origin-bottom-left shadow-lg"></div>
        </div>
      </div>
      
      <button 
        className={`px-12 py-4 rounded-full text-xl font-bold text-white shadow-lg transform transition-all duration-300 ${
          spinning 
            ? 'bg-gray-500 cursor-not-allowed opacity-70' 
            : 'bg-orange-600 hover:bg-orange-700 hover:-translate-y-1 hover:shadow-xl active:translate-y-0'
        }`}
        onClick={spinWheel} 
        disabled={spinning}
      >
        {spinning ? 'Spinning...' : 'SPIN'}
      </button>
      
      {result && (
        <div className="mt-8 w-full max-w-md bg-white rounded-xl shadow-lg p-6 border-t-4 border-orange-500 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-700 text-center">You won:</h2>
          <div className="text-3xl font-bold mt-3 text-center text-orange-600">{result}</div>
        </div>
      )}
    </div>
  );
}

export default App