'use client'

import { useState } from 'react';
import { FarmPlotGA, formatSolution, CropOption, cropOptions } from '../lib/farmPlotAllocation';

export default function Home() {
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const runAlgorithm = () => {
    setIsLoading(true);
    const ga = new FarmPlotGA(100, 0.2);
    const { solutions, fitnessScores } = ga.run(150);
    
    const formattedResults = solutions.map((solution, index) => 
      formatSolution(solution, fitnessScores[index])
    );
    
    setResults(formattedResults);
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Otimizador de Alocação de Terreno Agrícola
        </h1>
        
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg mb-8">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="px-6 py-4 text-left font-semibold">Cultura</th>
                <th className="px-6 py-4 text-right font-semibold">
                  <div className="flex flex-col">
                    <span>Espaço</span>
                    <span className="text-xs text-gray-300">(acres)</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-right font-semibold">
                  <div className="flex flex-col">
                    <span>Custo</span>
                    <span className="text-xs text-gray-300">(por unidade)</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-right font-semibold">
                  <div className="flex flex-col">
                    <span>Rendimento</span>
                    <span className="text-xs text-gray-300">(por unidade)</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-right font-semibold">
                  <div className="flex flex-col">
                    <span>Tempo</span>
                    <span className="text-xs text-gray-300">(dias)</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cropOptions.map((crop: CropOption, index) => (
                <tr 
                  key={index}
                  className={`
                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    hover:bg-blue-50 transition-colors duration-150
                  `}
                >
                  <td className="px-6 py-4 text-left font-medium text-gray-900">{crop.name}</td>
                  <td className="px-6 py-4 text-right text-gray-600">{crop.space_required}</td>
                  <td className="px-6 py-4 text-right text-gray-600">{crop.cost}</td>
                  <td className="px-6 py-4 text-right text-gray-600">{crop.yield}</td>
                  <td className="px-6 py-4 text-right text-gray-600">{crop.growth_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={runAlgorithm}
          disabled={isLoading}
          className={`
            px-6 py-3 rounded-lg text-white font-semibold mb-8 w-full sm:w-auto
            transition-colors duration-150
            ${isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            }
          `}
        >
          {isLoading ? 'Executando Algoritmo...' : 'Executar Otimização'}
        </button>

        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Top 10 Combinações de Culturas:
            </h2>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div 
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-600
                           hover:bg-blue-50 hover:border-blue-200 transition-colors duration-150"
                >
                  <span className="font-semibold text-gray-800">#{index + 1}</span> {result}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
