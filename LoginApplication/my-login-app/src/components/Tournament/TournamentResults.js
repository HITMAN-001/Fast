import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const TournamentResults = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false
    });
  }, []);

  // Sample tournament results data
  const resultsData = [
    {
      id: 1,
      tournament: 'Summer Open 2025',
      category: 'Under 12 Singles',
      winner: 'Arjun Mehta',
      runnerUp: 'Rohan Singh',
      score: '6-4, 7-5',
      date: 'May 15, 2025'
    },
    {
      id: 2,
      tournament: 'Summer Open 2025',
      category: 'Under 16 Singles',
      winner: 'Vikram Rathore',
      runnerUp: 'Ajay Kumar',
      score: '6-2, 6-3',
      date: 'May 15, 2025'
    },
    {
      id: 3,
      tournament: 'Summer Open 2025',
      category: 'Open Singles',
      winner: 'Rahul Sharma',
      runnerUp: 'Karan Patel',
      score: '7-6, 6-4',
      date: 'May 16, 2025'
    },
    {
      id: 4,
      tournament: 'Summer Open 2025',
      category: 'Under 12 Doubles',
      winner: 'Arjun Mehta / Rohan Singh',
      runnerUp: 'Aditya Verma / Nikhil Joshi',
      score: '6-3, 7-5',
      date: 'May 16, 2025'
    },
    {
      id: 5,
      tournament: 'Spring Challenge 2025',
      category: 'Under 12 Singles',
      winner: 'Rohan Singh',
      runnerUp: 'Nikhil Joshi',
      score: '6-2, 6-4',
      date: 'March 20, 2025'
    },
    {
      id: 6,
      tournament: 'Spring Challenge 2025',
      category: 'Under 16 Singles',
      winner: 'Ajay Kumar',
      runnerUp: 'Vikram Rathore',
      score: '3-6, 6-4, 6-3',
      date: 'March 20, 2025'
    },
    {
      id: 7,
      tournament: 'Spring Challenge 2025',
      category: 'Open Singles',
      winner: 'Karan Patel',
      runnerUp: 'Rahul Sharma',
      score: '6-4, 7-6',
      date: 'March 21, 2025'
    },
    {
      id: 8,
      tournament: 'Winter Cup 2024',
      category: 'Under 12 Singles',
      winner: 'Arjun Mehta',
      runnerUp: 'Aditya Verma',
      score: '7-5, 6-3',
      date: 'December 15, 2024'
    },
    {
      id: 9,
      tournament: 'Winter Cup 2024',
      category: 'Under 16 Singles',
      winner: 'Vikram Rathore',
      runnerUp: 'Rohit Kapoor',
      score: '6-1, 6-2',
      date: 'December 15, 2024'
    },
    {
      id: 10,
      tournament: 'Winter Cup 2024',
      category: 'Open Singles',
      winner: 'Rahul Sharma',
      runnerUp: 'Sunil Nair',
      score: '6-3, 7-6',
      date: 'December 16, 2024'
    }
  ];

  // Group results by tournament
  const groupedResults = resultsData.reduce((acc, result) => {
    if (!acc[result.tournament]) {
      acc[result.tournament] = [];
    }
    acc[result.tournament].push(result);
    return acc;
  }, {});

  return (
    <div className="py-6">
      <h1 
        className="text-3xl font-bold text-gray-800 mb-8 text-center"
        data-aos="fade-down"
      >
        Tournament Results
      </h1>
      
      {Object.entries(groupedResults).map(([tournament, results], tournamentIndex) => (
        <div 
          key={tournament}
          className="mb-10"
          data-aos="fade-up"
          data-aos-delay={(tournamentIndex * 100).toString()}
        >
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4 border-b-2 border-indigo-200 pb-2">
            {tournament}
          </h2>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-indigo-500 to-indigo-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Winner</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Runner-up</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Score</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result, index) => (
                    <tr 
                      key={result.id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      data-aos="fade-up"
                      data-aos-delay={(index * 50).toString()}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">{result.winner}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.runnerUp}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{result.score}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}
      
      <div className="mt-8 bg-indigo-50 p-6 rounded-lg shadow-sm" data-aos="fade-up" data-aos-delay="200">
        <h3 className="text-lg font-semibold text-indigo-700 mb-2">Player Rankings</h3>
        <p className="text-gray-700 mb-4">
          Player rankings are updated after each tournament. The current top ranked players in each category are:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          <li><span className="font-medium">Under 12:</span> Arjun Mehta, Rohan Singh, Aditya Verma</li>
          <li><span className="font-medium">Under 16:</span> Vikram Rathore, Ajay Kumar, Rohit Kapoor</li>
          <li><span className="font-medium">Open:</span> Rahul Sharma, Karan Patel, Sunil Nair</li>
        </ul>
      </div>
    </div>
  );
};

export default TournamentResults;
